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

// Resolve the creator's Place IDs from an asset ID
// This is the key bypass: using the creator's own Place ID as context
// makes Roblox think the request comes from the creator's game
async function resolveCreatorPlaceIds(assetId, cookie) {
  const headers = { Accept: 'application/json' };
  if (cookie) headers['Cookie'] = `.ROBLOSECURITY=${cookie}`;

  const placeIds = [];

  try {
    let creatorId = null;
    let creatorType = null;

    // Step 1: Get creator ID from develop API
    const devRes = await fetch(
      `https://develop.roblox.com/v1/assets?assetIds=${assetId}`,
      { headers, signal: AbortSignal.timeout(10000) }
    );
    if (devRes.ok) {
      const devData = await devRes.json();
      creatorId = devData.data?.[0]?.creator?.targetId;
      creatorType = devData.data?.[0]?.creator?.type; // 'User' or 'Group'
    }

    // Step 2: Fallback to economy details API if develop API didn't return creatorId
    if (!creatorId) {
      const detailsRes = await fetch(
        `https://economy.roblox.com/v2/assets/${assetId}/details`,
        { headers, signal: AbortSignal.timeout(10000) }
      );
      if (detailsRes.ok) {
        const details = await detailsRes.json();
        if (details.Creator) {
          creatorId = details.Creator.CreatorTargetId || details.Creator.Id;
          creatorType = details.Creator.CreatorType;
        }
      }
    }

    if (!creatorId) return [];

    // Step 3: Get creator's games to find Place IDs
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
    if (!gamesRes.ok) return [];
    const gamesData = await gamesRes.json();

    // Collect all root place IDs
    for (const game of (gamesData.data || [])) {
      const placeId = game.rootPlace?.id;
      if (placeId) placeIds.push(String(placeId));
    }
  } catch {
    // Ignore and proceed
  }

  return placeIds;
}

