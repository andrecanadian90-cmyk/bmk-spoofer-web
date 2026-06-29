import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import Transaction from '@/lib/models/Transaction';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const [totalUsers, totalSpoofs, successfulSpoofs, failedSpoofs] = await Promise.all([
      User.countDocuments(),
      SpoofLog.countDocuments(),
      SpoofLog.countDocuments({ status: 'success' }),
      SpoofLog.countDocuments({ status: 'failed' }),
    ]);

    const coinsResult = await Transaction.aggregate([
      { $match: { type: 'topup' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalCoinsDistributed = coinsResult[0]?.total || 0;

    const recentActivity = await SpoofLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'username')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalSpoofs,
        successfulSpoofs,
        failedSpoofs,
        totalCoinsDistributed,
        successRate: totalSpoofs > 0 ? ((successfulSpoofs / totalSpoofs) * 100).toFixed(1) : 0,
        recentActivity,
      },
    });
  } catch (err) {
    const status = err.message.includes('Admin') || err.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
