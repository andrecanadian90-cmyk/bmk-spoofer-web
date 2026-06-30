'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function MixingPage() {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(136);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const next = prev + change;
        return next > 200 ? 200 : next < 80 ? 80 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* Desktop App Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginTop: 24 }}>
        {/* Hero Banner Card */}
        <div className="card" style={{
          padding: '40px 30px',
          borderRadius: 20,
          border: '1px solid rgba(37, 99, 235, 0.15)',
          background: 'var(--bg-card-solid)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Glowing background accent */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', marginBottom: 16, display: 'block', filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.2))' }}>🎛️</span>
            
            <div style={{ 
              background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 100,
              marginBottom: 16,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)'
            }}>
              🚧 Under Development / Coming Soon
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
              BERNADA Mixing PC App (.EXE)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 620, margin: '0 auto 30px', lineHeight: 1.6 }}>
              Aplikasi studio mixing audio desktop otomatis yang dirancang khusus untuk memotong, menyelaraskan tempo, menyusun setlist musik unik, dan mengekspor file audio Roblox Anda dengan kualitas studio terbaik!
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
              <button 
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 32px',
                  borderRadius: 12,
                  background: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  border: 'none',
                  letterSpacing: '0.05em',
                  cursor: 'not-allowed',
                  opacity: 0.6
                }}
              >
                📥 Coming Soon (.exe)
              </button>

              <a 
                href="https://discord.gg/x26ky9drYr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  borderRadius: 12,
                  background: 'rgba(114, 137, 218, 0.1)',
                  color: '#7289da',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  border: '1px solid rgba(114, 137, 218, 0.25)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                className="ticket-btn-hover"
              >
                💬 Open Ticket (Pre-order / Join Discord)
              </a>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-update sistem aktif setelah aplikasi dirilis resmi</span>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Left Column: Key Features */}
          <div className="card" style={{
            padding: 28,
            borderRadius: 20,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card-solid)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⭐ Fitur Utama Aplikasi Mixing
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Setlist Lagu Kustom & Unik', desc: 'Susun daftar lagu pilihan Anda sendiri agar trek yang diputar di map Roblox Anda sepenuhnya unik dan berbeda dari map milik developer lain.' },
                { title: 'Auto-Mixing Cerdas', desc: 'Lakukan mixing transisi musik secara otomatis untuk hasil transisi lagu yang halus, bersih, dan bebas jeda sunyi.' },
                { title: 'Autocut Audio Cepat', desc: 'Pemotongan lagu otomatis yang cerdas — sistem akan menganalisis ketukan (BPM) dan tempo secara mandiri untuk hasil potongan yang presisi.' },
                { title: 'Fitur Harmony Terintegrasi', desc: 'Mengharmoniskan vokal dan trek instrumen untuk menciptakan efek suara bernada tinggi (high fidelity) yang memukau.' },
                { title: 'Ekspor MP3 & OGG Kualitas Studio', desc: 'Simpan file audio campuran Anda langsung ke format .ogg atau .mp3 dengan kualitas kompresi audio premium tanpa noise.' },
                { title: 'Dukungan Auto Update', desc: 'Aplikasi desktop Anda akan diperbarui secara otomatis setiap kali tim merilis perbaikan fitur dan optimalisasi mesin mixing.' }
              ].map((feat, index) => (
                <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.1rem' }}>✓</span>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing & Licenses */}
          <div className="card" style={{
            padding: 28,
            borderRadius: 20,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card-solid)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                💳 Paket Lisensi Premium (Pre-order)
              </h3>

              {/* 7 Days License Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(37, 99, 235, 0.08) 100%)',
                border: '1px solid rgba(37, 99, 235, 0.15)',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Mingguan (7 Hari)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>Rp 80.000</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ 7 Hari</span>
                </div>
              </div>

              {/* Monthly License Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Bulanan (30 Hari)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>Rp 150.000</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ 30 Hari</span>
                </div>
              </div>

              {/* Lifetime License Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 14,
                padding: 16,
                marginBottom: 16
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Permanen (Lifetime)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706' }}>Rp 500.000</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ Sekali Bayar</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              padding: 16,
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                Pemesanan pre-order lisensi aplikasi mixing desktop ini diproses eksklusif melalui pembuatan tiket di Discord.
              </p>
              <a 
                href="https://discord.gg/x26ky9drYr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: '#7289da',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(114, 137, 218, 0.2)',
                  transition: 'all 0.25s ease'
                }}
                className="ticket-btn-hover"
              >
                🎟️ Buka Tiket Pre-order
              </a>
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
    </div>
  );
}
