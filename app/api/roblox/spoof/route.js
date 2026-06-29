import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import Transaction from '@/lib/models/Transaction';
import { requireAuth } from '@/lib/auth';
import { parseAssetInput, getAssetInfo, downloadAsset, uploadAsset, checkOperation } from '@/lib/roblox';

export const maxDuration = 60; // Vercel Pro: 60s timeout

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ success: false, error: 'Account banned' }, { status: 403 });
    if (!user.robloxId || !user.robloxApiKey) {
      return NextResponse.json({ success: false, error: 'Link your Roblox account first' }, { status: 400 });
    }

    const { assets: assetInput } = await request.json();
    if (!assetInput) {
      return NextResponse.json({ success: false, error: 'No assets provided' }, { status: 400 });
    }

    const assets = parseAssetInput(assetInput);
    if (assets.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid assets found in input' }, { status: 400 });
    }

    // Limit per batch (Vercel timeout)
    if (assets.length > 20) {
      return NextResponse.json({
        success: false,
        error: `Max 20 assets per batch. Got ${assets.length}. Split into multiple batches.`,
      }, { status: 400 });
    }

    if (user.coins < assets.length) {
      return NextResponse.json({
        success: false,
        error: `Not enough coins. Need ${assets.length}, have ${user.coins}`,
      }, { status: 400 });
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const asset of assets) {
      const startTime = Date.now();

      // Create pending log
      const log = await SpoofLog.create({
        userId: user._id,
        originalAssetId: asset.id,
        assetName: asset.name,
        status: 'pending',
      });

      try {
        // Step 1: Get asset info (type, real name) using the stored Roblox Cookie
        let assetInfo;
        try {
          assetInfo = await getAssetInfo(asset.id, user.robloxCookie);
          log.assetName = assetInfo.name || asset.name;
        } catch {
          // If we can't get info, proceed with defaults
          assetInfo = { assetType: 'Model', isAnimation: false, name: asset.name };
        }

        // Step 2: Download asset using the stored Roblox Cookie
        const downloaded = await downloadAsset(asset.id, user.robloxCookie);
        log.fileSize = downloaded.size;

        // Step 3: Upload to user's account
        const uploaded = await uploadAsset(
          user.robloxApiKey,
          user.robloxId,
          assetInfo.assetType,
          assetInfo.name || asset.name,
          `Spoofed from ${asset.id}`,
          downloaded.buffer
        );

        // Step 4: Check if upload needs async resolution
        let finalAssetId = uploaded.assetId;
        if (!finalAssetId && uploaded.operationId) {
          // Wait a bit then check operation
          await new Promise(r => setTimeout(r, 2000));
          const opResult = await checkOperation(user.robloxApiKey, uploaded.operationId);
          if (opResult) {
            finalAssetId = opResult.assetId;
            if (opResult.error) throw new Error(opResult.error);
          } else {
            finalAssetId = `pending:${uploaded.operationId}`;
          }
        }

        // Success
        log.status = 'success';
        log.newAssetId = String(finalAssetId || 'processing');
        log.duration = Date.now() - startTime;
        await log.save();
        successCount++;

        results.push({
          assetName: log.assetName,
          originalId: asset.id,
          newId: finalAssetId,
          status: 'success',
          assetType: assetInfo.assetType,
          isAnimation: assetInfo.isAnimation,
          fileSize: downloaded.size,
          duration: log.duration,
        });

      } catch (err) {
        log.status = 'failed';
        log.error = err.message?.substring(0, 500);
        log.duration = Date.now() - startTime;
        await log.save();
        failCount++;

        results.push({
          assetName: log.assetName || asset.name,
          originalId: asset.id,
          status: 'failed',
          error: err.message,
          duration: log.duration,
        });
      }

      // Small delay between assets to avoid rate limiting
      if (assets.indexOf(asset) < assets.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // Deduct coins for successful spoofs
    if (successCount > 0) {
      user.coins -= successCount;
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'spend',
        amount: -successCount,
        description: `Spoofed ${successCount} asset(s) (${failCount} failed)`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        total: assets.length,
        successful: successCount,
        failed: failCount,
        remainingCoins: user.coins,
        logs: results,
      },
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
