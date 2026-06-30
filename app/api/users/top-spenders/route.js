import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    // Require standard authentication
    requireAuth(request);
    await connectDB();

    // Find all users who are explicitly assigned the role of 'top_spender'
    const topSpenders = await User.find({ role: 'top_spender' })
    .select('username discordUsername discordAvatar totalTopUp role')
    .sort({ totalTopUp: -1 })
    .limit(10)
    .lean();

    return NextResponse.json({
      success: true,
      data: topSpenders
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
