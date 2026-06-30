import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/discord/callback`;

  if (!clientId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Discord Login is not configured. Please define DISCORD_CLIENT_ID in .env.local' 
    }, { status: 500 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email&state=${state}`;
  
  const response = NextResponse.redirect(url);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300, // 5 minutes
    path: '/'
  });

  return response;
}
