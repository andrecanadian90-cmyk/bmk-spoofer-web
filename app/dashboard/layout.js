'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner spinner-lg"></div>
    </div>
  );

  if (!user) return null;

  if (user.banned) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '2rem' }}>🚫</div>
      <h2 style={{ color: 'var(--fail)' }}>Account Banned</h2>
      <p style={{ color: 'var(--text-muted)' }}>Your account has been suspended. Contact support.</p>
    </div>
  );

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-main">{children}</main>
    </div>
  );
}
