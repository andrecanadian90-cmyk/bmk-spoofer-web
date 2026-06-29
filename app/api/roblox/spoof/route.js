import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import Transaction from '@/lib/models/Transaction';
import { requireAuth } from '@/lib/auth';
import { parseAssetInput, downloadAsset, uploadAsset } from '@/lib/roblox';

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
      const log = await SpoofLog.create({
        userId: user._id,
        originalAssetId: asset.id,
        assetName: asset.name,
        status: 'pending',
      });

      try {
        const downloaded = await downloadAsset(asset.id);
        const uploaded = await uploadAsset(
          user.robloxApiKey,
          user.robloxId,
          'Model',
          asset.name,
          downloaded.buffer
        );

        log.status = 'success';
        log.newAssetId = uploaded.assetId || 'pending';
        log.fileSize = downloaded.size;
        log.duration = Date.now() - startTime;
        await log.save();
        successCount++;

        results.push({
          assetName: asset.name,
          originalId: asset.id,
          newId: uploaded.assetId,
          status: 'success',
          fileSize: downloaded.size,
          duration: log.duration,
        });
      } catch (err) {
        log.status = 'failed';
        log.error = err.message;
        log.duration = Date.now() - startTime;
        await log.save();
        failCount++;

        results.push({
          assetName: asset.name,
          originalId: asset.id,
          status: 'failed',
          error: err.message,
          duration: log.duration,
        });
      }
    }

    if (successCount > 0) {
      user.coins -= successCount;
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'spend',
        amount: -successCount,
        description: `Spoofed ${successCount} asset(s)`,
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
