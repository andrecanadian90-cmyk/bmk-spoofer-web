import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { requireAuth } from '@/lib/auth';
import { getRobloxUser } from '@/lib/roblox';

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const { robloxId, apiKey, robloxCookie } = await request.json();
    if (!robloxId || !apiKey) {
      return NextResponse.json({ success: false, error: 'Roblox ID and API Key are required' }, { status: 400 });
    }

    const robloxUser = await getRobloxUser(robloxId);

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        robloxId, 
        robloxUsername: robloxUser.name, 
        robloxApiKey: apiKey,
        robloxCookie: robloxCookie || null // Save cookie (optional)
      },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      data: {
        robloxId: user.robloxId,
        robloxUsername: user.robloxUsername,
        robloxDisplayName: robloxUser.displayName,
        hasCookie: !!user.robloxCookie
      },
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
