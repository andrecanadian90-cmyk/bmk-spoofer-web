'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  id: {
    dashboard: 'Dashboard',
    robloxAccount: 'Akun Roblox',
    topUp: 'Main Top Up',
    logs: 'Riwayat Log',
    spoofer: 'BERNADA Spoofer',
    audio: 'BERNADA Audio',
    mixing: 'BERNADA Mixing',
    overview: 'Ikhtisar',
    manageUsers: 'Kelola Pengguna',
    mainSection: 'Utama',
    toolsSection: 'Fitur',
    adminSection: 'Admin'
  },
  en: {
    dashboard: 'Dashboard',
    robloxAccount: 'Roblox Account',
    topUp: 'Top Up',
    logs: 'Logs History',
    spoofer: 'BERNADA Spoofer',
    audio: 'BERNADA Audio',
    mixing: 'BERNADA Mixing',
    overview: 'Overview',
    manageUsers: 'Manage Users',
    mainSection: 'Main',
    toolsSection: 'Tools',
    adminSection: 'Admin'
  }
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();

  const t = (key) => translations[language]?.[key] || translations['id'][key];

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: '📊' },
    { href: '/dashboard/account', label: t('robloxAccount'), icon: '👤' },
    { href: '/dashboard/topup', label: t('topUp'), icon: '🪙' },
    { href: '/dashboard/logs', label: t('logs'), icon: '📋' },
  ];

  const toolItems = [
    { href: '/dashboard/spoofer', label: t('spoofer'), icon: '⚡' },
    { href: '/dashboard/audio', label: t('audio'), icon: '🎵' },
    { href: '/dashboard/mixing', label: t('mixing'), icon: '🎛️' },
  ];

  const adminItems = [
    { href: '/admin', label: t('overview'), icon: '📈' },
    { href: '/admin/users', label: t('manageUsers'), icon: '👥' },
  ];

  return (
    <div className="dash-sidebar">
      <div className="sidebar-section">{t('mainSection')}</div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="sidebar-divider" style={{ margin: '16px 0 12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} />
        <div className="sidebar-section">{t('toolsSection')}</div>
        {toolItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">{t('adminSection')}</div>
            {adminItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );
}