// Download asset binary from Roblox — Creator Context + Authenticated Audio Bypass
export async function downloadAsset(assetId, cookie = null) {
  const cleanCookie = getCleanCookie(cookie);
  const logPrefix = `[DOWNLOAD ${assetId}]`;
  const debugLogs = [];

  let info = null;
  try {
    info = await getAssetInfo(assetId, cleanCookie);
    debugLogs.push(`${logPrefix} Asset Info: type=${info.assetType}, name=${info.name}, creator=${info.creator}`);
  } catch (err) {
    throw new Error(`Aset dengan ID ${assetId} tidak ditemukan di Roblox. Periksa kembali ID Anda.`);
  }

  let csrfToken = null;
  if (cleanCookie) {
    csrfToken = await getCsrfToken(cleanCookie);
    debugLogs.push(`${logPrefix} CSRF Token obtained`);
  }

  const creatorPlaceIds = await resolveCreatorPlaceIds(assetId, cleanCookie);
  const placeIds = [...new Set([...creatorPlaceIds, '185655149', '4333217023', '3956818381', '1818'])];
  debugLogs.push(`${logPrefix} Place IDs: ${placeIds.join(',')}`);

  const baseHeaders = {
    'User-Agent': 'RobloxPlayer/1.0',
    'Requester': 'Client',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
  };
  
  const authHeaders = {
    ...baseHeaders,
    ...(cleanCookie ? { 'Cookie': `.ROBLOSECURITY=${cleanCookie}` } : {}),
    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
  };

  debugLogs.push(`${logPrefix} Auth available: ${!!cleanCookie}`);

  // PRIORITY 1: Try unauthenticated Place context bypass (creator's Place ID)
  // Roblox implicit-trusts requests with creator's Place ID header
  if (info.assetType === 'Audio' && creatorPlaceIds.length > 0) {
    debugLogs.push(`${logPrefix} Trying UNAUTHENTICATED Place context (creator's game context)...`);
    
    const userAgents = [
      'RobloxPlayer/1.0',
      'Roblox/WinInet',
      'RobloxStudio/WinInet',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    ];
    
    const referers = [
      'https://www.roblox.com/',
      'https://www.roblox.com/games/',
      'https://www.roblox.com/catalog/',
      `https://www.roblox.com/asset?id=${assetId}`,
    ];

    let unauthAttempts = 0;
    for (const creatorPlaceId of creatorPlaceIds) {
      for (const ua of userAgents) {
        for (const referer of referers) {
          const placeContextHeaders = {
            'User-Agent': ua,
            'Referer': referer,
            'Roblox-Place-Id': creatorPlaceId,
            'Accept': 'audio/*,*/*;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
          };

          const endpoints = [
            `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&serverplaceid=${creatorPlaceId}`,
            `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&placeId=${creatorPlaceId}`,
            `https://assetdelivery.roblox.com/v1/asset?id=${assetId}`,
          ];

          for (const url of endpoints) {
            unauthAttempts++;
            try {
              debugLogs.push(`${logPrefix} → [UNAUTH] ${url} (Place: ${creatorPlaceId})`);
              const res = await fetch(url, { 
                headers: placeContextHeaders, 
                redirect: 'follow',
                signal: AbortSignal.timeout(10000)
              });
              
              debugLogs.push(`${logPrefix}   Status: ${res.status}, CT: ${res.headers.get('content-type')}`);
              
              if (res.ok) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json') || contentType.includes('text/')) continue;
                
                const buffer = Buffer.from(await res.arrayBuffer());
                
                if (buffer.length > 50) {
                  const header = buffer.toString('utf8', 0, 4);
                  if (header.includes('OggS') || header.includes('ID3') || header.includes('RIFF') || buffer[0] === 0xFF) {
                    debugLogs.push(`${logPrefix} ✅ SUCCESS via UNAUTHENTICATED Place context!`);
                    return { buffer, size: buffer.length, contentType: contentType || 'audio/ogg', debugLogs };
                  }
                }
              }
            } catch (err) {
              debugLogs.push(`${logPrefix}   ✗ Error: ${err.message}`);
            }
          }
        }
      }
    }
    debugLogs.push(`${logPrefix} All ${unauthAttempts} unauthenticated Place context attempts exhausted`);
  }

  // PRIORITY 2: If authenticated, try authenticated audio endpoints
  if (cleanCookie && info.assetType === 'Audio') {
    debugLogs.push(`${logPrefix} Trying AUTHENTICATED audio endpoints...`);
    const authAudioEndpoints = [
      `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
      `https://assetdelivery.roblox.com/v1/asset?id=${assetId}&format=binary`,
      `https://assetdelivery.roblox.com/v2/asset?id=${assetId}`,
      `https://data.roblox.com/asset/?id=${assetId}`,
    ];

    for (const url of authAudioEndpoints) {
      try {
        debugLogs.push(`${logPrefix} → Trying: ${url}`);
        const res = await fetch(url, {
          headers: {
            ...authHeaders,
            'Accept': 'audio/*,application/octet-stream'
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(10000)
        });

        debugLogs.push(`${logPrefix}   Status: ${res.status}, CT: ${res.headers.get('content-type')}`);

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          
          if (contentType.includes('json') || contentType.includes('text/')) {
            debugLogs.push(`${logPrefix}   ✗ Skipped (JSON/text)`);
            continue;
          }
          
          const buffer = Buffer.from(await res.arrayBuffer());
          debugLogs.push(`${logPrefix}   Buffer: ${buffer.length} bytes`);
          
          if (buffer.length > 50) {
            const firstBytes = buffer.toString('utf8', 0, 20);
            if (!firstBytes.includes('{') && !firstBytes.includes('<!') && !firstBytes.includes('error')) {
              debugLogs.push(`${logPrefix} ✅ SUCCESS!`);
              return { buffer, size: buffer.length, contentType: contentType || 'audio/ogg', debugLogs };
            }
          }
        }
      } catch (err) {
        debugLogs.push(`${logPrefix}   ✗ Error: ${err.message}`);
      }
    }
     debugLogs.push(`${logPrefix} All auth endpoints failed`);
   }

   // EXPERIMENTAL: Try game client simulation + CDN direct access
   if (info.assetType === 'Audio') {
     debugLogs.push(`${logPrefix} Trying ADVANCED experimental methods...`);
     
     // Method 1: Game Client User-Agent + Minimal headers
     const gameClientUAs = [
       'Roblox/WinInet',
       'RobloxApp',
       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) RobloxApp Chrome/150.0.0.0 Safari/537.36',
       'Roblox/1.0 (Windows; U; Windows NT 10.0; en-US)',
     ];

     // Method 2: Alternative CDN endpoints
     const cdnEndpoints = [
       `https://t0.rbxcdn.com/asset/?id=${assetId}`,
       `https://t1.rbxcdn.com/asset/?id=${assetId}`,
       `https://t2.rbxcdn.com/asset/?id=${assetId}`,
       `https://t3.rbxcdn.com/asset/?id=${assetId}`,
       `https://images.rbxcdn.com/asset/?id=${assetId}`,
       `https://assetcdn.roblox.com/v1/asset/?id=${assetId}`,
     ];

     // Method 3: Try minimal headers (game client style)
     for (const ua of gameClientUAs) {
       for (const endpoint of cdnEndpoints) {
         try {
           debugLogs.push(`${logPrefix} → [EXP] ${endpoint} (UA: game client)`);
           const minimalHeaders = {
             'User-Agent': ua,
             'Accept': '*/*',
             'Accept-Encoding': 'gzip, deflate',
             'Connection': 'keep-alive',
             'Sec-Fetch-Site': 'none',
             'Sec-Fetch-Mode': 'navigate',
           };

           const res = await fetch(endpoint, {
             headers: minimalHeaders,
             redirect: 'follow',
             signal: AbortSignal.timeout(8000)
           });

           debugLogs.push(`${logPrefix}   Status: ${res.status}, CT: ${res.headers.get('content-type')}`);

           if (res.ok || res.status === 206) {
             const contentType = res.headers.get('content-type') || '';
             if (contentType.includes('json') || contentType.includes('text/')) continue;

             const buffer = Buffer.from(await res.arrayBuffer());
             if (buffer.length > 50) {
               const header = buffer.toString('utf8', 0, 4);
               if (header.includes('OggS') || header.includes('ID3') || header.includes('RIFF') || buffer[0] === 0xFF) {
                 debugLogs.push(`${logPrefix} ✅ SUCCESS via CDN endpoint!`);
                 return { buffer, size: buffer.length, contentType: contentType || 'audio/ogg', debugLogs };
               }
             }
           }
         } catch (err) {
           debugLogs.push(`${logPrefix}   ✗ ${err.message}`);
         }
       }
     }

     // Method 4: Specific headers from Discord bot pattern
     debugLogs.push(`${logPrefix} Trying Discord bot pattern headers...`);
     const botPatternHeaders = {
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
       'Accept': 'audio/webm,audio/ogg,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
       'Accept-Encoding': 'gzip, deflate, br',
       'Accept-Language': 'en-US,en;q=0.9',
       'Cache-Control': 'no-cache',
       'Pragma': 'no-cache',
       'Sec-Ch-Ua': '"Not A Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
       'Sec-Ch-Ua-Mobile': '?0',
       'Sec-Ch-Ua-Platform': '"Windows"',
       'Sec-Fetch-Dest': 'audio',
       'Sec-Fetch-Mode': 'cors',
       'Sec-Fetch-Site': 'cross-site',
       'Referer': 'https://discord.com/',
     };

     const botEndpoints = [
       `https://assetdelivery.roblox.com/v1/asset?id=${assetId}`,
       `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
       `https://assetdelivery.roblox.com/v2/asset?id=${assetId}`,
     ];

     for (const endpoint of botEndpoints) {
       try {
         debugLogs.push(`${logPrefix} → [BOT] ${endpoint}`);
         const res = await fetch(endpoint, {
           headers: botPatternHeaders,
           redirect: 'follow',
           signal: AbortSignal.timeout(8000)
         });

         debugLogs.push(`${logPrefix}   Status: ${res.status}`);

         if (res.ok) {
           const contentType = res.headers.get('content-type') || '';
           if (contentType.includes('json') || contentType.includes('text/')) continue;

           const buffer = Buffer.from(await res.arrayBuffer());
           if (buffer.length > 50) {
             const header = buffer.toString('utf8', 0, 4);
             if (header.includes('OggS') || header.includes('ID3') || header.includes('RIFF') || buffer[0] === 0xFF) {
               debugLogs.push(`${logPrefix} ✅ SUCCESS via bot pattern!`);
               return { buffer, size: buffer.length, contentType: contentType || 'audio/ogg', debugLogs };
             }
           }
         }
       } catch (err) {
         debugLogs.push(`${logPrefix}   ✗ ${err.message}`);
       }
     }

     debugLogs.push(`${logPrefix} All experimental methods exhausted`);
   }

  // Multi-UA + Place context strategy
  const userAgents = [
    'RobloxPlayer/1.0',
    'Roblox/WinInet',
    'RobloxStudio/WinInet',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  ];

  const referers = [
    'https://www.roblox.com/',
    'https://www.roblox.com/games/',
    'https://www.roblox.com/catalog/',
    `https://www.roblox.com/asset?id=${assetId}`,
  ];

  if (info.assetType === 'Audio') {
    debugLogs.push(`${logPrefix} Trying ${userAgents.length}x${referers.length}x${placeIds.length} combinations...`);
    let attemptCount = 0;
    
    for (const ua of userAgents) {
      for (const referer of referers) {
        for (const placeId of placeIds) {
          const audioHeaders = {
            ...authHeaders,
            'User-Agent': ua,
            'Referer': referer,
            'Roblox-Place-Id': placeId,
            'Accept': 'audio/*,*/*;q=0.9'
          };

          const endpoints = [
            `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&serverplaceid=${placeId}`,
            `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&placeId=${placeId}`,
            `https://assetdelivery.roblox.com/v1/asset?id=${assetId}&serverplaceid=${placeId}`,
            `https://assetdelivery.roblox.com/v1/asset?id=${assetId}`,
          ];

          for (const url of endpoints) {
            attemptCount++;
            try {
              const res = await fetch(url, { 
                headers: audioHeaders, 
                redirect: 'follow',
                signal: AbortSignal.timeout(10000)
              });
              
              if (res.ok) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json') || contentType.includes('text/')) continue;
                
                const buffer = Buffer.from(await res.arrayBuffer());
                
                if (buffer.length > 50) {
                  const header = buffer.toString('utf8', 0, 4);
                  if (header.includes('OggS') || header.includes('ID3') || header.includes('RIFF') || buffer[0] === 0xFF) {
                    debugLogs.push(`${logPrefix} ✅ SUCCESS on attempt ${attemptCount}!`);
                    return { buffer, size: buffer.length, contentType: contentType || 'audio/ogg', debugLogs };
                  }
                }
              }
            } catch (err) {
              // continue
            }
          }
        }
      }
    }
    debugLogs.push(`${logPrefix} All ${attemptCount} attempts exhausted`);
  }

  // Standard download
  debugLogs.push(`${logPrefix} Trying standard download...`);
  for (const placeId of placeIds) {
    const headers = { ...authHeaders, 'Roblox-Place-Id': placeId };
    const endpoints = [
      `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}&serverplaceid=${placeId}`,
      `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
      `https://assetdelivery.roblox.com/v1/asset?id=${assetId}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetchWithRetry(url, { headers, redirect: 'follow' }, 2);
        
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('json') || contentType.includes('text/')) continue;
          
          const buffer = Buffer.from(await res.arrayBuffer());
          if (buffer.length > 0) {
            debugLogs.push(`${logPrefix} ✅ SUCCESS!`);
            return { buffer, size: buffer.length, contentType: contentType || 'application/octet-stream', debugLogs };
          }
        }
      } catch (err) {
        // continue
      }
    }
  }

  debugLogs.push(`${logPrefix} ❌ ALL FAILED`);
  const errorMsg = `Gagal mengunduh ${info.assetType} ${assetId}.\n\nDEBUG LOGS:\n${debugLogs.join('\n')}`;
  const err = new Error(errorMsg);
  err.debugLogs = debugLogs;
  throw err;
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
