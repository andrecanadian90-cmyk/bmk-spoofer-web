import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.mixingTrialClaimed) {
      return NextResponse.json({ success: false, error: 'Uji coba gratis Anda sudah diklaim sebelumnya.' }, { status: 400 });
    }

    // Set trial claimed to true and grant 1-day access in DB
    user.mixingTrialClaimed = true;
    user.mixingIsTrialActive = true;
    user.mixingExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.mixingIsPermanent = false;
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        mixingExpiry: user.mixingExpiry,
        mixingIsPermanent: user.mixingIsPermanent,
        mixingTrialClaimed: user.mixingTrialClaimed
      }
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
