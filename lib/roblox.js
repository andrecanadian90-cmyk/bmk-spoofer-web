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
  
  // Remove leading .ROBLOSECURITY= if pasted by mistake
  if (clean.startsWith('.ROBLOSECURITY=')) {
    clean = clean.substring('.ROBLOSECURITY='.length);
  }
  
  // Remove surrounding quotes if any
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

  const res = await fetch(`https://economy.roblox.com/v2/assets/${assetId}/details`, { headers });

  if (!res.ok) {
    // Fallback to older endpoint
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

// Download asset binary from Roblox
export async function downloadAsset(assetId, cookie = null) {
  const cleanCookie = getCleanCookie(cookie);
  const headers = {
    Accept: 'application/json',
    'Roblox-Place-Id': '0',
    'User-Agent': 'Roblox/WinInet',
  };

  if (cleanCookie) {
    headers['Cookie'] = `.ROBLOSECURITY=${cleanCookie}`;
  }

  // Try v1 endpoint first — returns JSON with location
  const infoRes = await fetch(`https://assetdelivery.roblox.com/v1/assetId/${assetId}`, { headers });

  let downloadUrl = null;

  if (infoRes.ok) {
    const contentType = infoRes.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const info = await infoRes.json();
      downloadUrl = info.location || info.Location;
    } else {
      // Direct binary response
      const buffer = Buffer.from(await infoRes.arrayBuffer());
      if (buffer.length > 0) {
        return { buffer, size: buffer.length, contentType };
      }
    }
  }

  // Try v2 if v1 didn't give location
  if (!downloadUrl) {
    const v2Res = await fetch(`https://assetdelivery.roblox.com/v2/assetId/${assetId}`, { headers });

    if (v2Res.ok) {
      const v2Data = await v2Res.json();
      if (v2Data.locations && v2Data.locations.length > 0) {
        downloadUrl = v2Data.locations[0].location;
      }
    }
  }

  // Try direct asset URL as last resort
  if (!downloadUrl) {
    downloadUrl = `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`;
  }

  // Download from the resolved URL
  const dlRes = await fetchWithRetry(downloadUrl, {
    headers: { 
      'User-Agent': 'Roblox/WinInet',
      ...(cleanCookie ? { 'Cookie': `.ROBLOSECURITY=${cleanCookie}` } : {})
    },
    redirect: 'follow',
  });

  if (!dlRes.ok) {
    throw new Error(`Failed to download asset ${assetId}: HTTP ${dlRes.status}`);
  }

  const buffer = Buffer.from(await dlRes.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error(`Empty response for asset ${assetId}`);
  }

  return {
    buffer,
    size: buffer.length,
    contentType: dlRes.headers.get('content-type') || 'application/octet-stream',
  };
}

// Upload asset to Roblox Open Cloud
export async function uploadAsset(apiKey, creatorId, assetType, name, description, buffer) {
  const uploadType = assetType === 'Animation' ? 'Model' : (assetType || 'Model');

  const cleanName = name
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .substring(0, 50)
    || `Spoofed_${Date.now()}`;

  const metadata = JSON.stringify({
    assetType: uploadType,
    displayName: cleanName,
    description: (description || `Uploaded: ${cleanName}`).substring(0, 1000),
    creationContext: {
      creator: { userId: String(creatorId) },
    },
  });

  const fileContentType = uploadType === 'Model' ? 'model/x-rbxm' : 'application/octet-stream';

  const boundary = '----BMKSpoofer' + Date.now() + Math.random().toString(36).substr(2);

  // Build multipart body
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
    throw new Error(errorMsg);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid response from upload: ${responseText.substring(0, 200)}`);
  }

  const assetId = data.assetId || data.response?.assetId || data.id || null;
  const operationId = data.operationId || data.path || null;

  return { assetId, operationId, raw: data };
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
    const luaMatch = line.match(/\{\s*"([^"]+)"\s*,\s*(\d+)\s*\}/);
    if (luaMatch) {
      assets.push({ name: luaMatch[1], id: luaMatch[2] });
      continue;
    }

    const idMatch = line.trim().match(/^(\d{5,})$/);
    if (idMatch) {
      assets.push({ name: `Asset_${idMatch[1]}`, id: idMatch[1] });
      continue;
    }

    const csvMatch = line.match(/^["']?([^,"']+)["']?\s*,\s*(\d+)/);
    if (csvMatch) {
      assets.push({ name: csvMatch[1].trim(), id: csvMatch[2] });
      continue;
    }

    const urlMatch = line.match(/(\d{8,})/);
    if (urlMatch) {
      assets.push({ name: `Asset_${urlMatch[1]}`, id: urlMatch[1] });
    }
  }

  return assets;
}
