async function test() {
  const assetId = "94380720431420";
  const placeId = "85372382874977"; // creator's place ID
  
  const tests = [
    {
      name: "No Cookie - Studio User Agent on v1/asset/?id=",
      url: `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
      headers: {
        'User-Agent': 'RobloxStudio/WinInet',
        'Accept': '*/*',
        'Roblox-Place-Id': placeId
      }
    },
    {
      name: "No Cookie - Game Client on v1/asset/?id=",
      url: `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
      headers: {
        'User-Agent': 'RobloxApp/0.616.0.6160645 (GlobalDist; RobloxDirectDownload)',
        'Accept': '*/*',
        'Roblox-Place-Id': placeId,
        'Roblox-Browser-Asset-Request': 'false'
      }
    },
    {
      name: "No Cookie - Direct request to assetgame.roblox.com",
      url: `https://assetgame.roblox.com/asset/?id=${assetId}`,
      headers: {
        'User-Agent': 'Roblox/WinInet'
      }
    },
    {
      name: "No Cookie - assetdelivery v1/assetId",
      url: `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RobloxStudio/WinInet',
        'Roblox-Place-Id': placeId
      }
    }
  ];

  for (const t of tests) {
    console.log(`\nTesting: ${t.name}`);
    try {
      const res = await fetch(t.url, { headers: t.headers });
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
