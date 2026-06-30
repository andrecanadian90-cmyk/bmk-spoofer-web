'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const err = new URLSearchParams(window.location.search).get('error');
      if (err) {
        setError(decodeURIComponent(err));
        showToast(decodeURIComponent(err), 'error');
      }
    }
  }, [showToast]);

  return (
    <div className="auth-page" style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ 
        width: '100%', 
        maxWidth: 400, 
        padding: 40, 
        borderRadius: 24, 
        border: '1px solid var(--border)',
        background: 'var(--bg-card-solid)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.04)',
        textAlign: 'center'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 12, 
              border: '1px solid rgba(37, 99, 235, 0.25)', 
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.15)',
              marginBottom: 16 
            }} 
          />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            BERNADA<span style={{ color: 'var(--accent)' }}>STORE</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Authenticate with Discord to launch your active workspaces.
          </p>
        </div>

        {error && (
          <div className="auth-error" style={{ fontSize: '0.8rem', padding: '10px 14px', marginBottom: 20, textAlign: 'left' }}>
            {error}
          </div>
        )}

        {/* Discord Login CTA */}
        <button 
          type="button" 
          onClick={() => window.location.href = '/api/auth/discord'}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 12,
            padding: '14px 20px',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="card-btn-hover"
        >
          <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c.87-.64,1.72-1.32,2.53-2a75.76,75.76,0,0,0,72.82,0c.81.71,1.66,1.39,2.53,2a68.43,68.43,0,0,1-10.45,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129.87,50.36,124,27.56,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
          </svg>
          <span>Continue with Discord</span>
        </button>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 24, lineHeight: 1.5 }}>
          By continuing, you link your Discord account for authentication. No credentials or passwords are saved.
        </p>
      </div>
      
      {/* Global hover rule */}
      <style jsx>{`
        :global(.card-btn-hover:hover) {
          background: #1d4ed8 !important;
          box-shadow: 0 6px 24px rgba(37, 99, 235, 0.45) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
