'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  id: {
    heroTitle: "Kuasai Kreativitas Roblox Tanpa Batas: Spoofer, Audio Bypass & DJ Mixer",
    heroSub: "Gunakan Bernada Spoofer (UGC & Mesh) secara GRATIS, modifikasi pola frekuensi audio dengan presisi melalui Bernada Audio, dan rancang transisi setlist musik secara profesional dengan Bernada Mixing.",
    tickNoVerification: "Tanpa Verifikasi ID",
    tickSeconds: "Instalasi Cepat",
    tickAutomated: "Otomatis & Aman",
    tabStart: "Mulai Sekarang",
    tabFeatures: "Lihat Fitur",
    tabPricelist: "Daftar Harga",
    
    // Slide 0
    s0Badge: "PELOPOR BYPASS ROBLOX",
    s0Title: "Asset Spoofer Otomatis",
    s0Desc: "Bypass verifikasi aset secara instan untuk aksesoris UGC, pakaian, animasi, dan video. Upload otomatis langsung ke katalog cloud Roblox dengan tingkat keberhasilan 99.6%.",
    s0Check1: "Mendukung UGC, Mesh, Anim, Audio & Video",
    s0Check2: "Auto-Upload Langsung ke Roblox",
    
    // Slide 1
    s1Badge: "BYPASS AUDIO LANJUTAN",
    s1Title: "Pemroses Suara Presisi",
    s1Desc: "Modifikasi pola frekuensi, tingkat kecepatan, dan delay stereo untuk menghindari deteksi hak cipta Roblox. Pemotongan lagu panjang otomatis secara real-time.",
    s1Check1: "Pemrosesan Multi-Speed (0.5x - 4.0x)",
    s1Check2: "Slicing & Segmentasi Otomatis",

    // Slide 2
    s2Badge: "ALAT SOUND DEVELOPER",
    s2Title: "Harmonic Transition Mixer",
    s2Desc: "Buat soundtrack kustom, setlist lagu, dan beat drop. Terintegrasi penuh dengan render offline yang lebih cepat dari real-time.",
    s2Check1: "Stereo Routing & Fader Web Audio API",
    s2Check2: "Pitch Locked & Ramping BPM",
    
    // Features slide
    fTitle: "Fitur & Manfaat Platform",
    fSub: "Tingkatkan efisiensi pengembangan Roblox Anda dengan otomatisasi cloud yang terukur.",
    fCard1Title: "Anti-Deteksi & Aman",
    fCard1Desc: "Algoritma bypass mutakhir melindungi akun developer Anda selama proses upload.",
    fCard2Title: "Bypass Verifikasi",
    fCard2Desc: "Bypass limitasi verifikasi aset instan tanpa proses ID yang rumit.",
    fCard3Title: "Otomatisasi Cloud 24/7",
    fCard3Desc: "Bypass beroperasi penuh di server cloud kami. Jalankan kapan saja dan dapatkan hasil instan.",
    
    // Pricelist slide
    pTitle: "Jelajahi Paket Bernada Tools",
    pSub: "Pilih alat pengembangan yang sesuai dengan kebutuhan Anda. Kami menawarkan harga yang fleksibel.",
    pSpooferDesc: "Bypass tak terbatas untuk kreator",
    pAudioDesc: "Prosesor suara bypass tingkat lanjut",
    pMixerDesc: "Pembuat setlist transisi audio otomatis",
    pActive: "AKTIF",
    pComingSoon: "SEGERA HADIR",
    pLocked: "Fitur Terkunci",
    pFreeDesc: "Akses gratis selamanya ke dashboard spoofer",
    pAudio30dDesc: "Akses bypass audio selama 30 Hari",
    pAudioLifetimeDesc: "Akses bypass audio permanen",
    pMixer7dDesc: "Akses mixer audio selama 7 Hari",
    pMixer30dDesc: "Akses mixer audio selama 30 Hari",
    pMixerLifetimeDesc: "Akses mixer audio permanen",
    pPeriod30d: "30 Hari",
    pPeriod7d: "7 Hari",
    pPeriodLifetime: "Permanen",
    pLaunchSpoofer: "Buka Spoofer",
    pLaunchAudio: "Buka Audio",
    pLaunchMixer: "Buka Mixer",

    // Get Started Card
    gWelcome: "Selamat Datang di BernadaStore",
    gWelcomeDesc: "Masuk atau Daftar dengan aman menggunakan akun Discord Anda. Dapatkan akses langsung ke spoofer dashboard, saldo koin, dan log riwayat bypass.",
    gContinue: "Lanjutkan dengan Discord",
    gWelcomeBack: "Selamat Datang Kembali!",
    gWelcomeBackDesc: "Halo, {username}. Sesi Anda aktif. Buka dashboard untuk menggunakan spoofer, koin, dan memantau riwayat upload Anda.",
    gGoDashboard: "Masuk ke Dashboard"
  },
  en: {
    heroTitle: "Master Roblox Creativity Without Limits: Spoofer, Audio Bypass & DJ Mixer",
    heroSub: "Use Bernada Spoofer (UGC & Mesh) for FREE, modify audio frequency patterns with high precision via Bernada Audio, and design professional music setlist transitions with Bernada Mixing.",
    tickNoVerification: "No ID Verification",
    tickSeconds: "Setup in Seconds",
    tickAutomated: "Fully Automated & Secure",
    tabStart: "Get Started Now",
    tabFeatures: "View Features",
    tabPricelist: "Pricelist",
    
    // Slide 0
    s0Badge: "ROBLOX BYPASS LEADER",
    s0Title: "Automated Asset Spoofer",
    s0Desc: "Instantly bypass verification for UGC accessories, clothing, animations, and videos. Automatically upload directly to the Roblox cloud catalog with a 99.6% success rate.",
    s0Check1: "Supports UGC, Mesh, Anim, Audio & Video",
    s0Check2: "Direct Auto-Upload to Roblox Catalog",
    
    // Slide 1
    s1Badge: "ADVANCED AUDIO BYPASS",
    s1Title: "Precision Sound Processor",
    s1Desc: "Modify frequency patterns, speed indices, and stereo delays to bypass Roblox copyright detection. Segment long tracks automatically in real-time.",
    s1Check1: "Multi-Speed Processing (0.5x - 4.0x)",
    s1Check2: "Automatic Slicing & Segmenting",

    // Slide 2
    s2Badge: "DEVELOPER SOUND SUITE",
    s2Title: "Harmonic Transition Mixer",
    s2Desc: "Generate customized soundtracks, setlists, and beat drops. Fully integrated with offline faster-than-realtime rendering engines.",
    s2Check1: "Web Audio API Stereo Routing & Faders",
    s2Check2: "Pitch Locked Transitions & BPM Ramps",
    
    // Features slide
    fTitle: "Platform Features & Benefits",
    fSub: "Unlock Roblox development power with measurable efficiency and cloud automation.",
    fCard1Title: "Anti-Detect & Secure",
    fCard1Desc: "Verified anti-detection and bypass algorithms protect developer accounts during uploads.",
    fCard2Title: "Bypass Verification",
    fCard2Desc: "Instantly bypass asset verification limits without complex ID validation.",
    fCard3Title: "24/7 Cloud Automation",
    fCard3Desc: "Bypassing operates entirely on our cloud. Initiate upload operations at any hour for instant results.",
    
    // Pricelist slide
    pTitle: "Explore Bernada Developer Tools",
    pSub: "Select the workspace tool that fits your game development needs. We offer flexible plans.",
    pSpooferDesc: "Unlimited bypass engine for creators",
    pAudioDesc: "Advanced bypass sound processor",
    pMixerDesc: "Advanced sound setlist mixer",
    pActive: "ACTIVE",
    pComingSoon: "COMING SOON",
    pLocked: "Locked Feature",
    pFreeDesc: "Forever free access to spoofer dashboard",
    pAudio30dDesc: "Bypass sound processor access for 30 Days",
    pAudioLifetimeDesc: "Lifetime bypass sound processor access",
    pMixer7dDesc: "Mixer console access for 7 Days",
    pMixer30dDesc: "Mixer console access for 30 Days",
    pMixerLifetimeDesc: "Lifetime mixer console access",
    pPeriod30d: "30 Days",
    pPeriod7d: "7 Days",
    pPeriodLifetime: "Lifetime",
    pLaunchSpoofer: "Launch Spoofer",
    pLaunchAudio: "Launch Audio",
    pLaunchMixer: "Launch Mixer",

    // Get Started Card
    gWelcome: "Welcome to BernadaStore",
    gWelcomeDesc: "Sign in or Register securely using Discord. Get immediate access to your spoofer dashboard, coins balance, and bypass logs.",
    gContinue: "Continue with Discord",
    gWelcomeBack: "Welcome Back!",
    gWelcomeBackDesc: "Hello, {username}. Your session is active. Go to your dashboard to use spoofer, coins, and monitor your upload history.",
    gGoDashboard: "Go to Dashboard"
  }
};

