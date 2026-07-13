'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AudioPage() {
  const { user } = useAuth();
  
  // Input states
  const [ytUrl, setYtUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [amplification, setAmplification] = useState(0);
  const [bypassMode, setBypassMode] = useState('optimal'); // 'optimal' or 'custom'
  
  // Roblox Upload states
  const [autoUpload, setAutoUpload] = useState(false);
  const [robloxApiKey, setRobloxApiKey] = useState('');
  const [robloxCreatorId, setRobloxCreatorId] = useState('');
  const [robloxCreatorType, setRobloxCreatorType] = useState('User');
  const [assetName, setAssetName] = useState('BypassAudio');
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [successResult, setSuccessResult] = useState(null);
  
  // Ref for auto scroll logs
  const logTerminalRef = useRef(null);

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('bernada_roblox_apikey');
    const savedCreatorId = localStorage.getItem('bernada_roblox_creatorid');
    const savedCreatorType = localStorage.getItem('bernada_roblox_creatortype');
    
    if (savedApiKey) setRobloxApiKey(savedApiKey);
    if (savedCreatorId) setRobloxCreatorId(savedCreatorId);
    if (savedCreatorType) setRobloxCreatorType(savedCreatorType);
  }, []);

  // Save credentials when updated
  const saveCredentials = (key, val, name) => {
    localStorage.setItem(name, val);
    if (name === 'bernada_roblox_apikey') setRobloxApiKey(val);
    if (name === 'bernada_roblox_creatorid') setRobloxCreatorId(val);
    if (name === 'bernada_roblox_creatortype') setRobloxCreatorType(val);
  };

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message, type }]);
    
    // Auto scroll terminal
    setTimeout(() => {
      if (logTerminalRef.current) {
        logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setYtUrl(''); // Clear youtube URL when file is uploaded
      addLog(`File terpilih: ${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`, 'info');
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!selectedFile && !ytUrl) {
      alert('Harap masukkan link YouTube atau pilih file audio lokal terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setSuccessResult(null);
    setLogs([]);
    addLog('Memulai pemrosesan audio...', 'info');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
        addLog('Mengunggah file audio lokal...', 'info');
      } else {
        formData.append('ytUrl', ytUrl);
        addLog(`Menghubungi server untuk download link YouTube: ${ytUrl}`, 'info');
      }

      formData.append('speed', speed);
      formData.append('amplification', amplification);
      formData.append('bypassMode', bypassMode);
      formData.append('autoUpload', autoUpload);

      if (autoUpload) {
        if (!robloxApiKey || !robloxCreatorId) {
          throw new Error('Harap lengkapi API Key dan Creator ID Roblox Anda.');
        }
        formData.append('robloxApiKey', robloxApiKey);
        formData.append('robloxCreatorId', robloxCreatorId);
        formData.append('robloxCreatorType', robloxCreatorType);
        formData.append('assetName', assetName);
        addLog('Menyiapkan konfigurasi auto-upload Roblox...', 'info');
      }

      addLog(`Menerapkan filter bypass (${bypassMode === 'optimal' ? 'Optimal Roblox Spoof' : `Custom Speed: ${speed}x, Amp: ${amplification}dB`})...`, 'info');
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/audio/process', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server return status ${response.status}`);
      }

      if (autoUpload) {
        const data = await response.json();
        addLog('Bypass audio berhasil dilakukan!', 'success');
        addLog(`Aset berhasil diunggah! Asset ID: ${data.assetId}`, 'success');
        setSuccessResult({ assetId: data.assetId, mode: 'upload' });
      } else {
        addLog('Bypass audio berhasil! Memulai pengunduhan berkas .ogg...', 'success');
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile ? `${selectedFile.name.split('.')[0]}_bypassed.ogg` : `${assetName}.ogg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        addLog('Unduhan berkas selesai!', 'success');
        setSuccessResult({ mode: 'download' });
      }
    } catch (err) {
      addLog(`Gagal: ${err.message}`, 'error');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '10px 0 40px' }}>
      
      {/* Page Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          🎧 BERNADA Audio Web (Bypass Spoofer)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Konversi audio kesukaanmu, terapkan filter spoofer otomatis untuk lolos hak cipta, dan unggah langsung ke Roblox.
        </p>
      </div>

      {/* Web Console grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }} className="dashboard-grid-mobile">
        
        {/* Left Column: Audio Source & Processing Options */}
        <div className="card" style={{
          padding: 26,
          borderRadius: 16,
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-card-solid)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
            🎛️ Pengaturan & Sumber Audio
          </h3>
          
          <form onSubmit={handleProcess} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Input YouTube URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Metode 1: Paste Link YouTube / SoundCloud
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={ytUrl}
                onChange={(e) => {
                  setYtUrl(e.target.value);
                  setSelectedFile(null); // Clear local file when URL is inputted
                }}
                disabled={isProcessing}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', margin: '2px 0' }}>— ATAU —</div>

            {/* Input Local File */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Metode 2: Unggah File Audio Lokal (.mp3, .wav, .ogg, .m4a)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={isProcessing}
                style={{ display: 'none' }}
                id="audio-file-input"
              />
              <label
                htmlFor="audio-file-input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px dashed var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: selectedFile ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                {selectedFile ? `🎵 ${selectedFile.name}` : '📁 Pilih File Audio dari PC'}
              </label>
            </div>

            {/* Config Mode Toggle */}
            <div style={{ marginTop: 6 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Mode Bypass Hak Cipta (Roblox Bypass)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setBypassMode('optimal')}
                  disabled={isProcessing}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: bypassMode === 'optimal' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    background: bypassMode === 'optimal' ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)',
                    color: bypassMode === 'optimal' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  🚀 Optimal Bypass (Otomatis)
                </button>
                <button
                  type="button"
                  onClick={() => setBypassMode('custom')}
                  disabled={isProcessing}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: bypassMode === 'custom' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    background: bypassMode === 'custom' ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)',
                    color: bypassMode === 'custom' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Kustom Kecepatan & Pitch
                </button>
              </div>
            </div>

            {/* Custom controls (only active if custom selected) */}
            {bypassMode === 'custom' && (
              <div style={{
                background: 'var(--bg-secondary)',
                padding: 14,
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <span>Kecepatan & Pitch</span>
                    <span style={{ color: 'var(--accent)' }}>{speed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    disabled={isProcessing}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>0.8x (Lambat/Bass)</span>
                    <span>1.0x (Normal)</span>
                    <span>1.5x (Cepat/Tinggi)</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <span>Penguatan Volume (Amplification)</span>
                    <span style={{ color: 'var(--accent)' }}>{amplification >= 0 ? `+${amplification}` : amplification} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={amplification}
                    onChange={(e) => setAmplification(parseInt(e.target.value))}
                    disabled={isProcessing}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>-10 dB (Pelan)</span>
                    <span>0 dB (Normal)</span>
                    <span>+10 dB (Keras)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Auto Upload toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>☁️ Auto-Upload Ke Roblox</span>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Unggah otomatis ke inventaris Roblox Anda secara instan</span>
              </div>
              <input
                type="checkbox"
                checked={autoUpload}
                onChange={(e) => setAutoUpload(e.target.checked)}
                disabled={isProcessing}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent)' }}
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 10,
                border: 'none',
                background: isProcessing ? 'var(--text-muted)' : 'var(--accent)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: isProcessing ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.2s ease',
                marginTop: 10
              }}
            >
              {isProcessing ? '🔄 Sedang Memproses...' : autoUpload ? '⚡ Bypass & Upload Otomatis' : '📥 Bypass & Download .OGG'}
            </button>
          </form>
        </div>

        {/* Right Column: Roblox Upload Credentials & Console Log Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Roblox Credentials Configuration Card */}
          {autoUpload && (
            <div className="card" style={{
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card-solid)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                🔑 Konfigurasi API Open Cloud Roblox
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Roblox Open Cloud API Key
                  </label>
                  <input
                    type="password"
                    placeholder="rbx_ak_..."
                    value={robloxApiKey}
                    onChange={(e) => saveCredentials('robloxApiKey', e.target.value, 'bernada_roblox_apikey')}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Creator ID (Roblox User/Group ID)
                    </label>
                    <input
                      type="text"
                      placeholder="12345678"
                      value={robloxCreatorId}
                      onChange={(e) => saveCredentials('robloxCreatorId', e.target.value, 'bernada_roblox_creatorid')}
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Tipe Kreator
                    </label>
                    <select
                      value={robloxCreatorType}
                      onChange={(e) => saveCredentials('robloxCreatorType', e.target.value, 'bernada_roblox_creatortype')}
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="User">User (Akun Sendiri)</option>
                      <option value="Group">Group (Grup Roblox)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Nama Aset Audio (Di Roblox)
                  </label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Console Log Terminal Box */}
          <div className="card" style={{
            padding: 24,
            borderRadius: 16,
            border: '1px solid var(--border-subtle)',
            background: '#0c0f17',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: autoUpload ? 180 : 340
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
              🖥️ Terminal Status Pemrosesan
            </h3>
            
            <div 
              ref={logTerminalRef}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#e2e8f0',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                flexGrow: 1,
                maxHeight: autoUpload ? 120 : 260
              }}
            >
              {logs.length === 0 ? (
                <div style={{ color: '#475569', fontStyle: 'italic' }}>Menunggu input berkas audio...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{
                    lineHeight: 1.4,
                    color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : '#e2e8f0'
                  }}>
                    <span style={{ color: '#64748b', marginRight: 8 }}>[{log.time}]</span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
            
            {/* Success result banner */}
            {successResult && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 8,
                padding: '10px 14px',
                marginTop: 10,
                fontSize: '0.76rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓ Pemrosesan Selesai!</span>
                {successResult.mode === 'upload' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Audio berhasil lolos bypass dan terunggah otomatis ke Roblox!</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>ID: {successResult.assetId}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(successResult.assetId);
                          alert('Asset ID berhasil disalin!');
                        }}
                        style={{
                          background: 'var(--accent)',
                          color: '#fff',
                          border: 'none',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.62rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        Salin ID
                      </button>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Berkas audio yang sudah dibypass telah berhasil diunduh ke komputer Anda.</span>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Hero Banner Card (Desktop App PC .EXE version download) */}
      <div className="card" style={{
        padding: '30px 24px',
        borderRadius: 16,
        border: '1px solid rgba(37, 99, 235, 0.15)',
        background: 'var(--bg-card-solid)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="dashboard-grid-mobile">
        <div style={{ maxWidth: '65%' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
            Butuh Pemrosesan Skala Besar? Gunakan Aplikasi PC BERNADA Audio (.EXE)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            Aplikasi desktop mendukung pemrosesan massal (bulk upload) ratusan audio sekaligus secara instan, pemantauan status moderasi realtime, serta memanfaatkan akselerasi hardware PC Anda untuk proses convert audio yang jauh lebih cepat.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a 
            href="https://drive.google.com/file/d/1TEJmxDRFM0-kY3i_k-09bFdY-IyYMWyR/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.25s ease'
            }}
          >
            📥 Unduh Aplikasi PC (.EXE)
          </a>
          <a 
            href="https://discord.gg/x26ky9drYr"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              background: 'rgba(114, 137, 218, 0.1)',
              color: '#7289da',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              border: '1px solid rgba(114, 137, 218, 0.25)',
              transition: 'all 0.25s ease'
            }}
            className="ticket-btn-hover"
          >
            💬 Beli Lisensi Premium (Discord)
          </a>
        </div>
      </div>

      <style jsx>{`
        .input-field:focus {
          border-color: var(--accent) !important;
          outline: none;
        }
        @media (max-width: 768px) {
          :global(.dashboard-grid-mobile) {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
          }
          :global(.dashboard-grid-mobile > div) {
            max-width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
}
