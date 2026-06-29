import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { downloadAsset } from '@/lib/roblox';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export const maxDuration = 300;

export async function GET(request) {
  try {
    console.log('[DOWNLOAD] Request start');
    const decoded = requireAuth(request);
    console.log('[DOWNLOAD] Auth decoded:', decoded.userId);
    await connectDB();

    const user = await User.findById(decoded.userId);
    console.log('[DOWNLOAD] User found:', !!user);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ error: 'Account banned' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    console.log('[DOWNLOAD] AssetId:', assetId);
    
    if (!assetId) {
      return NextResponse.json({ error: 'assetId required' }, { status: 400 });
    }

    console.log('[DOWNLOAD] Calling downloadAsset with cookie length:', user.robloxCookie?.length || 0);
    // Download asset
    const downloaded = await downloadAsset(assetId, user.robloxCookie);
    console.log('[DOWNLOAD] Download success, size:', downloaded.size);

    // Return as binary file download
    return new NextResponse(downloaded.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="animation_${assetId}.rbxm"`,
        'Content-Length': downloaded.size,
      },
    });
  } catch (err) {
    console.error('[DOWNLOAD] Error:', err.message, err.stack);
    return NextResponse.json(
      { error: err.message },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
