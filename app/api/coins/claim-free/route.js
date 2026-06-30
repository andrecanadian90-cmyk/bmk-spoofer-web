import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const sessionUser = requireAuth(request);
    await connectDB();

    const user = await User.findById(sessionUser.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Check if user has already claimed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const claimedToday = await Transaction.findOne({
      userId: user._id,
      type: 'topup',
      description: 'Daily Free Coin Claim',
      createdAt: { $gte: startOfToday }
    });

    if (claimedToday) {
      return NextResponse.json({ 
        success: false, 
        error: 'You have already claimed your daily free coin. Refill with top-up packages or try again tomorrow.' 
      }, { status: 400 });
    }

    // Award 1 free coin
    user.coins += 1;
    await user.save();

    // Log the transaction
    await Transaction.create({
      userId: user._id,
      type: 'topup',
      amount: 1,
      description: 'Daily Free Coin Claim'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Daily free coin claimed successfully!',
      coins: user.coins
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
