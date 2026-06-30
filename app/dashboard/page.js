'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const translations = {
  id: {
    choosePlan: "PILIH PAKET ANDA",
    choosePlanSub: "Silakan aktifkan paket atau lakukan top up koin sebelum menggunakan BERNADA SPOOFER.",
    freeTier: "Paket Gratis",
    freeFeatures: [
      "1x Kuota bypass harian gratis",
      "Antrean single ID input (Tidak mendukung bulk processing)",
      "Cookie authentication fallback saja"
    ],
    btnActivateFree: "Aktifkan Free Daily Spoof",
    btnActivating: "Mengaktifkan...",
    topUpCoins: "Top-Up Koin",
    topUpDesc: "Koin berlaku khusus untuk BERNADA SPOOFER. 1 Koin = 1 Sukses Spoof.",
    spooferFeatures: [
      "Bulk bypass (Hingga 10 aset secara bersamaan)",
      "Otomatisasi auto-upload katalog Roblox"
    ],
    btnPurchaseCoins: "Beli Koin",
    welcomeBack: "Welcome back",
    totalTopUp: "Total Top Up",
    benefit: "Benefit",
    topUpNeededPrefix: "Top-up",
    topUpNeededSuffix: "koin lagi untuk unlock rank",
    coinsBalance: "Coins Balance",
    launcherShortcuts: "Launcher Shortcuts",
    launcherSub: "Quickly launch your active developer workspaces.",
    openTool: "Open Tool",
    locked: "Locked",
    active: "ACTIVE",
    comingSoon: "COMING SOON",
    serverStatus: "Server Status & Latency",
    serverOnline: "Server Online",
    nodeLatency: "Node Latency",
    activityFeed: "Global Activity Feed",
    activitySub: "Real-time anonymized telemetry of assets bypassed by our active system nodes.",
    user: "User",
    type: "Type",
    status: "Status",
    time: "Time",
    linkStatusTitle: "Roblox Link Status",
    linkedAccount: "Linked Account",
    sessionActive: "Roblox Cookie Session: ACTIVE",
    noAccountLinked: "No Roblox account linked to this profile. Connect your account to enable spoofer integration.",
    btnLinkAccount: "Link Account",
    antiDetectTitle: "Anti-Detection Engine",
    antiDetectSub: "Advanced evasion modules operating on Open Cloud uploading.",
    signatureMorphing: "Signature Morphing",
    yaraCloaker: "YARA Header Cloaker",
    apiFingerprint: "API Fingerprint Spoof",
    assetIntegrity: "Asset Integrity Check",
    mutating: "MUTATING",
    secure: "SECURE",
    bypassing: "BYPASSING",
    verified: "VERIFIED",
    systemTelemetry: "System Telemetry",
    telemetryEngine: "Bypass Engine",
    telemetryDevelopers: "Total User Online",
    telemetryLatency: "Queue Latency",
    telemetryFallback: "Cloud API Fallback",
    onlineSuffix: "Users",
    bernadaClubTitle: "BERNADA STORE - HALL OF FAME",
    bernadaClubSub: "Apresiasi khusus untuk member elit rank TOP SPENDER dengan kontribusi terbaik.",
    noSpendersYet: "Belum ada member Bernada Store saat ini. Jadilah yang pertama!"
  },
  en: {
    choosePlan: "CHOOSE YOUR PLAN",
    choosePlanSub: "Please activate a plan or top up your coins before launching BERNADA SPOOFER.",
    freeTier: "Free Tier",
    freeFeatures: [
      "1 Free daily bypass operation credit",
      "Single ID input queue (No bulk processing)",
      "Cookie authentication fallback only"
    ],
    btnActivateFree: "Activate Free Daily Spoof",
    btnActivating: "Activating...",
    topUpCoins: "Top-Up Coins",
    topUpDesc: "Coins are valid exclusively for BERNADA SPOOFER. 1 Coin = 1 Successful Spoof.",
    spooferFeatures: [
      "Bulk bypass (Up to 10 assets concurrently)",
      "Roblox catalog auto-upload automation"
    ],
    btnPurchaseCoins: "Purchase Coins",
    welcomeBack: "Welcome back",
    totalTopUp: "Total Top Up",
    benefit: "Benefit",
    topUpNeededPrefix: "Top-up",
    topUpNeededSuffix: "more coins to unlock rank",
    coinsBalance: "Coins Balance",
    launcherShortcuts: "Launcher Shortcuts",
    launcherSub: "Quickly launch your active developer workspaces.",
    openTool: "Open Tool",
    locked: "Locked",
    active: "ACTIVE",
    comingSoon: "COMING SOON",
    serverStatus: "Server Status & Latency",
    serverOnline: "Server Online",
    nodeLatency: "Node Latency",
    activityFeed: "Global Activity Feed",
    activitySub: "Real-time anonymized telemetry of assets bypassed by our active system nodes.",
    user: "User",
    type: "Type",
    status: "Status",
    time: "Time",
    linkStatusTitle: "Roblox Link Status",
    linkedAccount: "Linked Account",
    sessionActive: "Roblox Cookie Session: ACTIVE",
    noAccountLinked: "No Roblox account linked to this profile. Connect your account to enable spoofer integration.",
    btnLinkAccount: "Link Account",
    antiDetectTitle: "Anti-Detection Engine",
    antiDetectSub: "Advanced evasion modules operating on Open Cloud uploading.",
    signatureMorphing: "Signature Morphing",
    yaraCloaker: "YARA Header Cloaker",
    apiFingerprint: "API Fingerprint Spoof",
    assetIntegrity: "Asset Integrity Check",
    mutating: "MUTATING",
    secure: "SECURE",
    bypassing: "BYPASSING",
    verified: "VERIFIED",
    systemTelemetry: "System Telemetry",
    telemetryEngine: "Bypass Engine",
    telemetryDevelopers: "Total Online Users",
    telemetryLatency: "Queue Latency",
    telemetryFallback: "Cloud API Fallback",
    onlineSuffix: "Users",
    bernadaClubTitle: "BERNADA STORE - HALL OF FAME",
    bernadaClubSub: "Special appreciation for elite TOP SPENDER members with the highest contributions.",
    noSpendersYet: "No Bernada Store members yet. Be the first one!"
  }
};

