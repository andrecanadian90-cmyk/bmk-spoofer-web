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
    const cleanCookie = user.robloxCookie.trim().replace(/^\.ROBLOSECURITY=/, '').replace(/^["']|["']$/g, '').trim();
    const assetId = "94380720431420";
    const csrfToken = await getCsrfToken(cleanCookie);
    
    // We will test direct /v1/asset/?id= with game client headers
    const tests = [
      {
        name: "Game Client on v1/asset with id",
        url: `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
        headers: {
          'Accept': '*/*',
          'User-Agent': 'RobloxApp/0.616.0.6160645 (GlobalDist; RobloxDirectDownload)',
          'Roblox-Place-Id': '85372382874977',
          'Roblox-Universe-Id': '0',
          'Roblox-Browser-Asset-Request': 'false',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
        }
      },
      {
        name: "Studio User Agent on v1/asset with id",
        url: `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
        headers: {
          'Accept': '*/*',
          'User-Agent': 'RobloxStudio/WinInet',
          'Roblox-Place-Id': '85372382874977',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        }
      },
      {
        name: "Studio User Agent on v1/assetId",
        url: `https://assetdelivery.roblox.com/v1/assetId/${assetId}`,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'RobloxStudio/WinInet',
          'Roblox-Place-Id': '85372382874977',
          'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
        }
      }
    ];

    for (const t of tests) {
      console.log(`\nTesting: ${t.name}`);
      const res = await fetch(t.url, { headers: t.headers });
      console.log(`  Status: ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      console.log(`  Content-Type: ${contentType}`);
      
      const text = await res.text();
      console.log(`  Response body (first 300 chars): ${text.substring(0, 300)}`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

test();
