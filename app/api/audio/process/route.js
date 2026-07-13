import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import SpoofLog from '@/lib/models/SpoofLog';
import { requireAuth } from '@/lib/auth';
import { uploadAsset } from '@/lib/roblox';

export const maxDuration = 300; // 5 minutes max duration for Next.js

// Retrieve biner path from process.env or fallback to cenz Dir on PC
const FFMPEG_PATH = process.env.FFMPEG_PATH || "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\cenzstudio-clone\\bin\\ffmpeg.exe";
const YTDLP_PATH = process.env.YTDLP_PATH || "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\cenzstudio-clone\\bin\\yt-dlp.exe";

function execProcess(bin, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { windowsHide: true, ...options });
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });
    
    proc.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Process exited with code ${code}.\nStderr: ${stderr}`));
    });
    proc.on('error', (err) => { reject(err); });
  });
}

export async function POST(request) {
  const tempFiles = [];
  try {
    const decoded = requireAuth(request);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    if (user.banned) return NextResponse.json({ success: false, error: 'Account banned' }, { status: 403 });

    // We can parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const ytUrl = formData.get('ytUrl');
    const speed = parseFloat(formData.get('speed') || '1.0');
    const amplification = parseFloat(formData.get('amplification') || '0');
    const bypassMode = formData.get('bypassMode') || 'optimal'; // 'optimal' or 'custom'
    const autoUpload = formData.get('autoUpload') === 'true';
    const robloxApiKey = formData.get('robloxApiKey') || user.robloxApiKey;
    const robloxCreatorId = formData.get('robloxCreatorId') || user.robloxId;
    const robloxCreatorType = formData.get('robloxCreatorType') || 'User'; // 'User' or 'Group'
    const assetName = formData.get('assetName') || 'SpoofedAudio';

    let inputPath = '';
    const tempDir = os.tmpdir();
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (ytUrl) {
      // 1. YouTube Download
      const dlTemplate = path.join(tempDir, `${jobId}.%(ext)s`);
      const ytdlpArgs = [
        ytUrl,
        '-x',
        '--audio-format', 'wav',
        '-o', dlTemplate,
        '--no-playlist',
        '--no-warnings',
        '--extractor-args', 'youtube:player_client=web,default',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        '--referer', 'https://www.youtube.com/',
        '--sleep-interval', '1',
        '--max-sleep-interval', '3'
      ];
      
      console.log(`Running yt-dlp to download YouTube URL: ${ytUrl}`);
      await execProcess(YTDLP_PATH, ytdlpArgs);
      
      // Find downloaded wav file
      const wavPath = path.join(tempDir, `${jobId}.wav`);
      if (!fs.existsSync(wavPath)) {
        throw new Error('yt-dlp failed to download and extract audio in WAV format.');
      }
      inputPath = wavPath;
      tempFiles.push(wavPath);
    } else if (file && file instanceof File) {
      // 2. Local File Upload
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.mp3';
      const localFilePath = path.join(tempDir, `${jobId}${ext}`);
      fs.writeFileSync(localFilePath, buffer);
      inputPath = localFilePath;
      tempFiles.push(localFilePath);
    } else {
      return NextResponse.json({ success: false, error: 'Harap unggah file audio lokal atau masukkan link YouTube.' }, { status: 400 });
    }

    // 3. FFMPEG Conversion
    const tempWavPath = path.join(tempDir, `${jobId}_full.wav`);
    tempFiles.push(tempWavPath);

    let ffmpegArgs = ['-y', '-i', inputPath];
    let audioFilters = '';

    if (bypassMode === 'optimal') {
      // Optimal Bypass (Signature spoofing logic extracted from desktop app)
      audioFilters = [
        'aresample=48000',
        'asetrate=48000*0.985',
        'aresample=48000',
        'equalizer=f=60:t=q:w=1.5:g=-1.5',
        'equalizer=f=150:t=q:w=1.0:g=1.0',
        'equalizer=f=400:t=q:w=1.0:g=-0.8',
        'equalizer=f=1000:t=q:w=1.2:g=0.5',
        'equalizer=f=2500:t=q:w=1.0:g=-1.0',
        'equalizer=f=5000:t=q:w=1.0:g=1.2',
        'equalizer=f=8000:t=q:w=0.8:g=-0.8',
        'equalizer=f=12000:t=q:w=1.0:g=0.5',
        'equalizer=f=16000:t=q:w=1.0:g=-1.0',
        'chorus=0.7:0.9:55|40:0.4|0.3:0.25|0.4:2|1.3',
        'adelay=3|0',
        'volume=0.5dB'
      ].join(',');
    } else {
      // Custom configuration settings
      const filters = [];
      if (speed && speed !== 1.0) {
        filters.push(`aresample=48000`, `asetrate=48000*${speed}`, `aresample=48000`);
      }
      if (amplification && amplification !== 0) {
        filters.push(`volume=${amplification}dB`);
      }
      if (filters.length > 0) {
        audioFilters = filters.join(',');
      }
    }

    if (audioFilters) {
      ffmpegArgs.push('-af', audioFilters);
    }

    ffmpegArgs.push('-c:a', 'pcm_s16le', '-progress', 'pipe:1', tempWavPath);
    console.log(`Running FFMPEG first pass (WAV): ${ffmpegArgs.join(' ')}`);
    await execProcess(FFMPEG_PATH, ffmpegArgs);

    // Final encoding pass to libvorbis (.ogg) for Roblox upload format
    const outputOggPath = path.join(tempDir, `${jobId}_converted_0.ogg`);
    tempFiles.push(outputOggPath);

    const oggArgs = [
      '-y',
      '-i', tempWavPath,
      '-c:a', 'libvorbis',
      '-q:a', '6',
      '-ar', '48000',
      outputOggPath
    ];
    console.log(`Running FFMPEG second pass (OGG): ${oggArgs.join(' ')}`);
    await execProcess(FFMPEG_PATH, oggArgs);

    const oggBuffer = fs.readFileSync(outputOggPath);
    const audioName = assetName.replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 50) || `Audio_${Date.now()}`;

    // 4. Auto-Upload to Roblox via Open Cloud API
    if (autoUpload) {
      if (!robloxApiKey || !robloxCreatorId) {
        throw new Error('Konfigurasi unggah otomatis Roblox (API Key atau Creator ID) tidak lengkap.');
      }
      
      console.log(`Uploading to Roblox: Name="${audioName}", CreatorType="${robloxCreatorType}", CreatorId="${robloxCreatorId}"`);
      const uploadResult = await uploadAsset(
        robloxApiKey,
        robloxCreatorId,
        'Audio',
        audioName,
        'Dibuat otomatis oleh Spoofer Audio BERNADA',
        oggBuffer
      );

      // Create spoof log record
      await SpoofLog.create({
        userId: user._id,
        originalAssetId: ytUrl ? 'YouTube' : file.name,
        originalLine: ytUrl || file.name,
        assetName: audioName,
        assetType: 'audio',
        cost: 0,
        robloxAssetId: uploadResult.assetId,
        status: 'success',
        processedBy: 'web_ffmpeg',
        durationMs: 0
      });

      return NextResponse.json({
        success: true,
        message: 'Audio berhasil di-bypass dan diunggah otomatis ke Roblox.',
        assetId: uploadResult.assetId
      });
    }

    // 5. Normal mode: download converted bypass file directly
    // Create spoof log record
    await SpoofLog.create({
      userId: user._id,
      originalAssetId: ytUrl ? 'YouTube' : file.name,
      originalLine: ytUrl || file.name,
      assetName: audioName,
      assetType: 'audio',
      cost: 0,
      robloxAssetId: 'downloaded_only',
      status: 'success',
      processedBy: 'web_ffmpeg',
      durationMs: 0
    });

    return new NextResponse(oggBuffer, {
      headers: {
        'Content-Type': 'audio/ogg',
        'Content-Disposition': `attachment; filename="${audioName}.ogg"`,
        'Content-Length': String(oggBuffer.length),
      },
    });

  } catch (err) {
    console.error('[AUDIO PROCESS ERROR]:', err.message, err.stack);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    // Cleanup temporary files
    for (const f of tempFiles) {
      try {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
        }
      } catch (e) {
        console.warn(`Failed to cleanup temp file ${f}:`, e.message);
      }
    }
  }
}
