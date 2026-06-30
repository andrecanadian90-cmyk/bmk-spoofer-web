'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const translations = {
  en: {
    engineTitle: 'Single & Bulk Spoof Engine',
    engineSub: 'Input your asset list below to launch the spoofer engine.',
    totalAssets: 'Total Assets',
    totalCost: 'Total Cost',
    yourCoins: 'Your Coins',
    insufficientCoins: 'Insufficient coins. Please Top Up Coins first.',
    processingMethod: 'SELECT PROCESSING METHOD',
    autoUploadLabel: 'Auto-Upload to Roblox Open Cloud',
    autoUploadDesc: 'Assets will be automatically uploaded directly to your Roblox inventory. (Roblox Link Required)',
    bypassOnlyLabel: 'Bypass Only (No Auto-Upload)',
    bypassOnlyDesc: 'Assets are bypassed locally and you can download files directly. (No Roblox Link Required)',
    notConnected: 'Roblox Not Connected: Please connect your Roblox ID, API Key, and Cookie in the Account Settings first to use this method.',
    startBypass: 'Start Bypass',
    spoofing: 'Spoofing...',
    execLogs: 'Execution Logs',
    noLogs: 'No logs yet. Start a spoof to see results.',
    spoofStatus: 'Spoofing Status',
    timeElapsed: 'Time Elapsed',
    progress: 'Progress',
    claimTitle: 'Claim Free Coins',
    claimDesc: 'Claim your daily free coins to process premium bypass options.',
    claimBtn: 'Claim 10 Free Coins',
    claiming: 'Claiming...',
    enterIds: 'Enter asset IDs first',
    selectMode: 'Please select a spoofing mode (Auto-Upload or Bypass Only) first.',
    linkRoblox: 'Link your Roblox account first to enable Auto-Upload mode.',
    insufficientToast: (need, cur) => `Insufficient coins. You need ${need} coins (Your balance: ${cur} coins).`,
    successToast: (s, tot) => `Spoofed ${s}/${tot} assets`,
    // tab details
    animDetail1: 'Animation Mode (FREE) — Spoof and bypass animations without any coin charges',
    animDetail2: 'Unlimited Access — Run as many operations as you need without limits',
    animDetail3: 'Auto Upload — Direct upload straight to your Roblox inventory',
    ugcDetail1: 'UGC Mode (50 Coins / Asset) — Bypass verification for shirts, pants, accessories, and UGC products',
    ugcDetail2: 'Auto Verification Bypass — Instantly upload catalog assets securely',
    ugcDetail3: 'Cost Calculation — 50 coins will be charged for each asset processed',
    audioDetail1: 'Private Audio Mode (FREE) — Convert and bypass copyright detection for sounds without any coin charges',
    audioDetail2: 'Safe Delivery — Direct upload to Roblox cloud inventory',
    audioDetail3: 'Unlimited Access — Run as many operations as you need without limits',
    videoDetail1: 'Video Mode (FREE) — Convert and upload video assets safely without any coin charges',
    videoDetail2: 'Full Compatibility — Ready to play on surface UIs and in-game displays',
    videoDetail3: 'Unlimited Access — Run as many operations as you need without limits',
    meshDetail1: 'Mesh Mode (3 Coins / Asset) — Bypass mesh model and decal upload filters',
    meshDetail2: '3D Automation — Automated 3D geometry packaging and verification',
    meshDetail3: 'Cost Calculation — 3 coins will be charged for each asset processed',
    robloxWorkspace: 'ROBLOX BYPASS PROFILE',
    connectionRequired: 'Roblox Connection Required',
    notLinked: 'Account Not Linked',
    usersOnline: (c) => `${c} Users Online`,
    sessionActive: 'SESSION: ACTIVE',
    sessionDisconnected: 'SESSION: DISCONNECTED',
  },
  id: {
    engineTitle: 'Single & Bulk Spoof Engine',
    engineSub: 'Masukkan daftar ID aset Anda di bawah untuk memulai pemrosesan bypass.',
    totalAssets: 'Jumlah Aset',
    totalCost: 'Total Biaya',
    yourCoins: 'Koin Anda',
    insufficientCoins: 'Koin tidak cukup. Silakan Top Up Koin terlebih dahulu.',
    processingMethod: 'PILIH METODE PROSES',
    autoUploadLabel: 'Auto-Upload ke Roblox Open Cloud',
    autoUploadDesc: 'Aset otomatis diunggah langsung ke inventaris Roblox Anda. (Membutuhkan Link Akun)',
    bypassOnlyLabel: 'Bypass Saja (Tanpa Auto-Upload)',
    bypassOnlyDesc: 'Aset hanya diproses/bypass dan Anda dapat mengunduh berkasnya langsung. (Tanpa Link Akun)',
    notConnected: 'Roblox Belum Terhubung: Silakan hubungkan Roblox ID, API Key, dan Cookie di halaman Pengaturan Akun terlebih dahulu untuk menggunakan metode ini.',
    startBypass: 'Mulai Bypass',
    spoofing: 'Memproses...',
    execLogs: 'Log Eksekusi',
    noLogs: 'Belum ada log. Mulai proses spoof untuk melihat hasil.',
    spoofStatus: 'Status Spoofing',
    timeElapsed: 'Waktu Berjalan',
    progress: 'Progres',
    claimTitle: 'Klaim Koin Gratis',
    claimDesc: 'Klaim koin harian gratis Anda untuk memproses bypass opsi berbayar.',
    claimBtn: 'Klaim 10 Koin Gratis',
    claiming: 'Mengklaim...',
    enterIds: 'Masukkan ID aset terlebih dahulu',
    selectMode: 'Pilih mode spoofing (Auto-Upload atau Bypass Only) terlebih dahulu.',
    linkRoblox: 'Hubungkan akun Roblox Anda terlebih dahulu untuk menggunakan mode Auto-Upload.',
    insufficientToast: (need, cur) => `Koin tidak cukup. Anda membutuhkan ${need} koin (Saldo Anda: ${cur} koin).`,
    successToast: (s, tot) => `Berhasil memproses ${s}/${tot} aset`,
    // tab details
    animDetail1: 'Mode Animasi (GRATIS) — Spoof dan bypass animasi tanpa pemotongan koin',
    animDetail2: 'Akses Tanpa Batas — Jalankan operasi sebanyak yang Anda butuhkan tanpa batas',
    animDetail3: 'Unggah Otomatis — Pengunggahan langsung ke inventaris Roblox Anda',
    ugcDetail1: 'Mode UGC (50 Koin / Aset) — Bypass verifikasi untuk kaos, celana, aksesoris, dan produk UGC',
    ugcDetail2: 'Bypass Verifikasi Otomatis — Unggah katalog aset dengan aman secara instan',
    ugcDetail3: 'Perhitungan Biaya — 50 koin akan dikenakan untuk setiap aset yang diproses',
    audioDetail1: 'Mode Audio Privat (GRATIS) — Konversi dan bypass deteksi hak cipta suara tanpa biaya koin',
    audioDetail2: 'Pengiriman Aman — Unggah langsung ke inventaris cloud Roblox',
    audioDetail3: 'Akses Tanpa Batas — Jalankan operasi sebanyak yang Anda butuhkan tanpa batas',
    videoDetail1: 'Video Mode (GRATIS) — Konversi dan unggah aset video dengan aman tanpa biaya koin',
    videoDetail2: 'Kompatibilitas Penuh — Siap diputar di UI permukaan dan tampilan dalam game',
    videoDetail3: 'Akses Tanpa Batas — Jalankan operasi sebanyak yang Anda butuhkan tanpa batas',
    meshDetail1: 'Mode Mesh (3 Koin / Aset) — Bypass filter pengunggahan model mesh dan decal',
    meshDetail2: 'Otomatisasi 3D — Pengemasan dan verifikasi geometri 3D otomatis',
    meshDetail3: 'Perhitungan Biaya — 3 koin akan dikenakan untuk setiap aset yang diproses',
    robloxWorkspace: 'ROBLOX BYPASS PROFILE',
    connectionRequired: 'Koneksi Roblox Dibutuhkan',
    notLinked: 'Akun Belum Terhubung',
    usersOnline: (c) => `${c} Pengguna Online`,
    sessionActive: 'SESI: AKTIF',
    sessionDisconnected: 'SESI: TERPUTUS',
  }
};

