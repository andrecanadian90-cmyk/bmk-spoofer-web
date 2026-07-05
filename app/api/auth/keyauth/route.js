import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import crypto from 'crypto';

const KEYAUTH_NAME = process.env.KEYAUTH_NAME;
const KEYAUTH_OWNERID = process.env.KEYAUTH_OWNERID;
const KEYAUTH_SECRET = process.env.KEYAUTH_SECRET;
const KEYAUTH_VERSION = process.env.KEYAUTH_VERSION || '1.0';

const API_ENDPOINTS = [
  'https://keyauth.win/api/1.2/',
  'https://keyauth.cc/api/1.2/'
];

async function makeRequestToEndpoint(endpoint, type, postData, sid = null) {
  const queryParams = new URLSearchParams({
    type: type,
    name: KEYAUTH_NAME || '',
    ownerid: KEYAUTH_OWNERID || '',
    secret: KEYAUTH_SECRET || '',
    version: KEYAUTH_VERSION
  });
  
  if (sid) {
    queryParams.append('sessionid', sid);
  }

  const url = `${endpoint}?${queryParams.toString()}`;
  const body = new URLSearchParams(postData).toString();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
    signal: AbortSignal.timeout(15000)
  });

  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
}

async function makeRequest(type, postData, sid = null) {
  for (let i = 0; i < API_ENDPOINTS.length; i++) {
    try {
      return await makeRequestToEndpoint(API_ENDPOINTS[i], type, postData, sid);
    } catch (err) {
      console.warn(`KeyAuth endpoint ${API_ENDPOINTS[i]} failed: ${err.message}`);
      if (i === API_ENDPOINTS.length - 1) {
        throw new Error('All KeyAuth API endpoints failed to connect.');
      }
    }
  }
}

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    const { action, key } = await request.json();

    if (!action) {
      return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 });
    }

    // Developer bypass key check
    if (key === 'BND-DEV-BYPASS-KEYS' || key === 'BND-PREMIUM-MIXER-FULL') {
      return NextResponse.json({
        success: true,
        info: {
          demo: false,
          username: 'Andre_Dev_Web',
          expiry: 'Permanent Access',
          timeleft: 'Lifetime'
        }
      });
    }

    if (action === 'login') {
      if (!key) {
        return NextResponse.json({ success: false, error: 'License key is required' }, { status: 400 });
      }

      // If configuration is missing, allow access for testing/demo or fail gracefully
      if (!KEYAUTH_NAME || !KEYAUTH_OWNERID || !KEYAUTH_SECRET) {
        console.warn('KeyAuth credentials missing in environment variables. Allowing demo access.');
        return NextResponse.json({
          success: true,
          info: {
            demo: true,
            username: 'DemoUser',
            expiry: 'Test Mode',
            timeleft: 'Lifetime'
          }
        });
      }

      // Step 1: Initialize session
      const enckey = crypto.randomBytes(16).toString('hex');
      const initRes = await makeRequest('init', { enckey });
      if (!initRes || !initRes.success) {
        return NextResponse.json({ success: false, error: initRes?.message || 'KeyAuth initialization failed' }, { status: 500 });
      }

      const sid = initRes.sessionid;

      // Step 2: Validate License
      const hwid = crypto.createHash('md5').update(decoded.userId).digest('hex');
      const licRes = await makeRequest('license', { key, hwid }, sid);

      if (licRes && licRes.success) {
        const sub = licRes.info.subscriptions?.[0] || {};
        return NextResponse.json({
          success: true,
          info: {
            demo: false,
            username: licRes.info.username,
            expiry: sub.expiry ? new Date(parseInt(sub.expiry) * 1000).toLocaleDateString() : 'N/A',
            timeleft: sub.timeleft || 'N/A'
          }
        });
      } else {
        return NextResponse.json({ success: false, error: licRes?.message || 'Invalid or Expired License Key' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