const getRankDetails = (role = 'user', totalTopUp = 0, lang = 'id') => {
  const isEn = lang === 'en';
  if (role === 'admin') {
    return { name: 'ADMIN', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', nextRank: null, coinsNeeded: 0, perk: isEn ? 'Full system access, admin panel, add coins, manage users & ranks.' : 'Akses penuh sistem, panel administrasi, tambah koin, kelola user & pangkat.' };
  }
  if (role === 'top_spender') {
    return { name: 'TOP SPENDER', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', nextRank: null, coinsNeeded: 0, perk: isEn ? '💎 UNLIMITED COIN (Free Spoofing 0 Coins Lifetime) + Exclusive VIP Discord access.' : '💎 UNLIMITED COIN (Bypass Gratis Selamanya 0 Koin) + Akses Khusus VIP Discord.' };
  }
  if (totalTopUp >= 500) {
    return { name: 'EXCLUSIVE', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', nextRank: null, coinsNeeded: 0, perk: isEn ? 'No bypass limits + No queue delay (Highest priority queue).' : 'Tidak ada batasan spoof + Bebas antrean (Prioritas Antrean Tertinggi).' };
  }
  if (totalTopUp >= 50) {
    return { name: 'PREMIUM', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', nextRank: 'EXCLUSIVE', coinsNeeded: 500 - totalTopUp, perk: isEn ? 'No bypass limits + Priority queue above Basic.' : 'Tidak ada batasan spoof + Prioritas antrean di atas Basic.' };
  }
  return { name: 'BASIC', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)', border: 'rgba(107, 114, 128, 0.15)', nextRank: 'PREMIUM', coinsNeeded: 50 - totalTopUp, perk: isEn ? 'Limit of 10x bypasses per week (all asset types combined) + Standard queue.' : 'Batas 10x spoof/bypass per minggu (semua tipe aset digabung) + Antrean standard.' };
};

export default function DashboardPage() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || translations['id'][key];
  const [claimingFree, setClaimingFree] = useState(false);
  const [onlineCount, setOnlineCount] = useState(136);
  const [nodeLatency, setNodeLatency] = useState(42);
  const [topSpenders, setTopSpenders] = useState([]);

  useEffect(() => {
    if (token) {
      fetch('/api/users/top-spenders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTopSpenders(data.data);
        }
      })
      .catch(() => {});
    }
  }, [token]);

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchTelemetry = () => {
      fetch('/api/telemetry', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOnlineCount(data.data.onlineCount);
          setActivity(data.data.activity);
        }
      })
      .catch(() => {});
    };

    fetchTelemetry();

    const interval = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodeLatency(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const next = prev + change;
        return next > 65 ? 65 : next < 30 ? 30 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  if (user?.coins === 0) {
    return (
      <div style={{ padding: '20px 0' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12, textAlign: 'center' }}>{t('choosePlan')}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 48, textAlign: 'center', maxWidth: 500, margin: '0 auto 48px' }}>
          {t('choosePlanSub')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto', alignItems: 'stretch' }}>
          
          {/* FREE PLAN */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 36, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{t('freeTier')}</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>
                Rp 0
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {translations[language]?.freeFeatures.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={claimFreeCoin}
              disabled={claimingFree}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                cursor: claimingFree ? 'not-allowed' : 'pointer',
                marginTop: 'auto',
                transition: 'var(--transition)'
              }}
              className="btn-outline"
            >
              {claimingFree ? t('btnActivating') : t('btnActivateFree')}
            </button>
          </div>

          {/* TOP UP COINS */}
          <div className="card" style={{ 
            background: 'rgba(37, 99, 235, 0.02)', 
            borderColor: 'rgba(37, 99, 235, 0.25)',
            padding: 36,
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{t('topUpCoins')}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                {t('topUpDesc')}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
                {[
                  { qty: 10, price: 'Rp 30.000' },
                  { qty: 50, price: 'Rp 120.000' },
                  { qty: 100, price: 'Rp 220.000' },
                  { qty: 250, price: 'Rp 500.000' },
                  { qty: 500, price: 'Rp 900.000' },
                  { qty: 1000, price: 'Rp 1.500.000' }
                ].map((pkg) => (
                  <div key={pkg.qty} style={{
                    background: 'rgba(37, 99, 235, 0.03)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: 8,
                    padding: '8px 4px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)' }}>{pkg.qty} Coins</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{pkg.price}</div>
                  </div>
                ))}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {translations[language]?.spooferFeatures.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#ff2d85', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a 
              href="/dashboard/topup" 
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                background: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 4px 18px rgba(37, 99, 235, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="card-btn-hover"
            >
              {t('btnPurchaseCoins')}
            </a>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Premium Welcome Card */}
      <div className="card" style={{ 
        marginBottom: 24, 
        padding: '24px 32px', 
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0.01) 100%)',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        boxShadow: '0 8px 30px rgba(37, 99, 235, 0.02)',
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
              background: 'linear-gradient(45deg, #2563eb, #7c3aed, #60a5fa, #2563eb)',
              backgroundSize: '400%',
              animation: 'spinGlow 6s linear infinite',
              zIndex: 0
            }} />
            {user?.discordAvatar ? (
              <img 
                src={user.discordAvatar} 
                alt="Avatar" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  position: 'relative', 
                  zIndex: 1,
                  border: '2px solid #fff',
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: 'var(--accent-dim)', 
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
                {(user?.discordUsername || user?.username)?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{t('welcomeBack')}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
              {user?.discordUsername || user?.username}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              {/* Rank Badge */}
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                padding: '4px 12px', 
                borderRadius: 100, 
                background: getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).bg,
                color: getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).color,
                border: `1px solid ${getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).border}`,
                letterSpacing: '0.08em',
                boxShadow: `0 0 12px ${getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).bg}`,
                textTransform: 'uppercase'
              }}>
                RANK: {getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).name}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {t('totalTopUp')}: <strong>{user?.role === 'top_spender' || user?.role === 'admin' ? 'UNLIMITED' : `${user?.totalTopUp || 0} ${t('coins')}`}</strong>
              </span>
            </div>
            
            <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✨</span>
                <span>{t('benefit')}: <strong style={{ color: 'var(--text-primary)' }}>{getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).perk}</strong></span>
              </div>
              {getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).nextRank && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡</span>
                  <span>{t('topUpNeededPrefix')} <strong>{getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).coinsNeeded} {t('coins')}</strong> {t('topUpNeededSuffix')} <strong style={{ color: 'var(--accent)' }}>{getRankDetails(user?.role || 'user', user?.totalTopUp || 0, language).nextRank}</strong>.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Premium Coins Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
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
              <div style={{ fontSize: '0.62rem', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{t('coinsBalance')}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {user?.role === 'top_spender' || user?.role === 'admin' ? 'UNLIMITED' : (user?.coins || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bernada Club Hall of Fame (Top Spenders Widget) */}
      <div className="card" style={{
        marginBottom: 24,
        padding: '24px 32px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(251, 191, 36, 0.01) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.25)',
        boxShadow: '0 8px 30px rgba(251, 191, 36, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#d97706', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              👑 {t('bernadaClubTitle')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {t('bernadaClubSub')}
            </p>
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 100,
            background: 'rgba(251, 191, 36, 0.1)',
            color: '#d97706',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            letterSpacing: '0.05em'
          }}>
            ELITE MEMBERS
          </span>
        </div>

        {topSpenders.length > 0 ? (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {topSpenders.map((spender, index) => (
              <div key={spender._id || index} className="top-spender-card" style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                borderRadius: 16,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                minWidth: 180,
                flex: '1 1 calc(20% - 16px)',
                textAlign: 'center'
              }}>
                {/* 3D Rotating Golden Border Ring on Avatar (Centered) */}
                <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0, marginBottom: 4 }}>
                  <div style={{
                    position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #fbbf24, #d97706, #fef08a, #fbbf24)',
                    backgroundSize: '300%',
                    animation: 'spinGlow 4s linear infinite',
                    zIndex: 0
                  }} />
                  {spender.discordAvatar ? (
                    <img 
                      src={spender.discordAvatar} 
                      alt="Avatar" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '50%', 
                        position: 'relative', 
                        zIndex: 1,
                        border: '2px solid var(--bg-card-solid)',
                        objectFit: 'cover'
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%', 
                      position: 'relative', 
                      zIndex: 1,
                      border: '2px solid var(--bg-card-solid)',
                      background: 'rgba(251, 191, 36, 0.1)',
                      color: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900
                    }}>
                      {(spender.discordUsername || spender.username)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {/* Floating Gold Crown */}
                  <span style={{
                    position: 'absolute',
                    top: -12,
                    right: -4,
                    fontSize: '0.9rem',
                    zIndex: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(217, 119, 6, 0.4))',
                    animation: 'floatCrown 2s ease-in-out infinite'
                  }}>👑</span>
                </div>

                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                    {spender.discordUsername || spender.username}
                  </span>
                  {/* Rank tag & stats (Centered below avatar) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <span style={{
                      fontSize: '0.58rem',
                      fontWeight: 900,
                      color: '#fbbf24',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'rgba(251, 191, 36, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid rgba(251, 191, 36, 0.15)'
                    }}>
                      TOP SPENDER
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      UNLIMITED
                    </span>
                  </div>
                </div>

                {/* Subtle Luxury Pattern Background overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.04) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            background: 'var(--bg-card-solid)', 
            border: '1px dashed rgba(251, 191, 36, 0.2)', 
            borderRadius: 12, 
            fontSize: '0.78rem', 
            color: 'var(--text-secondary)' 
          }}>
            ✨ {t('noSpendersYet')}{' '}
            <Link href="/dashboard/topup" style={{ color: '#d97706', fontWeight: 700, textDecoration: 'none', marginLeft: 4 }}>
              Top Up Now →
            </Link>
          </div>
        )}
      </div>

      {/* Grid of Control widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        
        {/* Left: Quick Launcher & Live Global Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Launcher Shortcuts */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{t('launcherShortcuts')}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>{t('launcherSub')}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Spoofer */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px 20px', 
                borderRadius: 14, 
                background: 'rgba(255, 45, 133, 0.02)',
                border: '1px solid rgba(255, 45, 133, 0.15)',
                transition: 'var(--transition)'
              }} className="card-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>BERNADA Spoofer</h4>
                    <span style={{ fontSize: '0.7rem', color: '#ff5ba1', fontWeight: 700 }}>{t('active')}</span>
                  </div>
                </div>
                <Link href="/dashboard/spoofer" style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(255, 45, 133, 0.25)'
                }} className="card-btn-hover">
                  {t('openTool')}
                </Link>
              </div>

              {/* Audio Converter */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px 20px', 
                borderRadius: 14, 
                background: 'rgba(37, 99, 235, 0.02)',
                border: '1px solid rgba(37, 99, 235, 0.15)',
                transition: 'var(--transition)'
              }} className="card-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '1.5rem' }}>🎵</span>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>BERNADA Audio</h4>
                    <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700 }}>{t('active')}</span>
                  </div>
                </div>
                <Link href="/dashboard/audio" style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }} className="card-btn-hover">
                  {t('openTool')}
                </Link>
              </div>

              {/* Mixing */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px 20px', 
                borderRadius: 14, 
                background: 'rgba(124, 58, 237, 0.02)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                transition: 'var(--transition)'
              }} className="card-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '1.5rem' }}>🎛️</span>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>BERNADA Mixing</h4>
                    <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 700 }}>{t('active')}</span>
                  </div>
                </div>
                <Link href="/dashboard/mixing" style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                }} className="card-btn-hover">
                  {t('openTool')}
                </Link>
              </div>
            </div>
          </div>

          {/* Live Global Activity Feed */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t('activityFeed')}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="live-dot" style={{ 
                  width: 6, height: 6, background: '#ff2d85', borderRadius: '50%', display: 'inline-block',
                  boxShadow: '0 0 8px #ff2d85', animation: 'pulse 1.5s infinite'
                }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700 }}>LIVE SPOOFS</span>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>{t('activitySub')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180 }}>
              {activity.map((act) => (
                <div key={act.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 18px', 
                  background: 'rgba(255, 45, 133, 0.01)', 
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderRadius: 12,
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: '1.2rem' }}>
                      {act.type === 'Mesh' ? '📦' : act.type === 'Audio' ? '🎵' : '🏃'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{act.user}</strong> spoofed &quot;{act.asset}&quot;
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        Type: {act.type} • {act.time}
                      </div>
                    </div>
                  </div>
                  
                  <span style={{ 
                    fontSize: '0.62rem', 
                    fontWeight: 900, 
                    padding: '3px 8px', 
                    borderRadius: 100, 
                    background: 'rgba(57, 255, 20, 0.08)',
                    color: '#39ff14',
                    border: '1px solid rgba(57, 255, 20, 0.15)',
                    letterSpacing: '0.04em'
                  }}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Roblox Connection, Anti-Detection & Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Roblox Connection Widget */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{t('linkStatusTitle')}</h3>
            {user?.robloxId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255, 45, 133, 0.25)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {user?.robloxAvatar ? (
                      <img 
                        src={user.robloxAvatar}
                        alt="Roblox Headshot"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.25rem' }}>🤖</span>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {user.robloxUsername || t('linkedAccount')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      ID: {user.robloxId}
                    </div>
                  </div>
                </div>
                
                {/* Session Health status */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: '8px 12px', 
                  background: 'rgba(57, 255, 20, 0.03)', 
                  border: '1px solid rgba(57, 255, 20, 0.12)', 
                  borderRadius: 8,
                  marginTop: 4
                }}>
                  <span style={{ width: 6, height: 6, background: '#39ff14', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #39ff14' }}></span>
                  <span style={{ fontSize: '0.7rem', color: '#39ff14', fontWeight: 700 }}>{t('sessionActive')}</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                  {t('noAccountLinked')}
                </div>
                <Link href="/dashboard/account" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'var(--transition)'
                }} className="btn-outline">
                  {t('btnLinkAccount')}
                </Link>
              </div>
            )}
          </div>

          {/* Anti-Detection Engine Panel */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{t('antiDetectTitle')}</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 16 }}>{t('antiDetectSub')}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('signatureMorphing')}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(255, 45, 133, 0.08)', padding: '2px 8px', borderRadius: 4 }}>{t('mutating')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('yaraCloaker')}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--success)', background: 'rgba(57, 255, 20, 0.08)', padding: '2px 8px', borderRadius: 4 }}>{t('secure')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('apiFingerprint')}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--success)', background: 'rgba(57, 255, 20, 0.08)', padding: '2px 8px', borderRadius: 4 }}>{t('bypassing')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('assetIntegrity')}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--success)', background: 'rgba(57, 255, 20, 0.08)', padding: '2px 8px', borderRadius: 4 }}>{t('verified')}</span>
              </div>
            </div>
          </div>

          {/* System Telemetry */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>{t('systemTelemetry')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>● {t('telemetryEngine')}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success)' }}>ONLINE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>● {t('telemetryDevelopers')}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)' }}>{onlineCount} {t('onlineSuffix')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>● {t('telemetryLatency')}</span>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {nodeLatency}ms
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>● {t('telemetryFallback')}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success)' }}>ACTIVE</span>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatCrown {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.1); }
        }
        :global(.top-spender-card:hover) {
          transform: translateY(-4px) rotateX(4deg) rotateY(4deg) !important;
          border-color: rgba(251, 191, 36, 0.45) !important;
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.15) !important;
        }
        :global(.ticket-btn-hover:hover) {
          background: #7289da !important;
          color: #fff !important;
          box-shadow: 0 6px 20px rgba(114, 137, 218, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
