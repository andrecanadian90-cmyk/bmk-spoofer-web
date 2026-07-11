const fs = require('fs');
const path = require('path');

const localAppData = process.env.LOCALAPPDATA;
const tempDir = path.join(localAppData, 'Temp');

function findRobloxDirs(baseDir) {
  try {
    const items = fs.readdirSync(baseDir);
    for (const item of items) {
      const fullPath = path.join(baseDir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (item.toLowerCase().includes('roblox')) {
            console.log(`Found Roblox directory: ${fullPath}`);
            // Check children
            try {
              const children = fs.readdirSync(fullPath);
              console.log(`  Children: ${children.slice(0, 10).join(', ')} (Total: ${children.length})`);
              for (const child of children) {
                const childPath = path.join(fullPath, child);
                const childStat = fs.statSync(childPath);
                if (childStat.isDirectory()) {
                  console.log(`    Sub-dir: ${child} (files: ${fs.readdirSync(childPath).length})`);
                }
              }
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
  } catch(e) {
    console.log(`Error reading ${baseDir}:`, e.message);
  }
}

console.log(`Searching for Roblox folders in AppData/Local/Temp...`);
findRobloxDirs(tempDir);

console.log(`\nSearching for Roblox folders in AppData/Local...`);
findRobloxDirs(localAppData);
