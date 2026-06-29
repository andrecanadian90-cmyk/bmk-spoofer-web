'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/account', label: 'Roblox Account', icon: '👤' },
  { href: '/dashboard/topup', label: 'Top Up', icon: '🪙' },
  { href: '/dashboard/logs', label: 'Logs', icon: '📋' },
];

const adminItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/users', label: 'Manage Users', icon: '👥' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="dash-sidebar">
      <div style={{ marginBottom: 24 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
          BMK<span style={{ color: 'var(--accent)' }}>Spoofer</span>
        </Link>
      </div>

      <div className="sidebar-section">Main</div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">Admin</div>
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

      <div className="sidebar-coins">
        <div className="sidebar-coins-val">{user?.coins || 0}</div>
        <div className="sidebar-coins-lbl">COINS AVAILABLE</div>
      </div>
    </div>
  );
}
