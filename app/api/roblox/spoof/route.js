import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import Transaction from '@/lib/models/Transaction';
import { requireAuth } from '@/lib/auth';
import { parseAssetInput, downloadAsset, uploadAsset, getAssetInfo } from '@/lib/roblox';
import { enqueueSpoof } from '@/lib/queue';

export const maxDuration = 300;

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ success: false, error: 'Account banned' }, { status: 403 });

    const { assets: assetInput, type = 'animation', autoUpload = false } = await request.json();
    if (!assetInput) {
      return NextResponse.json({ success: false, error: 'No assets provided' }, { status: 400 });
    }

    const assets = parseAssetInput(assetInput);
    if (assets.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid assets found in input' }, { status: 400 });
    }

    // Verify asset type matches the requested feature type (prevent cross-feature bypass tricks)
    try {
      const infoPromises = assets.map(async (asset) => {
        const info = await getAssetInfo(asset.id, user.robloxCookie);
        return { asset, info };
      });
      const resolved = await Promise.all(infoPromises);
      
      for (const { asset, info } of resolved) {
        const assetType = (info.assetType || '').toLowerCase();
        const isAnimation = assetType === 'animation';
        const isAudio = assetType === 'audio';
        const isVideo = assetType === 'video' || info.assetTypeId === 62;
        const isMesh = info.assetTypeId === 4 || info.assetTypeId === 40 || assetType === 'mesh' || assetType === 'meshpart';
        const isUgc = [2, 8, 10, 11, 12, 13, 41, 42, 43, 44, 45, 46, 47, 70, 71, 72, 73, 74, 75, 76, 77, 80, 81, 82].includes(info.assetTypeId) || 
                      ['model', 'hat', 'shirt', 'pants', 'decal'].includes(assetType) || 
                      assetType.endsWith('accessory');
        
        if (type === 'animation' && !isAnimation) {
          throw new Error(`Asset ID ${asset.id} adalah tipe ${info.assetType}, bukan Animation. Silakan gunakan fitur yang sesuai.`);
        }
        if (type === 'audio' && !isAudio) {
          throw new Error(`Asset ID ${asset.id} adalah tipe ${info.assetType}, bukan Audio. Silakan gunakan fitur yang sesuai.`);
        }
        if (type === 'video' && !isVideo) {
          throw new Error(`Asset ID ${asset.id} adalah tipe ${info.assetType}, bukan Video. Silakan gunakan fitur yang sesuai.`);
        }
        if (type === 'mesh' && !isMesh) {
          throw new Error(`Asset ID ${asset.id} adalah tipe ${info.assetType}, bukan Mesh. Silakan gunakan fitur yang sesuai.`);
        }
        if (type === 'ugc' && !isUgc) {
          throw new Error(`Asset ID ${asset.id} adalah tipe ${info.assetType}, bukan UGC. Silakan gunakan fitur yang sesuai.`);
        }
      }
    } catch (err) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }

    // Rank detection (normalizing formatting & case from database)
    const normalizedRole = (user.role || '').toLowerCase().replace(/[- ]/g, '_');
    const totalTopUp = user.totalTopUp || 0;

    const isAdmin = normalizedRole === 'admin';
    const isTopSpender = normalizedRole === 'top_spender';
    const isExclusive = totalTopUp >= 500 && !isAdmin && !isTopSpender;
    const isPremium = totalTopUp >= 50 && totalTopUp < 500 && !isAdmin && !isTopSpender;
    const isBasic = !isAdmin && !isTopSpender && !isExclusive && !isPremium;

    // Determine batch size limit based on rank
    let maxBatchSize = 10;
    let rankName = 'BASIC';
    if (isAdmin) {
      maxBatchSize = 100;
      rankName = 'ADMIN';
    } else if (isTopSpender) {
      maxBatchSize = 100;
      rankName = 'TOP SPENDER';
    } else if (isExclusive) {
      maxBatchSize = 50;
      rankName = 'EXCLUSIVE';
    } else if (isPremium) {
      maxBatchSize = 25;
      rankName = 'PREMIUM';
    }

    if (assets.length > maxBatchSize) {
      return NextResponse.json({
        success: false,
        error: `Batas maksimal proses massal (bulk) untuk rank ${rankName} adalah ${maxBatchSize} aset per permintaan. (Jumlah input: ${assets.length} aset).`,
      }, { status: 400 });
    }

    // Enforce weekly usage limit ONLY for BASIC rank
    if (isBasic) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const successfulBypassesCount = await SpoofLog.countDocuments({
        userId: user._id,
        status: 'success',
        createdAt: { $gte: oneWeekAgo }
      });
      
      if (successfulBypassesCount >= 10) {
        return NextResponse.json({
          success: false,
          error: 'Batas penggunaan rank BASIC tercapai (Maksimal 10x bypass per minggu untuk seluruh tipe aset). Silakan lakukan top-up minimal 50 koin untuk meningkatkan pangkat ke PREMIUM dan menghapus batasan ini!'
        }, { status: 403 });
      }

      if (successfulBypassesCount + assets.length > 10) {
        return NextResponse.json({
          success: false,
          error: `Jumlah aset melebihi batas penggunaan mingguan rank BASIC Anda. Sisa slot bypass rank BASIC minggu ini: ${10 - successfulBypassesCount} aset.`
        }, { status: 403 });
      }
    }

    let costPerAsset = 0;
    const lowerType = type.toLowerCase();
    if (lowerType === 'ugc') {
      costPerAsset = 50;
    } else if (lowerType === 'mesh') {
      costPerAsset = 3;
    }

    const isFreeTier = isAdmin || isTopSpender;
    const totalCost = isFreeTier ? 0 : costPerAsset * assets.length;

    if (totalCost > 0 && user.coins < totalCost) {
      return NextResponse.json({
        success: false,
        error: `Insufficient coins. This operation requires ${totalCost} coins for ${assets.length} asset(s) (Your balance: ${user.coins} coins).`
      }, { status: 400 });
    }

    // Check roblox account linked (only if autoUpload is true)
    if (autoUpload) {
      if (!user.robloxCookie && !user.robloxApiKey) {
        return NextResponse.json({ 
          success: false, 
          error: 'Roblox account not linked. Link account to enable auto-upload.' 
        }, { status: 400 });
      }

      if (!user.robloxId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Roblox ID missing. Relink your account.' 
        }, { status: 400 });
      }
    }

    const queueResult = await enqueueSpoof(user.role, totalTopUp, async () => {
      // Re-fetch user in queue executor to ensure coin sanity
      const freshUser = await User.findById(user._id);
      if (!freshUser) throw new Error('User not found');
      if (freshUser.banned) throw new Error('Account banned');
      if (totalCost > 0 && freshUser.coins < totalCost) {
        throw new Error(`Insufficient coins. This operation requires ${totalCost} coins.`);
      }

      const jobResults = [];
      let jobSuccessCount = 0;
      let jobFailCount = 0;

      for (const asset of assets) {
        const startTime = Date.now();

        const log = await SpoofLog.create({
          userId: freshUser._id,
          originalAssetId: asset.id,
          originalLine: asset.originalLine,
          assetName: asset.name,
          status: 'pending',
        });

        try {
          const assetInfo = await getAssetInfo(asset.id, freshUser.robloxCookie);
          const downloaded = await downloadAsset(asset.id, freshUser.robloxCookie);

          let newAssetId = null;
          let fileData = null;
          
          if (autoUpload) {
            const uploadResult = await uploadAsset(
              freshUser.robloxApiKey || null,
              freshUser.robloxId,
              assetInfo.assetType,
              asset.name,
              `Spoofed: ${asset.name}`,
              downloaded.buffer,
              freshUser.robloxCookie || null
            );
            newAssetId = uploadResult.assetId;
          } else {
            fileData = downloaded.buffer.toString('base64');
          }

          log.status = 'success';
          log.fileSize = downloaded.size;
          log.newAssetId = newAssetId;
          log.duration = Date.now() - startTime;
          await log.save();
          jobSuccessCount++;

          jobResults.push({
            assetName: asset.name,
            originalId: asset.id,
            originalLine: asset.originalLine,
            newAssetId: newAssetId,
            fileSize: downloaded.size,
            status: 'success',
            duration: log.duration,
            fileData: fileData,
            assetType: assetInfo.assetType
          });

        } catch (err) {
          log.status = 'failed';
          log.error = err.message?.substring(0, 500);
          log.duration = Date.now() - startTime;
          await log.save();
          jobFailCount++;

          jobResults.push({
            assetName: asset.name,
            originalId: asset.id,
            originalLine: asset.originalLine,
            status: 'failed',
            error: err.message,
            duration: log.duration,
          });
        }
      }

      const freshTotalTopUp = freshUser.totalTopUp || 0;
      const freshIsFree = freshUser.role === 'admin' || freshTotalTopUp >= 1000;
      const finalCost = freshIsFree ? 0 : costPerAsset * jobSuccessCount;

      if (finalCost > 0) {
        freshUser.coins = Math.max(0, freshUser.coins - finalCost);
        freshUser.spentCoins = (freshUser.spentCoins || 0) + finalCost;
        await freshUser.save();

        await Transaction.create({
          userId: freshUser._id,
          type: 'spend',
          amount: -finalCost,
          description: `Bypassed ${jobSuccessCount} ${type.toUpperCase()} asset(s) (Cost: ${costPerAsset} coins/asset)`
        });
      }

      return { successCount: jobSuccessCount, failCount: jobFailCount, results: jobResults };
    });

    return NextResponse.json({
      success: true,
      data: {
        total: assets.length,
        successful: queueResult.successCount,
        failed: queueResult.failCount,
        logs: queueResult.results,
        message: queueResult.successCount > 0 
          ? `✅ Successfully spoofed and uploaded ${queueResult.successCount}/${assets.length} assets to your Roblox account!`
          : '❌ All uploads failed.',
      },
    });

  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
