import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const users = await User.find().select('-password -robloxApiKey').sort({ createdAt: -1 }).lean();

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const spoofCount = await SpoofLog.countDocuments({ userId: u._id });
        return { ...u, spoofCount };
      })
    );

    return NextResponse.json({ success: true, data: usersWithStats });
  } catch (err) {
    const status = err.message.includes('Admin') || err.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}

export async function PATCH(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const { userId, action, totalTopUp } = await request.json();
    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'userId and action are required' }, { status: 400 });
    }

    const update = {};
    if (action === 'ban') update.banned = true;
    else if (action === 'unban') update.banned = false;
    else if (action === 'make_admin') update.role = 'admin';
    else if (action === 'remove_admin') update.role = 'user';
    else if (action === 'set_total_topup') {
      const val = Number(totalTopUp);
      if (val >= 1000) {
        update.role = 'top_spender';
        update.totalTopUp = 1000;
        update.coins = 999999;
      } else {
        update.role = 'user';
        update.totalTopUp = val;
        update.coins = val;
      }
    }
    else return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    const status = err.message.includes('Admin') || err.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
