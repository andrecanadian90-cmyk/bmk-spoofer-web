async function test() {
  const assetId = "94380720431420";
  const placeId = "85372382874977";
  
  const urls = [
    `https://assetdelivery.roblox.com/v2/assetId/${assetId}`,
    `https://assetdelivery.roblox.com/v2/asset/?id=${assetId}`,
    `https://assetdelivery.roblox.com/v2/asset/?id=${assetId}&placeId=${placeId}`,
    `https://assetdelivery.roblox.com/v2/assetId/${assetId}/placeId/${placeId}`
  ];

  for (const url of urls) {
    console.log(`\nTesting URL: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'RobloxStudio/WinInet',
          'Accept': 'application/json',
          'Roblox-Place-Id': placeId
        }
      });
      console.log(`  Status: ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      console.log(`  Content-Type: ${contentType}`);
      const text = await res.text();
      console.log(`  Response body (first 300 chars): ${text.substring(0, 300)}`);
    } catch(e) {
      console.log(`  Error: ${e.message}`);
    }
  }
}

test();
