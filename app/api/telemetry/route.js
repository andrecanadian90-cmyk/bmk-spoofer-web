import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAuth(request);
    await connectDB();

    // 1. Calculate actual online users (active in the last 5 minutes)
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const onlineCount = await User.countDocuments({ lastLogin: { $gte: fiveMinutesAgo } });

    // 2. Fetch the latest 5 successful global bypass activities
    const latestLogs = await SpoofLog.find({ status: 'success' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username')
      .lean();

    // Format logs into client-friendly activity feed format
    const activity = latestLogs.map((log) => {
      const username = log.userId?.username || 'User';
      const maskedUser = username.length > 4 
        ? `${username.slice(0, 3)}***${username.slice(-2)}` 
        : `${username}***`;

      // Determine asset type based on name or log characteristics
      let type = 'Audio';
      if (log.assetName?.toLowerCase().includes('mesh') || log.assetName?.toLowerCase().includes('ugc') || log.assetName?.toLowerCase().includes('sword') || log.assetName?.toLowerCase().includes('valk')) {
        type = 'Mesh';
      } else if (log.assetName?.toLowerCase().includes('anim') || log.assetName?.toLowerCase().includes('jump') || log.assetName?.toLowerCase().includes('sprint')) {
        type = 'Animation';
      }

      // Calculate time difference
      const diffMs = Date.now() - new Date(log.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let timeText = 'Just now';
      if (diffMins > 0) {
        timeText = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      }

      // Mask long numeric sequences (Roblox Asset IDs) in the asset name
      const rawAsset = log.assetName || 'Unknown Asset';
      const maskedAsset = rawAsset.replace(/\d{6,}/g, (match) => {
        if (match.length <= 6) return '***';
        return `${match.slice(0, 5)}*****${match.slice(-4)}`;
      });

      return {
        id: log._id.toString(),
        user: maskedUser,
        asset: maskedAsset,
        type,
        status: 'SUCCESS',
        time: timeText
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        onlineCount: Math.max(1, onlineCount), // Always show at least 1 (the current user)
        activity: activity.length > 0 ? activity : [
          { id: 'placeholder-1', user: 'Adm***77', asset: 'Classic Sword UGC', type: 'Mesh', status: 'SUCCESS', time: '1 min ago' },
          { id: 'placeholder-2', user: 'ndr***gg', asset: 'Future Synth Bass', type: 'Audio', status: 'SUCCESS', time: '3 mins ago' }
        ]
      }
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
