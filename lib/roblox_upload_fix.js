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

  const fileContentType = uploadType === 'Model' ? 'model/x-rbxm' : 'application/octet-stream';
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
