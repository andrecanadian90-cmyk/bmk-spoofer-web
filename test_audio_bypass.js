// Test audio bypass dengan asset ID 94380720431420
(async () => {
  // Dynamic import untuk ES modules
  const { downloadAsset, getAssetInfo } = await import('./lib/roblox.js');
  
  const assetId = '94380720431420';
  console.log(`\n🎵 Testing Audio Bypass untuk Asset ID: ${assetId}\n`);
  
  try {
    console.log('Step 1: Mengambil info aset...');
    const info = await getAssetInfo(assetId);
    console.log('✓ Asset Info:', {
      id: info.id,
      name: info.name,
      type: info.assetType,
      creator: info.creator,
    });

    console.log('\nStep 2: Attempt download asset (tanpa cookie)...');
    const result = await downloadAsset(assetId, null);
    
    console.log('✓ Download SUCCESS!');
    console.log('  - File Size:', (result.size / 1024).toFixed(2), 'KB');
    console.log('  - Content Type:', result.contentType);
    console.log('  - Buffer Length:', result.buffer.length);
    
    console.log('\n✅ TEST PASSED - Audio bypass berhasil!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.log('\n❌ TEST FAILED');
    process.exit(1);
  }
})();
