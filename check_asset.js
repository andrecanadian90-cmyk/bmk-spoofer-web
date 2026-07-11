async function check() {
  const assetId = '75331082331587';
  const urls = [
    `https://economy.roblox.com/v2/assets/${assetId}/details`,
    `https://api.roblox.com/marketplace/productinfo?assetId=${assetId}`
  ];
  
  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 500)}`);
    } catch(e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

check();
