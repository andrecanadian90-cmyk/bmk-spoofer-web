const { MongoClient } = require('mongodb');

const uri = "mongodb://andrecanadian90_db_user:IcBD6TDL8Qeg5kFZ@ac-xyytwx3-shard-00-00.jef1kum.mongodb.net:27017,ac-xyytwx3-shard-00-01.jef1kum.mongodb.net:27017,ac-xyytwx3-shard-00-02.jef1kum.mongodb.net:27017/bmkspoofer?ssl=true&replicaSet=atlas-ud7n89-shard-0&authSource=admin&retryWrites=true&w=majority";

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

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("bmkspoofer");
    const usersCol = db.collection("users");
    const user = await usersCol.findOne({ username: "ndrewgg" });
    if (!user || !user.robloxCookie) {
      console.log("ndrewgg robloxCookie not found");
      return;
    }
    
    const cleanCookie = user.robloxCookie.trim().replace(/^\.ROBLOSECURITY=/, '').replace(/^["']|["']$/g, '').trim();
    const assetId = "94380720431420";
    
    const csrfToken = await getCsrfToken(cleanCookie);
    console.log(`CSRF Token: ${csrfToken}`);
    
    // We will test several combinations of User-Agent and Place ID
    const tests = [
      {
        name: "Strategy 6: Game Client Agent",
        url: `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
        headers: {
          'Accept': '*/*',
          'User-Agent': 'RobloxApp/0.616.0.6160645 (GlobalDist; RobloxDirectDownload)',
          'Roblox-Place-Id': '85372382874977',
          'Roblox-Universe-Id': '8120908141',
          'Roblox-Browser-Asset-Request': 'false',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        }
      },
      {
        name: "Strategy 6 with Adopt Me Place ID",
        url: `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
        headers: {
          'Accept': '*/*',
          'User-Agent': 'RobloxApp/0.616.0.6160645 (GlobalDist; RobloxDirectDownload)',
          'Roblox-Place-Id': '185655149',
          'Roblox-Universe-Id': '0',
          'Roblox-Browser-Asset-Request': 'false',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        }
      },
      {
        name: "Direct assetgame.roblox.com request",
        url: `https://assetgame.roblox.com/asset/?id=${assetId}`,
        headers: {
          'User-Agent': 'Roblox/WinInet',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
        }
      },
      {
        name: "Direct www.roblox.com/asset request",
        url: `https://www.roblox.com/asset/?id=${assetId}`,
        headers: {
          'User-Agent': 'Roblox/WinInet',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
        }
      }
    ];
    
    for (const t of tests) {
      console.log(`\nRunning test: ${t.name}`);
      try {
        const res = await fetch(t.url, { headers: t.headers });
        console.log(`  Status: ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        console.log(`  Content-Type: ${contentType}`);
        
        if (contentType.includes('json')) {
          const json = await res.json();
          console.log(`  JSON response:`, json);
        } else {
          const ab = await res.arrayBuffer();
          console.log(`  Binary length: ${ab.byteLength}`);
        }
      } catch(e) {
        console.log(`  Error: ${e.message}`);
      }
    }
    
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await client.close();
  }
}

test();