const parseClientInput = (input) => {
  const lines = input.trim().split('\n').filter(l => l.trim());
  return lines.map(line => {
    const cleanLine = line.trim();
    const luaMatch = cleanLine.match(/\{\s*"([^"]+)"\s*,\s*(\d+)\s*\}/);
    if (luaMatch) {
      return { name: luaMatch[1], id: luaMatch[2], originalLine: cleanLine };
    }
    const csvMatch = cleanLine.match(/^["']?([^,"']+)["']?\s*,\s*(\d+)/);
    if (csvMatch) {
      return { name: csvMatch[1].trim(), id: csvMatch[2], originalLine: cleanLine };
    }
    const idMatch = cleanLine.match(/^(\d{5,})$/);
    if (idMatch) {
      return { name: `Asset_${idMatch[1]}`, id: idMatch[1], originalLine: cleanLine };
    }
    const urlMatch = cleanLine.match(/(\d{8,})/);
    if (urlMatch) {
      return { name: `Asset_${urlMatch[1]}`, id: urlMatch[1], originalLine: cleanLine };
    }
    return { name: 'Unknown', id: '0', originalLine: cleanLine };
  });
};

export default function SpooferPage() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const lang = language;
  const currentT = translations[language] || translations['id'];

  const [assetInput, setAssetInput] = useState('');
  const [activeTab, setActiveTab] = useState('animation');
  const [autoUploadSelection, setAutoUploadSelection] = useState(null);
  const [spoofing, setSpoofing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimerState] = useState(null);

  const [claimingFree, setClaimingFree] = useState(false);
  const [onlineCount, setOnlineCount] = useState(136);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next > 200 ? 200 : next < 80 ? 80 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    return () => { if (timer) clearInterval(timer); };
  }, [timer]);

  const claimFreeCoin = async () => {
    setClaimingFree(true);
    try {
      const res = await fetch('/api/coins/claim-free', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Free Daily Coin claimed successfully!', 'success');
        refreshUser();
      } else {
        showToast(data.error || 'Failed to claim free coin', 'error');
      }
    } catch (err) {
      showToast('Error claiming free coin', 'error');
    } finally {
      setClaimingFree(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs?limit=20', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs);
        const s = data.data.logs.filter(l => l.status === 'success').length;
        const f = data.data.logs.filter(l => l.status === 'failed').length;
        setStats({ total: data.data.pagination.total, successful: s, failed: f });
      }
    } catch {}
  };

  const startSpoof = async () => {
    if (!assetInput.trim()) { showToast(currentT.enterIds, 'error'); return; }
    if (autoUploadSelection === null) {
      showToast(currentT.selectMode, 'error');
      return;
    }
    if (autoUploadSelection === true && !user.robloxId) {
      showToast(currentT.linkRoblox, 'error');
      return;
    }

    const isUnlimited = user?.role === 'admin' || user?.role === 'top_spender';
    const linesCount = assetInput.split('\n').filter(line => line.trim()).length;
    const costPerAssetVal = activeTab === 'ugc' ? 50 : (activeTab === 'mesh' ? 3 : 0);
    const totalCostVal = costPerAssetVal * linesCount;
    if (totalCostVal > 0 && !isUnlimited && (user?.coins || 0) < totalCostVal) {
      showToast(currentT.insufficientToast(totalCostVal, user?.coins || 0), 'error');
      return;
    }

    setSpoofing(true);
    setStatus('Spoofing...');
    setProgress(10);
    setElapsed(0);

    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    setTimerState(t);

    try {
      setProgress(30);
      const res = await fetch('/api/roblox/spoof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assets: assetInput, type: activeTab, autoUpload: autoUploadSelection }),
      });

      setProgress(80);
      const data = await res.json();

      if (data.success) {
        setProgress(100);
        setStatus('Spoofing Completed');
        setStats({ total: data.data.total, successful: data.data.successful, failed: data.data.failed });

        const newLogs = data.data.logs.map((l, i) => ({
          _id: Date.now() + i,
          assetName: l.assetName,
          originalAssetId: l.originalId,
          originalLine: l.originalLine,
          newAssetId: l.newAssetId,
          status: l.status,
          fileSize: l.fileSize || 0,
          duration: l.duration,
          error: l.error,
          fileData: l.fileData,
          assetType: l.assetType,
          createdAt: new Date().toISOString(),
        }));
        setLogs(prev => [...newLogs, ...prev]);
        showToast(currentT.successToast(data.data.successful, data.data.total), 'success');
        refreshUser();
      } else {
        setStatus('Failed');
        setProgress(0);
        showToast(data.error, 'error');

        // Create client-side failed logs
        const tempAssets = parseClientInput(assetInput);
        const failedLogs = tempAssets.map((asset, i) => ({
          _id: Date.now() + i,
          assetName: asset.name,
          originalAssetId: asset.id,
          originalLine: asset.originalLine,
          newAssetId: null,
          status: 'failed',
          fileSize: 0,
          duration: 0,
          error: data.error,
          createdAt: new Date().toISOString(),
        }));
        setLogs(prev => [...failedLogs, ...prev]);
      }
    } catch (err) {
      setStatus('Error');
      setProgress(0);
      showToast(err.message, 'error');

      const tempAssets = parseClientInput(assetInput);
      const failedLogs = tempAssets.map((asset, i) => ({
        _id: Date.now() + i,
        assetName: asset.name,
        originalAssetId: asset.id,
        originalLine: asset.originalLine,
        newAssetId: null,
        status: 'failed',
        fileSize: 0,
        duration: 0,
        error: err.message,
        createdAt: new Date().toISOString(),
      }));
      setLogs(prev => [...failedLogs, ...prev]);
    } finally {
      clearInterval(t);
      setTimerState(null);
      setSpoofing(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };


  return (
    <div>
      {/* 3D Animated Welcome Card */}
      <div className="card" style={{ 
        marginBottom: 24, 
        padding: '32px 36px', 
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(18,18,22,0.85) 0%, rgba(255,45,133,0.03) 100%)',
        border: '1px solid rgba(255, 45, 133, 0.25)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        transform: 'perspective(1000px) rotateX(1.5deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24
      }}>
        {/* Left Section: User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* 3D Spinning Avatar Container */}
          <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
            <div style={{
              position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #e30613, #1e1f22, #e30613, #ffffff)',
              backgroundSize: '400%',
              animation: 'spinGlow 6s linear infinite',
              zIndex: 0
            }} />
            {user?.robloxAvatar ? (
              <img 
                src={user.robloxAvatar} 
                alt="Roblox Avatar" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  position: 'relative', 
                  zIndex: 1,
                  border: '2px solid #0f0f11',
                  background: 'radial-gradient(circle, #2e3035 0%, #111215 100%)',
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: 'radial-gradient(circle, #2e3035 0%, #111215 100%)', 
                color: 'var(--accent)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 900, 
                fontSize: '1.4rem',
                position: 'relative',
                zIndex: 1,
                border: '2px solid #0f0f11'
              }}>
                {user?.robloxUsername?.[0]?.toUpperCase() || 'R'}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {user?.robloxId ? currentT.robloxWorkspace : currentT.connectionRequired}
            </div>
            
            {user?.robloxId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
                  {user.robloxDisplayName || user.robloxUsername}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'var(--font-mono)' }}>
                  @{user.robloxUsername}
                </div>
              </div>
            ) : (
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                {currentT.notLinked}
              </h2>
            )}
          </div>
        </div>

        {/* Right Section: 3D Coins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* 3D Coin Indicator */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fffdf5 0%, #fffbeb 100%)', 
            border: '1px solid rgba(245, 158, 11, 0.3)', 
            borderRadius: 14, 
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.08)'
          }}>
            <span className="coin-3d" style={{ fontSize: '1.6rem', display: 'inline-block', animation: 'spinCoin 3.5s linear infinite' }}>
              {user?.role === 'top_spender' || user?.role === 'admin' ? '♾️' : '🪙'}
            </span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.62rem', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {lang === 'en' ? 'Coins Balance' : 'Saldo Koin'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {user?.role === 'top_spender' || user?.role === 'admin' ? 'UNLIMITED' : (user?.coins || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spinGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinCoin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        :global(.ticket-btn-hover:hover) {
          background: #7289da !important;
          color: #fff !important;
          box-shadow: 0 6px 20px rgba(114, 137, 218, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Bulk Spoof */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{currentT.engineTitle}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>{currentT.engineSub}</p>
          
          {/* Feature Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: 6, 
            marginBottom: 16, 
            background: 'var(--bg-secondary)', 
            padding: '8px 8px',
            borderRadius: 12, 
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'animation', label: 'Animation', icon: '🎬', price: 'Free' },
              { id: 'audio', label: 'Audio', icon: '🎵', price: 'Free' },
              { id: 'video', label: 'Videos', icon: '🎥', price: 'Free' },
              { id: 'ugc', label: 'UGC', icon: '👑', price: '50 Coins' },
              { id: 'mesh', label: 'Mesh', icon: '📐', price: '3 Coins' }
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    flex: '1 0 auto',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    border: active ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    minWidth: 80,
                    position: 'relative'
                  }}
                >
                  {tab.id === 'animation' && (
                    <span style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                      color: '#fff',
                      fontSize: '0.48rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      animation: 'pulse 1.8s infinite',
                      zIndex: 10
                    }}>
                      MOST USED ⚡
                    </span>
                  )}
                  {tab.id === 'ugc' && (
                    <span style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'linear-gradient(135deg, #ff007f 0%, #7000ff 100%)',
                      color: '#fff',
                      fontSize: '0.48rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 0 10px rgba(255, 0, 127, 0.4)',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      animation: 'pulse 1.8s infinite',
                      zIndex: 10
                    }}>
                      TRENDING 🔥
                    </span>
                  )}
                  <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{tab.label}</span>
                  <span style={{ 
                    fontSize: '0.55rem', 
                    fontWeight: 700, 
                    padding: '1px 5px', 
                    borderRadius: 4, 
                    background: tab.price === 'Free' ? 'rgba(57,255,20,0.12)' : 'rgba(255,184,0,0.12)',
                    color: tab.price === 'Free' ? '#39ff14' : '#ffb800',
                    marginTop: 2
                  }}>
                    {tab.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Info Box */}
          <div style={{ background: 'rgba(255, 45, 133, 0.03)', border: '1px solid rgba(255, 45, 133, 0.12)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {activeTab === 'animation' && (
                <>
                  <li>{currentT.animDetail1}</li>
                  <li>{currentT.animDetail2}</li>
                  <li>{currentT.animDetail3}</li>
                </>
              )}
              {activeTab === 'ugc' && (
                <>
                  <li>{currentT.ugcDetail1}</li>
                  <li>{currentT.ugcDetail2}</li>
                  <li>{currentT.ugcDetail3}</li>
                </>
              )}
              {activeTab === 'audio' && (
                <>
                  <li>{currentT.audioDetail1}</li>
                  <li>{currentT.audioDetail2}</li>
                  <li>{currentT.audioDetail3}</li>
                </>
              )}
              {activeTab === 'video' && (
                <>
                  <li>{currentT.videoDetail1}</li>
                  <li>{currentT.videoDetail2}</li>
                  <li>{currentT.videoDetail3}</li>
                </>
              )}
              {activeTab === 'mesh' && (
                <>
                  <li>{currentT.meshDetail1}</li>
                  <li>{currentT.meshDetail2}</li>
                  <li>{currentT.meshDetail3}</li>
                </>
              )}
            </ul>
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Assets Input List ({activeTab.toUpperCase()})</div>
          <textarea
            className="textarea"
            placeholder={
              activeTab === 'animation' 
                ? 'Input Animation IDs here...\n11564428254632\n12820096568127'
                : activeTab === 'ugc'
                ? 'Input UGC IDs here...\n11564428254632\n12820096568127'
                : activeTab === 'audio'
                ? 'Input Audio IDs here...\n11564428254632'
                : activeTab === 'video'
                ? 'Input Video IDs here...\n12820096568127'
                : 'Input Mesh IDs here...\n11564428254632'
            }
            value={assetInput}
            onChange={e => setAssetInput(e.target.value)}
            style={{ marginBottom: 12, minHeight: 120 }}
          />

          {/* Cost Estimate and Coin Validation */}
          {(() => {
            const lines = assetInput.split('\n').filter(line => line.trim());
            const totalAssets = lines.length;
            const costPerAsset = activeTab === 'ugc' ? 50 : (activeTab === 'mesh' ? 3 : 0);
            const totalCost = costPerAsset * totalAssets;
            const isUnlimited = user?.role === 'admin' || user?.role === 'top_spender';
            const balance = user?.coins || 0;
            const hasEnough = isUnlimited || balance >= totalCost;

            return (
              <div style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: 10, 
                padding: 12, 
                marginBottom: 16, 
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentT.totalAssets}:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalAssets} {lang === 'en' ? 'assets' : 'aset'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentT.totalCost}:</span>
                  <span style={{ fontWeight: 700, color: totalCost === 0 ? '#39ff14' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {totalCost === 0 ? 'FREE' : <><span style={{ animation: 'spinCoin 3.5s linear infinite' }}>🪙</span> {totalCost} {lang === 'en' ? 'Coins' : 'Koin'}</>}
                  </span>
                </div>
                {totalCost > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{currentT.yourCoins}:</span>
                      <span style={{ fontWeight: 700, color: hasEnough ? '#39ff14' : 'var(--fail)' }}>
                        {isUnlimited ? 'UNLIMITED' : `${balance} ${lang === 'en' ? 'Coins' : 'Koin'}`}
                      </span>
                    </div>
                    {!hasEnough && (
                      <div style={{ 
                        color: 'var(--fail)', 
                        fontSize: '0.7rem', 
                        marginTop: 4, 
                        background: 'rgba(255, 45, 133, 0.05)', 
                        padding: '6px 8px', 
                        borderRadius: 6,
                        border: '1px solid rgba(255, 45, 133, 0.15)'
                      }}>
                        ⚠️ {currentT.insufficientCoins}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Spoof Action Selection Mode */}
          <div style={{ 
            background: 'var(--bg-secondary)', 
            borderRadius: 10, 
            padding: 14, 
            marginBottom: 16, 
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentT.processingMethod}
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: autoUploadSelection === true ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input 
                type="radio" 
                name="autoUpload" 
                checked={autoUploadSelection === true} 
                onChange={() => setAutoUploadSelection(true)}
                style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <span style={{ transition: 'color 0.2s' }}>
                🚀 <strong>{currentT.autoUploadLabel}</strong>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {currentT.autoUploadDesc}
                </span>
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: autoUploadSelection === false ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input 
                type="radio" 
                name="autoUpload" 
                checked={autoUploadSelection === false} 
                onChange={() => setAutoUploadSelection(false)}
                style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <span style={{ transition: 'color 0.2s' }}>
                📦 <strong>{currentT.bypassOnlyLabel}</strong>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {currentT.bypassOnlyDesc}
                </span>
              </span>
            </label>

            {/* Inline warning if Auto-Upload is selected but Roblox is not linked */}
            {autoUploadSelection === true && !user?.robloxId && (
              <div style={{ 
                color: 'var(--warning)', 
                fontSize: '0.7rem', 
                background: 'rgba(255, 184, 0, 0.05)', 
                padding: '8px 10px', 
                borderRadius: 8,
                border: '1px solid rgba(255, 184, 0, 0.2)',
                lineHeight: 1.4
              }}>
                {currentT.notConnected}
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: 14 }} 
            onClick={startSpoof} 
            disabled={
              spoofing || 
              autoUploadSelection === null ||
              (autoUploadSelection === true && !user?.robloxId) ||
              (() => {
                const isUnlimited = user?.role === 'admin' || user?.role === 'top_spender';
                if (isUnlimited) return false;
                const lines = assetInput.split('\n').filter(line => line.trim());
                const costPerAsset = activeTab === 'ugc' ? 50 : (activeTab === 'mesh' ? 3 : 0);
                const totalCost = costPerAsset * lines.length;
                return (user?.coins || 0) < totalCost;
              })()
            }
          >
            {spoofing ? <><span className="spinner"></span> {currentT.spoofing}</> : currentT.startBypass}
          </button>
        </div>

        {/* Execution Logs */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{currentT.execLogs}</h3>
            <span className="badge badge-success">{logs.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 340, overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{currentT.noLogs}</div>
            ) : logs.map((log, i) => (
               <div key={log._id || i} className="log-entry">
                 <span className="log-ts">{new Date(log.createdAt).toLocaleTimeString()}</span>
                 <span className={`log-badge-s ${log.status}`}>{log.status.toUpperCase()}</span>
                 <span className="log-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 160px)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                   {(() => {
                     if (log.status !== 'success') {
                       return <span style={{ color: 'var(--fail)' }} title={log.error}>{log.error || 'Failed'}</span>;
                     }
                     if (!log.newAssetId) {
                       return (
                         <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                           {lang === 'en' ? 'Bypassed (Download in Execution Logs)' : 'Ter-bypass (Unduh di Execution Logs)'}
                         </span>
                       );
                     }
                     if (log.originalLine && log.originalLine.includes(log.originalAssetId)) {
                       const parts = log.originalLine.split(log.originalAssetId);
                       return (
                         <>
                           {parts[0]}
                           <a 
                             href={`https://create.roblox.com/store/asset/${log.newAssetId}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 700 }}
                           >
                             {log.newAssetId}
                           </a>
                           {parts[1]}
                         </>
                       );
                     }
                     return (
                       <>
                         &quot;{log.assetName}&quot; →{' '}
                         <a 
                           href={`https://create.roblox.com/store/asset/${log.newAssetId}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 700 }}
                         >
                           {log.newAssetId}
                         </a>
                       </>
                     );
                   })()}
                   {log.status === 'success' && ` (${formatSize(log.fileSize)})`}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Spoofing Status */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>{currentT.spoofStatus}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● Status</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: status === 'Spoofing Completed' ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {status === 'Idle' ? (lang === 'en' ? 'Idle' : 'Menunggu') : status === 'Spoofing...' ? (lang === 'en' ? 'Spoofing...' : 'Memproses...') : status === 'Spoofing Completed' ? (lang === 'en' ? 'Spoofing Completed' : 'Selesai') : (lang === 'en' ? 'Failed' : 'Gagal')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● {currentT.timeElapsed}</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{formatTime(elapsed)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● {currentT.progress}</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{progress}%</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● {lang === 'en' ? 'Spoofed Items' : 'Item Berhasil'}</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{stats.successful}/{stats.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Deployment Summary */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>{lang === 'en' ? 'Deployment Summary' : 'Ringkasan Deployment'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Total Attempts' : 'Total Percobaan'}</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stats.total}</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Success Rate' : 'Tingkat Keberhasilan'}</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Successful' : 'Berhasil'}</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{stats.successful}</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Failed' : 'Gagal'}</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--fail)' }}>{stats.failed}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
