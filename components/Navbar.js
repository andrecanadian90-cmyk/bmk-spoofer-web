'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  return (
    <>
      {/* Fixed Announcement Marquee Banner */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
        height: 26, background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)',
        color: '#ffffff', display: 'flex', alignItems: 'center', overflow: 'hidden',
        fontSize: '0.72rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          whiteSpace: 'nowrap', display: 'inline-block',
          animation: 'marquee 30s linear infinite', paddingLeft: '100%'
        }}>
          {language === 'id' ? (
            '🎉 Spesial Rilis Perdana BERNADA STORE! Nikmati bonus koin gratis khusus hari ini — silakan buka tiket bantuan dan hubungi Admin sekarang juga untuk klaim koin Anda! 💎'
          ) : (
            '🎉 BERNADA STORE Grand Opening Special! Enjoy your free coin bonus today — simply open a support ticket and contact Admin now to claim your coins! 💎'
          )}
        </div>
      </div>

      <nav style={{
        position: 'fixed', top: 26, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '10px 0' : '16px 0',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)',
        borderBottom: `1px solid ${scrolled ? 'rgba(37, 99, 235, 0.15)' : 'rgba(0, 0, 0, 0.05)'}`,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      <div style={{ width: '100%', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--text-primary)' }}>
          <img 
            src="/logo.jpg" 
            alt="BND Logo" 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 6, 
              objectFit: 'cover',
              boxShadow: '0 0 10px rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.15)'
            }} 
          />
          <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            BERNADA<span style={{ color: 'var(--accent)' }}>STORE</span>
          </span>
        </Link>
 
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* 3D Animated Free Coin Button */}
          <a 
            href="https://discord.gg/x26ky9drYr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-3d-gold"
          >
            🎁 <span>{language === 'id' ? 'Koin Gratis' : 'Free Coin'}</span>
          </a>

          {/* Language Toggle Button */}
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: scrolled ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 100,
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            className="language-selector-trigger"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img 
                src={language === 'id' ? 'https://flagcdn.com/w40/id.png' : 'https://flagcdn.com/w40/gb.png'} 
                alt={language === 'id' ? 'ID Flag' : 'EN Flag'} 
                style={{ width: 18, height: 12, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }} 
              />
              <span>{language === 'id' ? 'ID' : 'EN'}</span>
            </div>
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 12,
                  outline: 'none',
                  transition: 'background 0.2s'
                }}
                className="navbar-profile-trigger"
              >
                {user.discordAvatar ? (
                  <img 
                    src={user.discordAvatar} 
                    alt="Discord Avatar" 
                    style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      border: '2px solid var(--accent)',
                      boxShadow: '0 0 10px rgba(37, 99, 235, 0.15)'
                    }} 
                  />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    {(user.discordUsername || user.username)?.[0]?.toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {user.discordUsername || user.username}
                  <span style={{ fontSize: '0.55rem', color: '#64748b', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  width: 180,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  zIndex: 2000,
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <Link href="/dashboard" style={{
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }} className="dropdown-item">
                    📊 Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" style={{
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#334155',
                      textDecoration: 'none',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }} className="dropdown-item">
                      📈 Admin Panel
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <button 
                    onClick={logout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    className="dropdown-item logout"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="btn btn-primary" 
              style={{ 
                padding: '8px 24px', 
                fontSize: '0.82rem', 
                background: 'var(--accent)', 
                color: '#fff', 
                borderRadius: 8, 
                textDecoration: 'none', 
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .btn-3d-gold {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #ffffff !important;
          background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none !important;
          box-shadow: 0 4px 0 #b45309, 0 8px 16px rgba(217, 119, 6, 0.2);
          transition: all 0.1s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: gold-pulse 2s infinite ease-in-out;
        }
        .btn-3d-gold:hover {
          transform: translateY(1px);
          box-shadow: 0 3px 0 #b45309, 0 6px 12px rgba(217, 119, 6, 0.25);
          background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%);
        }
        .btn-3d-gold:active {
          transform: translateY(4px);
          box-shadow: 0 0px 0 #b45309, 0 2px 4px rgba(217, 119, 6, 0.15);
        }
        /* Shine effect */
        .btn-3d-gold::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 30%;
          height: 200%;
          background: rgba(255, 255, 255, 0.4);
          transform: rotate(30deg);
          transition: none;
          animation: shine 3s infinite ease-in-out;
        }
        @keyframes shine {
          0% { left: -60%; }
          15% { left: 130%; }
          100% { left: 130%; }
        }
        @keyframes gold-pulse {
          0% { box-shadow: 0 4px 0 #b45309, 0 8px 16px rgba(217, 119, 6, 0.3); }
          50% { box-shadow: 0 4px 0 #b45309, 0 12px 24px rgba(217, 119, 6, 0.5), 0 0 0 6px rgba(251, 191, 36, 0.15); }
          100% { box-shadow: 0 4px 0 #b45309, 0 8px 16px rgba(217, 119, 6, 0.3); }
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background: #f1f5f9;
        }
        .dropdown-item.logout:hover {
          background: #fef2f2;
        }
        .navbar-profile-trigger:hover {
          background: rgba(0, 0, 0, 0.03);
        }
        .language-selector-trigger:hover {
          background: rgba(37, 99, 235, 0.08) !important;
          border-color: rgba(37, 99, 235, 0.2) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
    </>
  );
}
