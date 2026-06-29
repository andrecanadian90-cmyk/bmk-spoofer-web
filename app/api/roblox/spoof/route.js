import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import { requireAuth } from '@/lib/auth';
import { parseAssetInput, downloadAsset } from '@/lib/roblox';

export const maxDuration = 300;

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ success: false, error: 'Account banned' }, { status: 403 });

    const { assets: assetInput } = await request.json();
    if (!assetInput) {
      return NextResponse.json({ success: false, error: 'No assets provided' }, { status: 400 });
    }

    const assets = parseAssetInput(assetInput);
    if (assets.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid assets found in input' }, { status: 400 });
    }

    if (assets.length > 5) {
      return NextResponse.json({
        success: false,
        error: `Max 5 assets per download. Got ${assets.length}.`,
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
        // Download asset
        const downloaded = await downloadAsset(asset.id, user.robloxCookie);

        // Success
        log.status = 'success';
        log.fileSize = downloaded.size;
        log.newAssetId = `download_${asset.id}`;
        log.duration = Date.now() - startTime;
        await log.save();
        successCount++;

        results.push({
          assetName: asset.name,
          originalId: asset.id,
          fileSize: downloaded.size,
          status: 'success',
          fileName: `animation_${asset.id}.rbxm`,
          buffer: downloaded.buffer.toString('base64'),
          duration: log.duration,
        });

      } catch (err) {
        log.status = 'failed';
        log.error = err.message?.substring(0, 500);
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

    return NextResponse.json({
      success: true,
      data: {
        total: assets.length,
        successful: successCount,
        failed: failCount,
        logs: results,
        message: successCount > 0 ? 'Files ready for download. Import to Studio: Insert → Object → Select File.' : 'All downloads failed.',
      },
    });

  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
