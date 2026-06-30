'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/Toast';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('bmk_token', token);
      showToast('Logged in with Discord successfully!', 'success');
      window.location.href = '/dashboard';
    } else {
      showToast('Authentication failed', 'error');
      router.push('/login');
    }
  }, [router, searchParams, showToast]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#070708', 
      color: '#fff', 
      flexDirection: 'column', 
      gap: 16 
    }}>
      <div className="spinner spinner-lg"></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completing Discord authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#070708', 
        color: '#fff', 
        flexDirection: 'column', 
        gap: 16 
      }}>
        <div className="spinner spinner-lg"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
