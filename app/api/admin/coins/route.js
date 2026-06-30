import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    const decoded = requireAdmin(request);
    await connectDB();

    const { userId, amount, description } = await request.json();
    if (!userId || !amount) {
      return NextResponse.json({ success: false, error: 'userId and amount are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const addedAmount = Number(amount);
    user.coins += addedAmount;
    if (user.coins < 0) user.coins = 0;
    if (addedAmount > 0) {
      user.totalTopUp = (user.totalTopUp || 0) + addedAmount;
    }
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'topup',
      amount: Number(amount),
      description: description || `Admin top-up: ${amount} coins`,
      adminId: decoded.userId,
    });

    return NextResponse.json({
      success: true,
      data: { userId: user._id, username: user.username, coins: user.coins },
    });
  } catch (err) {
    const status = err.message.includes('Admin') || err.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
