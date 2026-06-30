import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { requireAuth, signToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    user.lastLogin = new Date();
    await user.save();

    let robloxAvatar = null;
    let robloxDisplayName = user.robloxDisplayName;
    if (user.robloxId) {
      try {
        const fetchPromises = [
          fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.robloxId}&size=150x150&format=Png&isCircular=true`)
        ];
        if (!robloxDisplayName) {
          fetchPromises.push(fetch(`https://users.roblox.com/v1/users/${user.robloxId}`));
        }

        const resolved = await Promise.all(fetchPromises);
        const thumbData = await resolved[0].json();
        if (thumbData?.data?.[0]?.imageUrl) {
          robloxAvatar = thumbData.data[0].imageUrl;
        }

        if (!robloxDisplayName && resolved[1]) {
          const userData = await resolved[1].json();
          if (userData?.displayName) {
            robloxDisplayName = userData.displayName;
            user.robloxDisplayName = userData.displayName;
            await user.save();
          }
        }
      } catch (err) {}
    }

    let newToken = null;
    if (user.role !== decoded.role) {
      newToken = signToken({ userId: user._id.toString(), role: user.role });
    }

    return NextResponse.json({
      success: true,
      newToken,
      data: {
        id: user._id, 
        email: user.email, 
        username: user.username,
        role: user.role, 
        coins: user.coins, 
        banned: user.banned,
        robloxId: user.robloxId, 
        robloxUsername: user.robloxUsername,
        robloxDisplayName: robloxDisplayName || user.robloxUsername,
        robloxAvatar,
        robloxCookie: user.robloxCookie ? 'linked' : null, // Masked representation for safety
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        discordAvatar: user.discordAvatar,
        spentCoins: user.spentCoins || 0,
        totalTopUp: user.totalTopUp || 0,
        createdAt: user.createdAt, 
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
