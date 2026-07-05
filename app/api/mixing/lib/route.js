import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    const token = searchParams.get('token');

    // 1. Input Validation: strictly allow only the specific library files to prevent LFI
    const allowedFiles = ['lame.min.js', 'OggVorbisEncoder.min.js', 'OggVorbisEncoder.min.js.mem'];
    if (!filename || !allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 2. Authentication: Validate token
    if (!token) {
      return NextResponse.json({ error: 'Authentication token required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 3. Authorization: Check license in database
    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasAccess = user.mixingIsPermanent || (user.mixingExpiry && new Date(user.mixingExpiry) > new Date());
    if (!hasAccess) {
      return NextResponse.json({ error: 'Lisensi Mixing Anda tidak aktif atau telah kedaluwarsa.' }, { status: 403 });
    }

    // 4. Serve the file
    const filePath = path.join(process.cwd(), 'private_libs', filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    let contentType = 'application/javascript';
    if (filename.endsWith('.mem')) {
      contentType = 'application/octet-stream';
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
