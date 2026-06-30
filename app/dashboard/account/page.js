'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  id: {
    title: 'Akun Roblox',
    linkRequiredToast: 'Semua kolom (Roblox ID, Cloud API Key, dan Roblox Cookie) wajib diisi.',
    linkSuccessToast: 'Kredensial Roblox berhasil dihubungkan',
    updateCreds: 'Perbarui Kredensial',
    linkCreds: 'Hubungkan Kredensial',
    robloxUserId: 'Roblox User ID',
    openCloudApiKey: 'Open Cloud API Key',
    getKeyFrom: 'Dapatkan key dari',
    robloxCookieLabel: 'Roblox Session Cookie (.ROBLOSECURITY)',
    copyCookieVal: 'Salin value dari cookie bernama .ROBLOSECURITY pada browser yang sedang login akun Roblox Anda.',
    tutorialTitle: 'Panduan Menghubungkan Akun',
    step1Title: 'Dapatkan Roblox User ID',
    step1Desc: 'Buka profil Roblox Anda di browser. Cari link URL di bagian atas, contoh: roblox.com/users/10178074818/profile. Salin barisan angka tebal tersebut sebagai User ID Anda.',
    step2Title: 'Buat Open Cloud API Key',
    step2Desc: 'Masuk ke Roblox Credentials. Buat API Key baru dengan hak akses/permissions: Assets (Write dan Read). Pada bagian Keamanan, pastikan opsi "Batasi alamat IP" tetap OFF agar server spoofer diizinkan melakukan request upload.',
    step3Title: 'Salin Cookie .ROBLOSECURITY',
    step3Desc: 'Pada tab roblox.com, buka Developer Tools (tekan F12), lalu ke bagian Application > Cookies > roblox.com. Cari cookie bernama .ROBLOSECURITY, salin seluruh isi teks value-nya (yang diawali dengan _|WARNING:-DO-NOT-SHARE-...).',
    cookieLinked: 'Cookie Terhubung',
    cookieNotLinked: 'Tanpa Cookie (Hanya Publik)',
    active: 'Aktif',
  },
  en: {
    title: 'Roblox Account',
    linkRequiredToast: 'All fields (Roblox ID, Cloud API Key, and Roblox Cookie) are required.',
    linkSuccessToast: 'Roblox credentials linked successfully',
    updateCreds: 'Update Credentials',
    linkCreds: 'Link Credentials',
    robloxUserId: 'Roblox User ID',
    openCloudApiKey: 'Open Cloud API Key',
    getKeyFrom: 'Get key from',
    robloxCookieLabel: 'Roblox Session Cookie (.ROBLOSECURITY)',
    copyCookieVal: 'Copy the value of the cookie named .ROBLOSECURITY from the browser where your Roblox account is logged in.',
    tutorialTitle: 'Account Linking Guide',
    step1Title: 'Get Roblox User ID',
    step1Desc: 'Go to your Roblox profile in a browser. Find the URL at the top, e.g. roblox.com/users/10178074818/profile. Copy that sequence of numbers as your User ID.',
    step2Title: 'Create Open Cloud API Key',
    step2Desc: 'Go to Roblox Credentials. Create a new API Key with permissions: Assets (Write and Read). Under Security, make sure "Restrict IP address" is OFF so that the spoofer server is allowed to upload.',
    step3Title: 'Copy .ROBLOSECURITY Cookie',
    step3Desc: 'On roblox.com tab, open Developer Tools (press F12), go to Application > Cookies > roblox.com. Find the cookie named .ROBLOSECURITY and copy its entire text value (starting with _|WARNING:-DO-NOT-SHARE-...).',
    cookieLinked: 'Cookie Linked',
    cookieNotLinked: 'No Cookie (Public Only)',
    active: 'Active',
  }
};

export default function AccountPage() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [robloxId, setRobloxId] = useState(user?.robloxId || '');
  const [apiKey, setApiKey] = useState('');
  const [robloxCookie, setRobloxCookie] = useState('');
  const [linking, setLinking] = useState(false);

  const t = (key) => translations[language]?.[key] || translations['id'][key];

  const isFormInvalid = !robloxId.trim() || !apiKey.trim() || !robloxCookie.trim();

  const linkAccount = async () => {
    if (isFormInvalid) {
      showToast(t('linkRequiredToast'), 'error');
      return;
    }

    setLinking(true);
    try {
      const res = await fetch('/api/roblox/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ robloxId, apiKey, robloxCookie }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      showToast(t('linkSuccessToast'), 'success');
      setApiKey('');
      setRobloxCookie('');
      refreshUser();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLinking(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>{t('title')}</h2>

      {user?.robloxId && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(57,255,20,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
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
                <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.2rem' }}>
                  {user.robloxUsername?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user.robloxUsername}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user.robloxId}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {user.robloxCookie ? (
                <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{t('cookieLinked')}</span>
              ) : (
                <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>{t('cookieNotLinked')}</span>
              )}
              <span className="badge badge-success">{t('active')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>
          {user?.robloxId ? t('updateCreds') : t('linkCreds')}
        </h3>
        
        <div className="form-group">
          <label className="form-label">{t('robloxUserId')}</label>
          <input 
            type="text" 
            className="input input-mono" 
            placeholder="10178074818" 
            value={robloxId} 
            onChange={e => setRobloxId(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('openCloudApiKey')}</label>
          <input 
            type="password" 
            className="input input-mono" 
            placeholder="your-api-key-here" 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)} 
          />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {t('getKeyFrom')} <a href="https://create.roblox.com/dashboard/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>create.roblox.com/dashboard/credentials</a> (Permissions: Assets write/read).
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('robloxCookieLabel')}</label>
          <input 
            type="password" 
            className="input input-mono" 
            placeholder="_|WARNING:-DO-NOT-SHARE-THIS.-Sharing-this-will-allow-someone-to-log-in..." 
            value={robloxCookie} 
            onChange={e => setRobloxCookie(e.target.value)} 
          />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {t('copyCookieVal')}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={linkAccount} 
          disabled={linking || isFormInvalid} 
          style={{ 
            width: '100%',
            opacity: isFormInvalid ? 0.5 : 1,
            cursor: isFormInvalid ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {linking ? <span className="spinner"></span> : user?.robloxId ? t('updateCreds') : t('linkCreds')}
        </button>
      </div>

      {/* Step by Step Tutorial Grid */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>{t('tutorialTitle')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          
          {/* Step 1: Roblox ID */}
          <div className="card" style={{ padding: 20, background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'var(--accent)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{t('step1Title')}</h4>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('step1Desc')}
            </p>
          </div>

          {/* Step 2: Open Cloud API Key */}
          <div className="card" style={{ padding: 20, background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'var(--accent)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{t('step2Title')}</h4>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('step2Desc')}
            </p>
          </div>

          {/* Step 3: Roblox Cookie */}
          <div className="card" style={{ padding: 20, background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'var(--accent)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{t('step3Title')}</h4>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('step3Desc')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
