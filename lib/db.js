import dns from 'dns';

// Force application DNS resolution to use reliable Google & Cloudflare servers.
// This resolves "querySrv ECONNREFUSED" and local network DNS timeout issues.
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch (e) {
    console.warn('Failed to set custom DNS servers, using system default:', e.message);
  }
}

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
