const fs = require('fs');
const path = require('path');

const soundsDir = path.join(process.env.LOCALAPPDATA, 'Temp', 'Roblox', 'sounds');

if (fs.existsSync(soundsDir)) {
  const files = fs.readdirSync(soundsDir);
  console.log(`Sounds directory exists. Total files: ${files.length}`);
  
  // Show details of files
  const fileDetails = files.map(file => {
    const filePath = path.join(soundsDir, file);
    const stat = fs.statSync(filePath);
    return { name: file, size: stat.size, mtime: stat.mtime };
  });
  
  // Sort by modification time (newest first)
  fileDetails.sort((a, b) => b.mtime - a.mtime);
  
  console.log("Newest 20 files in Roblox sounds cache:");
  fileDetails.slice(0, 20).forEach(f => {
    console.log(`- File: ${f.name} | Size: ${(f.size / 1024).toFixed(1)} KB | Modified: ${f.mtime}`);
  });
} else {
  console.log("Sounds directory does not exist.");
}
