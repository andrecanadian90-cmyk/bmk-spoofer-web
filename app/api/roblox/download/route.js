import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { downloadAsset } from '@/lib/roblox';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export const maxDuration = 300;

export async function GET(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ error: 'Account banned' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    
    if (!assetId) {
      return NextResponse.json({ error: 'assetId required' }, { status: 400 });
    }

    // Download asset
    const downloaded = await downloadAsset(assetId, user.robloxCookie);

    // Return as binary file download
    return new NextResponse(downloaded.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="animation_${assetId}.rbxm"`,
        'Content-Length': downloaded.size,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
