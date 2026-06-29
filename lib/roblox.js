export async function getRobloxUser(userId) {
  const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
  if (!res.ok) throw new Error('Roblox user not found');
  return res.json();
}

export async function downloadAsset(assetId) {
  const res = await fetch(`https://assetdelivery.roblox.com/v1/assetId/${assetId}`, {
    headers: { Accept: 'application/octet-stream' },
    redirect: 'follow',
  });

  if (!res.ok) {
    const locations = await fetch(`https://assetdelivery.roblox.com/v1/assetId/${assetId}`);
    const data = await locations.json();
    if (data.location) {
      const assetRes = await fetch(data.location);
      if (!assetRes.ok) throw new Error(`Failed to download asset ${assetId}`);
      const buffer = Buffer.from(await assetRes.arrayBuffer());
      return { buffer, contentType: assetRes.headers.get('content-type'), size: buffer.length };
    }
    throw new Error(`Failed to download asset ${assetId}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType: res.headers.get('content-type'), size: buffer.length };
}

export async function uploadAsset(apiKey, creatorId, assetType, name, buffer) {
  const metadata = JSON.stringify({
    assetType,
    displayName: name,
    description: `Spoofed: ${name}`,
    creationContext: {
      creator: { userId: creatorId },
    },
  });

  const boundary = '----BMKSpoofer' + Date.now();
  const body = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="request"\r\n`,
    `Content-Type: application/json\r\n\r\n`,
    metadata + '\r\n',
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="fileContent"; filename="${name}.rbxm"\r\n`,
    `Content-Type: application/octet-stream\r\n\r\n`,
  ].join('');

  const bodyEnd = `\r\n--${boundary}--\r\n`;
  const bodyBuffer = Buffer.concat([
    Buffer.from(body),
    buffer,
    Buffer.from(bodyEnd),
  ]);

  const res = await fetch('https://apis.roblox.com/assets/v1/assets', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: bodyBuffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  const data = await res.json();
  return { assetId: data.assetId || data.id, operationId: data.operationId || data.path };
}

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
    const csvMatch = line.match(/^([^,]+),\s*(\d+)/);
    if (csvMatch) {
      assets.push({ name: csvMatch[1].trim().replace(/"/g, ''), id: csvMatch[2] });
    }
  }

  return assets;
}
