'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '10px 0' : '16px 0',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.8)',
      borderBottom: `1px solid ${scrolled ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-primary)' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="url(#lg)" strokeWidth="2" fill="none"/>
            <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="url(#lg)"/>
            <defs><linearGradient id="lg" x1="2" y1="2" x2="26" y2="26"><stop stopColor="#39FF14"/><stop offset="1" stopColor="#00E5FF"/></linearGradient></defs>
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>BMK<span style={{ color: 'var(--accent)' }}>Spoofer</span></span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>● {user.coins} COINS</span>
              <Link href="/dashboard" className="btn btn-sm" style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn btn-sm" style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'rgba(191,90,242,0.15)', color: 'var(--purple)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Admin</Link>
              )}
              <button onClick={logout} style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>Logout</button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)' }}>
                <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
                STATUS: ONLINE
              </div>
              <Link href="/login" style={{ padding: '8px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>Get Access</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
