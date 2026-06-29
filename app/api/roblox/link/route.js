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
    if (!robloxId) {
      return NextResponse.json({ success: false, error: 'Roblox User ID is required' }, { status: 400 });
    }

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // API Key is required only if it doesn't exist in DB and is not provided in request
    if (!currentUser.robloxApiKey && !apiKey) {
      return NextResponse.json({ success: false, error: 'Open Cloud API Key is required' }, { status: 400 });
    }

    const robloxUser = await getRobloxUser(robloxId);

    const updateData = {
      robloxId,
      robloxUsername: robloxUser.name,
    };

    if (apiKey) {
      updateData.robloxApiKey = apiKey;
    }
    
    if (robloxCookie !== undefined) {
      updateData.robloxCookie = robloxCookie || null;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
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