export default function LandingPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [mockActiveTab, setMockActiveTab] = useState('ugc');
  const [mockActiveIndicator, setMockActiveIndicator] = useState(0);
  const [audioPeriod, setAudioPeriod] = useState('30d'); // '30d' or 'lifetime'
  const [mixingPeriod, setMixingPeriod] = useState('30d'); // '7d', '30d', 'lifetime'
  const [activeTab, setActiveTab] = useState(null); // null, 'get-started', 'features', 'pricelist'
  const [authMode, setAuthMode] = useState('register'); // 'register' or 'login'

  const t = (key) => translations[language]?.[key] || key;

  const getWelcomeBackDesc = () => {
    return t('gWelcomeBackDesc').replace('{username}', user?.discordUsername || user?.username || 'User');
  };

  // Auto-switch carousel dots every 5s
  useEffect(() => {
    const intv = setInterval(() => {
      setMockActiveIndicator(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(intv);
  }, []);

  return (
    <div style={{
      height: '100vh',
      background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.05) 0%, rgba(255, 255, 255, 1) 70%), #ffffff',
      color: '#1e293b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      paddingTop: 80 // Add padding top to account for fixed navbar
    }}>
      {/* Main Hero Section */}
      <div style={{
        maxWidth: 1000,
        width: '100%',
        margin: '0 auto',
        padding: '20px 20px 0 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
        flexShrink: 0
      }}>

        {/* Huge Headline */}
        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: '#0f172a',
          margin: '0 0 8px 0',
          maxWidth: 820,
          background: 'linear-gradient(to right, #1e3a8a, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {t('heroTitle')}
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: '0.88rem',
          color: '#475569',
          lineHeight: 1.5,
          maxWidth: 720,
          margin: '0 0 12px 0'
        }}>
          {t('heroSub')}
        </p>

        {/* Tick list */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 16,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
            <span style={{ color: '#2563eb', fontWeight: 900 }}>✓</span> {t('tickNoVerification')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
            <span style={{ color: '#2563eb', fontWeight: 900 }}>✓</span> {t('tickSeconds')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
            <span style={{ color: '#2563eb', fontWeight: 900 }}>✓</span> {t('tickAutomated')}
          </div>
        </div>

        {/* Tab Buttons (Instead of Scroll down) */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('get-started')}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: activeTab === 'get-started' ? '#fff' : '#334155',
              background: activeTab === 'get-started' ? '#2563eb' : '#fff',
              border: activeTab === 'get-started' ? 'none' : '1px solid #cbd5e1',
              padding: '10px 22px',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: activeTab === 'get-started' ? '0 4px 20px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            className={activeTab === 'get-started' ? 'btn-hover-scale' : 'btn-hover-white'}
          >
            {t('tabStart')}
          </button>
          <button
            onClick={() => setActiveTab('features')}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: activeTab === 'features' ? '#fff' : '#334155',
              background: activeTab === 'features' ? '#2563eb' : '#fff',
              border: activeTab === 'features' ? 'none' : '1px solid #cbd5e1',
              padding: '10px 22px',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: activeTab === 'features' ? '0 4px 20px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            className={activeTab === 'features' ? 'btn-hover-scale' : 'btn-hover-white'}
          >
            {t('tabFeatures')}
          </button>
          <button
            onClick={() => setActiveTab('pricelist')}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: activeTab === 'pricelist' ? '#fff' : '#334155',
              background: activeTab === 'pricelist' ? '#2563eb' : '#fff',
              border: activeTab === 'pricelist' ? 'none' : '1px solid #cbd5e1',
              padding: '10px 22px',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: activeTab === 'pricelist' ? '0 4px 20px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            className={activeTab === 'pricelist' ? 'btn-hover-scale' : 'btn-hover-white'}
          >
            {t('tabPricelist')}
          </button>
        </div>

        {/* Tab Slides Content */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', paddingRight: 4 }}>
          {/* Slide Default: Mockup Preview (when visiting landing page) */}
          {activeTab === null && (
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 6,
              boxShadow: '0 20px 50px rgba(37, 99, 235, 0.08)',
              border: '1px solid #cbd5e1',
              position: 'relative',
              width: '100%',
              maxWidth: 900,
              marginBottom: 16
            }}>
              {/* Browser Window Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                borderBottom: '1px solid #cbd5e1',
                background: '#f1f5f9',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
                </div>
                <div style={{
                  background: '#e2e8f0',
                  borderRadius: 6,
                  padding: '2px 30px',
                  fontSize: '0.65rem',
                  color: '#475569',
                  fontFamily: 'monospace'
                }}>
                  dashboard.bernadastore.com/spoofer
                </div>
                <div style={{ width: 30 }}></div>
              </div>

              {/* Interactive Screen Preview: 3-Slide Auto Marketing Carousel */}
              <div style={{
                background: '#ffffff',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                position: 'relative',
                minHeight: 320,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch'
              }}>
                {/* Slide 0: BERNADA SPOOFER */}
                {mockActiveIndicator === 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    width: '100%',
                    animation: 'fadeIn 0.6s ease-in-out'
                  }}>
                    {/* Marketing Text Content */}
                    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em',
                        width: 'fit-content',
                        marginBottom: 12
                      }}>
                        {t('s0Badge')}
                      </span>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                        {t('s0Title')}
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                        {t('s0Desc')}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s0Check1')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s0Check2')}
                        </div>
                      </div>
                    </div>
                    {/* Visual Aspect: Centered Spoofer Web UI */}
                    <div style={{
                      position: 'relative',
                      background: '#090a0f',
                      borderRadius: '0 0 10px 0',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      height: '100%'
                    }}>
                      <img 
                        src="/spoofer_cyber_art.png" 
                        alt="UGC Cyber Spoofer" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  </div>
                )}

                {/* Slide 1: BERNADA AUDIO */}
                {mockActiveIndicator === 1 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    width: '100%',
                    animation: 'fadeIn 0.6s ease-in-out'
                  }}>
                    {/* Marketing Text Content */}
                    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em',
                        width: 'fit-content',
                        marginBottom: 10
                      }}>
                        {t('s1Badge')}
                      </span>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                        {t('s1Title')}
                      </h2>
                      <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                        {t('s1Desc')}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s1Check1')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s1Check2')}
                        </div>
                      </div>
                    </div>
                    {/* Visual Aspect: Centered Audio Image */}
                    <div style={{
                      position: 'relative',
                      background: '#090a0f',
                      borderRadius: '0 0 10px 0',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      height: '100%'
                    }}>
                      <img 
                        src="/audio_spectrum_neon.png" 
                        alt="Audio Spectrum Neon" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  </div>
                )}

                {/* Slide 2: BERNADA MIXER */}
                {mockActiveIndicator === 2 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    width: '100%',
                    animation: 'fadeIn 0.6s ease-in-out'
                  }}>
                    {/* Marketing Text Content */}
                    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em',
                        width: 'fit-content',
                        marginBottom: 10
                      }}>
                        {t('s2Badge')}
                      </span>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                        {t('s2Title')}
                      </h2>
                      <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                        {t('s2Desc')}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s2Check1')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#475569' }}>
                          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {t('s2Check2')}
                        </div>
                      </div>
                    </div>
                    {/* Visual Aspect: Centered Mixer Image */}
                    <div style={{
                      position: 'relative',
                      background: '#090a0f',
                      borderRadius: '0 0 10px 0',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      height: '100%'
                    }}>
                      <img 
                        src="/mixer_console_neon.png" 
                        alt="Mixer Console Neon" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Carousel Dots */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
                marginTop: 20,
                marginBottom: 10
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: mockActiveIndicator === 0 ? '#2563eb' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: mockActiveIndicator === 1 ? '#2563eb' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: mockActiveIndicator === 2 ? '#2563eb' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }}></span>
              </div>
            </div>
          )}

          {/* Slide 1: Get Started Now (Discord Login Only, Centered) */}
          {activeTab === 'get-started' && (
            <div style={{
              width: '100%',
              maxWidth: 500,
              marginBottom: 80,
              textAlign: 'left'
            }}>
              {user ? (
                /* Authenticated User Dashboard Redirection Card */
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 18,
                  padding: '40px 32px',
                  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  minHeight: 320,
                  animation: 'fadeIn 0.4s ease'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 16px auto' }}>
                      {user.discordAvatar ? (
                        <img 
                          src={user.discordAvatar} 
                          alt="Discord Avatar" 
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            border: '3px solid #2563eb',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: 'var(--accent-dim)',
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          fontWeight: 800
                        }}>
                          {(user.discordUsername || user.username)?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        background: '#22c55e',
                        border: '2px solid #fff',
                        borderRadius: '50%',
                        display: 'block'
                      }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                      {t('gWelcomeBack')}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {getWelcomeBackDesc()}
                    </p>
                  </div>

                  <Link href="/dashboard" style={{
                    width: '100%',
                    background: '#2563eb',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '16px 0',
                    borderRadius: 12,
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: '0 4px 18px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease'
                  }} className="btn-hover-scale">
                    {t('gGoDashboard')}
                  </Link>
                </div>
              ) : (
                /* Discord Auth Gateway Card */
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: '40px 32px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  minHeight: 320
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(88, 101, 242, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: '#5865F2',
                      margin: '0 auto 16px auto'
                    }}>
                      👾
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                      {t('gWelcome')}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {t('gWelcomeDesc')}
                    </p>
                  </div>

                  <a href="/api/auth/discord" style={{
                    width: '100%',
                    background: '#5865F2',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '16px 0',
                    borderRadius: 12,
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: '0 4px 18px rgba(88, 101, 242, 0.35)',
                    transition: 'all 0.2s ease'
                  }} className="btn-hover-scale">
                    {t('gContinue')}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Slide 2: View Features */}
          {activeTab === 'features' && (
            <div id="features" style={{
              width: '100%',
              maxWidth: 900,
              paddingTop: 10,
              textAlign: 'center',
              marginBottom: 80
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                margin: '0 0 10px 0',
                background: 'linear-gradient(to right, #1e3a8a, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {t('fTitle')}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                marginBottom: 48,
                maxWidth: 600,
                margin: '0 auto 48px auto'
              }}>
                {t('fSub')}
              </p>

              {/* Features Grid Matching Mockup Layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1.2fr',
                gap: 24,
                textAlign: 'left'
              }}>
                {/* Left Column: Two Stacked Cards */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24
                }}>
                  {/* Card 1: 100% Secure */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 18,
                    padding: '28px 24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      🛡️
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>100%</div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      {t('fCard1Title')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {t('fCard1Desc')}
                    </p>
                  </div>

                  {/* Card 2: 0 Limits */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 18,
                    padding: '28px 24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#22c55e',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      ☑
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22c55e', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>0 Limits</div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      {t('fCard2Title')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {t('fCard2Desc')}
                    </p>
                  </div>
                </div>

                {/* Right Column: Prominent Blue Highlight Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: 24,
                  padding: '40px 32px',
                  color: '#ffffff',
                  boxShadow: '0 12px 30px rgba(37, 99, 235, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 420
                }}>
                  <div>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      marginBottom: 20
                    }}>
                      🎮
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>3 Services</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, marginBottom: 16 }}>Integrated Tools</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.85, lineHeight: 1.6, marginBottom: 24 }}>
                      Access our complete developer suite: Bernada Spoofer (supporting UGC, Mesh, Animation, Audio, & Video with direct Auto-Upload to Roblox), Bernada Audio (advanced sound processing), and Bernada Mixer.
                    </div>
                  </div>

                  <Link href="/register" style={{
                    background: '#ffffff',
                    color: '#2563eb',
                    textAlign: 'center',
                    padding: '12px 0',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                    display: 'block'
                  }} className="btn-hover-white">
                    Launch Spoofer Engine
                  </Link>
                </div>
              </div>

              {/* Bottom Full-width Row: Clock/Auto card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 18,
                padding: '24px 28px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                textAlign: 'left'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(124, 58, 237, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7c3aed',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  🕒
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.01em', margin: 0 }}>24/7</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '2px 0 4px 0' }}>{t('fCard3Title')}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                    {t('fCard3Desc')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Pricelist */}
          {activeTab === 'pricelist' && (
            <div style={{ width: '100%', maxWidth: 1200, marginBottom: 80 }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                margin: '0 0 10px 0',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}>
                {t('pTitle')}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                marginBottom: 48,
                maxWidth: 600,
                margin: '0 auto 48px auto',
                textAlign: 'center'
              }}>
                {t('pSub')}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 24,
                textAlign: 'left',
                alignItems: 'stretch'
              }}>
                {/* Card 1: BERNADA SPOOFER */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid rgba(37, 99, 235, 0.15)',
                  borderRadius: 18,
                  padding: '32px 24px',
                  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.03)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 460
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#2563eb'
                      }}>
                        ⚡
                      </div>
                      <span style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em'
                      }}>
                        {t('pActive')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>BERNADA SPOOFER</h3>
                    <div style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: 16 }}>{t('pSpooferDesc')}</div>
                    
                    {/* Price Block */}
                    <div style={{ margin: '16px 0 24px 0' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        {t('pFreeDesc').split(' ')[0]} {/* FREE */}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>{t('pFreeDesc')}</div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Support UGC, Mesh, Anim, Audio & Video
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Direct Auto-Upload to Roblox Cloud
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> 99.6% Success Verification Rate
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Unlimited Bulk Processing
                      </li>
                    </ul>
                  </div>

                  <Link href={user ? "/dashboard" : "/api/auth/discord"} style={{
                    width: '100%',
                    background: '#2563eb',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '12px 0',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginTop: 24,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                    display: 'block'
                  }} className="btn-hover-scale">
                    {t('pLaunchSpoofer')}
                  </Link>
                </div>

                {/* Card 2: BERNADA AUDIO */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: '32px 24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 460
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#2563eb'
                      }}>
                        🔊
                      </div>
                      <span style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em'
                      }}>
                        {t('pActive')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>BERNADA AUDIO</h3>
                    <div style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: 16 }}>{t('pAudioDesc')}</div>
                    
                    {/* Dynamic Period Selector */}
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: 3, borderRadius: 8, marginBottom: 14 }}>
                      <button 
                        onClick={() => setAudioPeriod('30d')}
                        style={{
                          flex: 1,
                          background: audioPeriod === '30d' ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: audioPeriod === '30d' ? '#2563eb' : '#64748b',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {t('pPeriod30d')}
                      </button>
                      <button 
                        onClick={() => setAudioPeriod('lifetime')}
                        style={{
                          flex: 1,
                          background: audioPeriod === 'lifetime' ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: audioPeriod === 'lifetime' ? '#2563eb' : '#64748b',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {t('pPeriodLifetime')}
                      </button>
                    </div>

                    {/* Price Block */}
                    <div style={{ margin: '0 0 16px 0', minHeight: 62 }}>
                      {audioPeriod === '30d' ? (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>Rp 150.000</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            Rp 100.000<span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>/ {t('pPeriod30d')}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>Rp 500.000</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            Rp 400.000<span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>/ {t('pPeriodLifetime')}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Precision EQ & Haas Stereo Delay
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Multi-Speed Processing (0.5x - 4.0x)
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Automatic Long Track Slicing
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> Cloud Auto-Upload to Roblox
                      </li>
                    </ul>
                  </div>

                  <Link href={user ? "/dashboard/audio" : "/api/auth/discord"} style={{
                    width: '100%',
                    background: '#2563eb',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '12px 0',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginTop: 24,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                    display: 'block'
                  }} className="btn-hover-scale">
                    {t('pLaunchAudio')}
                  </Link>
                </div>

                {/* Card 3: BERNADA MIXER */}
                <div style={{
                  background: '#2563eb',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 18,
                  padding: '32px 24px',
                  boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 460,
                  color: '#fff'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#fff'
                      }}>
                        🎛️
                      </div>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 100,
                        letterSpacing: '0.05em'
                      }}>
                        {t('pActive')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>BERNADA MIXER</h3>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', marginBottom: 16 }}>{t('pMixerDesc')}</div>
                    
                    {/* Dynamic Period Selector */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', padding: 3, borderRadius: 8, marginBottom: 14 }}>
                      <button 
                        onClick={() => setMixingPeriod('7d')}
                        style={{
                          flex: 1,
                          background: mixingPeriod === '7d' ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: mixingPeriod === '7d' ? '#2563eb' : '#fff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {t('pPeriod7d')}
                      </button>
                      <button 
                        onClick={() => setMixingPeriod('30d')}
                        style={{
                          flex: 1,
                          background: mixingPeriod === '30d' ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: mixingPeriod === '30d' ? '#2563eb' : '#fff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {t('pPeriod30d')}
                      </button>
                      <button 
                        onClick={() => setMixingPeriod('lifetime')}
                        style={{
                          flex: 1,
                          background: mixingPeriod === 'lifetime' ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: mixingPeriod === 'lifetime' ? '#2563eb' : '#fff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {t('pPeriodLifetime')}
                      </button>
                    </div>

                    {/* Price Block */}
                    <div style={{ margin: '0 0 16px 0', minHeight: 62 }}>
                      {mixingPeriod === '7d' && (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'transparent' }}>Placeholder</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            Rp 80.000<span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>/ {t('pPeriod7d')}</span>
                          </div>
                        </div>
                      )}
                      {mixingPeriod === '30d' && (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'transparent' }}>Placeholder</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            Rp 150.000<span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>/ {t('pPeriod30d')}</span>
                          </div>
                        </div>
                      )}
                      {mixingPeriod === 'lifetime' && (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'transparent' }}>Placeholder</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            Rp 500.000<span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>/ {t('pPeriodLifetime')}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                      <li style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span> Web Audio API Stereo Routing & Faders
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span> Faster-than-Realtime Offline Render
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span> Pitch Locked Transitions & BPM Ramps
                      </li>
                      <li style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span> Cloud Auto-Upload to Roblox Cloud
                      </li>
                    </ul>
                  </div>

                  <Link href={user ? "/dashboard/mixing" : "/api/auth/discord"} style={{
                    width: '100%',
                    background: '#ffffff',
                    color: '#2563eb',
                    textAlign: 'center',
                    padding: '12px 0',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginTop: 24,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'block'
                  }} className="btn-hover-scale">
                    {t('pLaunchMixer')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <footer style={{
          borderTop: '1px solid #cbd5e1',
          background: '#f8fafc',
          width: '100%',
          padding: '12px 40px',
          zIndex: 5,
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0f172a' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: 20, height: 20, borderRadius: 4 }} />
              <span>BERNADA<span style={{ color: '#2563eb' }}>STORE</span></span>
              <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>|</span>
              <span style={{ fontWeight: 400, color: '#64748b', marginLeft: 6 }}>© 2026 Bernada Creator Network. All rights reserved.</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="https://discord.gg/x26ky9drYr" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Discord Support</a>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Styled JSX */}
      <style jsx>{`
        .btn-hover-scale {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.4) !important;
          background: #1d4ed8 !important;
        }
        .btn-hover-white {
          transition: all 0.2s ease;
        }
        .btn-hover-white:hover {
          transform: translateY(-2px);
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
