const fs = require('fs');
const path = require('path');

const robloxTemp = path.join(process.env.LOCALAPPDATA, 'Temp', 'Roblox');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  console.log(`\nScanning ${dir} (Total: ${files.length} items)...`);
  
  let printed = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile() && stat.size > 100000) { // files larger than 100KB
        console.log(`  File: ${file} | Size: ${(stat.size / 1024).toFixed(1)} KB | Modified: ${stat.mtime}`);
        printed++;
        if (printed >= 15) {
          console.log(`  ... and more`);
          break;
        }
      }
    } catch(e) {}
  }
}

// 1. Scan the main "sounds" folder
scanDir(path.join(robloxTemp, 'sounds'));

// 2. Scan all "ContentProvider_*" directories
try {
  const items = fs.readdirSync(robloxTemp);
  for (const item of items) {
    if (item.startsWith('ContentProvider_')) {
      const fullPath = path.join(robloxTemp, item);
      scanDir(fullPath);
    }
  }
} catch(e) {}
