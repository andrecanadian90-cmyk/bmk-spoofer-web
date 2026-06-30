import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const stateCookie = request.cookies.get('oauth_state')?.value;

    if (error) {
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=${encodeURIComponent(error)}`);
    }

    if (!state || !stateCookie || state !== stateCookie) {
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=Invalid+state+parameter+(CSRF+Attempt+Blocked)`);
    }

    if (!code) {
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=Missing+auth+code`);
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/discord/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'Discord Client credentials are not configured.' }, { status: 500 });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errDetails = await tokenResponse.text();
      return NextResponse.json({ success: false, error: 'Failed to exchange Discord code', details: errDetails }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch user profile from Discord' }, { status: 400 });
    }

    const discordUser = await userResponse.json();
    const { id: discordId, username, email, avatar } = discordUser;

    if (!email) {
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=Discord+account+must+have+a+verified+email`);
    }

    await connectDB();

    const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : null;

    // 1. Try to find user by discordId
    let user = await User.findOne({ discordId });

    if (!user) {
      // 2. If not found, try to find user by email
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Link Discord account to existing user
        user.discordId = discordId;
        user.discordUsername = username;
        user.discordAvatar = avatarUrl;
        await user.save();
      } else {
        // 3. Create a brand new user
        // Ensure username is unique
        let finalUsername = username;
        const usernameExists = await User.findOne({ username: finalUsername });
        if (usernameExists) {
          finalUsername = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // Set role - check if they match ADMIN_EMAIL
        const role = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user';

        user = await User.create({
          email: email.toLowerCase(),
          username: finalUsername,
          discordId,
          discordUsername: username,
          discordAvatar: avatarUrl,
          role,
          coins: 0,
        });
      }
    } else {
      // Update properties on login
      user.discordUsername = username;
      user.discordAvatar = avatarUrl;
    }

    user.lastLogin = new Date();
    await user.save();

    // Sign JWT token
    const token = signToken({ userId: user._id.toString(), role: user.role });

    // Redirect to frontend token receiver page and clear state cookie
    const response = NextResponse.redirect(`${new URL(request.url).origin}/auth/callback?token=${token}`);
    response.cookies.delete('oauth_state');
    return response;
  } catch (err) {
    const response = NextResponse.redirect(`${new URL(request.url).origin}/login?error=${encodeURIComponent(err.message)}`);
    try {
      response.cookies.delete('oauth_state');
    } catch {}
    return response;
  }
}
