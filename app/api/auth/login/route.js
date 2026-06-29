import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.banned) {
      return NextResponse.json({ success: false, error: 'Account is banned' }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id, 
          email: user.email, 
          username: user.username,
          role: user.role, 
          coins: user.coins,
          robloxId: user.robloxId, 
          robloxUsername: user.robloxUsername,
          robloxCookie: user.robloxCookie ? 'linked' : null, // Masked representation for safety
        },
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
