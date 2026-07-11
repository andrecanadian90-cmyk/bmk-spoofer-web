const { MongoClient } = require('mongodb');

const uri = "mongodb://andrecanadian90_db_user:IcBD6TDL8Qeg5kFZ@ac-xyytwx3-shard-00-00.jef1kum.mongodb.net:27017,ac-xyytwx3-shard-00-01.jef1kum.mongodb.net:27017,ac-xyytwx3-shard-00-02.jef1kum.mongodb.net:27017/bmkspoofer?ssl=true&replicaSet=atlas-ud7n89-shard-0&authSource=admin&retryWrites=true&w=majority";

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("bmkspoofer");
    const usersCol = db.collection("users");
    
    const usernames = ["ndrew", "ndrewgg"];
    for (const username of usernames) {
      console.log(`\nChecking user: ${username}`);
      const user = await usersCol.findOne({ username });
      if (!user) {
        console.log("  Not found");
        continue;
      }
      
      console.log(`  Roblox Username: ${user.robloxUsername}`);
      console.log(`  Roblox Cookie configured: ${!!user.robloxCookie}`);
      if (user.robloxCookie) {
        console.log(`  Cookie length: ${user.robloxCookie.length}`);
        const cleanCookie = user.robloxCookie.trim().replace(/^\.ROBLOSECURITY=/, '').replace(/^["']|["']$/g, '').trim();
        
        try {
          const res = await fetch("https://users.roblox.com/v1/users/authenticated", {
            headers: {
              "Cookie": `.ROBLOSECURITY=${cleanCookie}`
            }
          });
          console.log(`  Verification Status: ${res.status}`);
          if (res.ok) {
            const data = await res.json();
            console.log(`  Cookie is VALID! Roblox User: ${data.name} (ID: ${data.id})`);
          } else {
            const text = await res.text();
            console.log(`  Cookie is INVALID! Response: ${text}`);
          }
        } catch(e) {
          console.log(`  Verification request failed: ${e.message}`);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

check();
