const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const chunksDir = path.join(__dirname, '.next', 'static');

if (!fs.existsSync(chunksDir)) {
  console.error("Error: .next/static directory not found. Run 'npm run build' first!");
  process.exit(1);
}

// Walk directory recursively
function getJsFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getJsFiles(filePath, filesList);
    } else if (filePath.endsWith('.js')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

console.log("Locating built JavaScript chunks for obfuscation...");
const jsFiles = getJsFiles(chunksDir);
console.log(`Found ${jsFiles.length} JavaScript files.`);

const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false, // Critically false to avoid breaking Next.js loader
  selfDefending: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

let successCount = 0;

for (const filePath of jsFiles) {
  try {
    const originalCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip already obfuscated files if any
    if (originalCode.includes('var _0x')) {
      continue;
    }

    const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalCode, obfuscatorOptions);
    fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
    successCount++;
    console.log(`[OK] Obfuscated: ${path.relative(chunksDir, filePath)}`);
  } catch (err) {
    console.error(`[Error] Failed to obfuscate ${path.basename(filePath)}:`, err.message);
  }
}

console.log(`\n🎉 Obfuscation complete! Successfully protected ${successCount} JavaScript files.`);
process.exit(0);
