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

    const hasAccess = user.mixingIsPermanent || (user.mixingExpiry && new Date(user.mixingExpiry) > new Date());
    if (!hasAccess) {
      return NextResponse.json({ success: false, error: 'Lisensi Mixing Anda tidak aktif atau telah kedaluwarsa.' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
