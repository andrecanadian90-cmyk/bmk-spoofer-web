'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner-lg"></div></div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Admin Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Users</div>
          <div className="stat-card-value">{stats?.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Spoofs</div>
          <div className="stat-card-value green">{stats?.totalSpoofs || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Success Rate</div>
          <div className="stat-card-value green">{stats?.successRate || 0}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Coins Distributed</div>
          <div className="stat-card-value gold">{stats?.totalCoinsDistributed || 0}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {stats?.recentActivity?.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>No activity yet</div>
          ) : stats?.recentActivity?.map((log, i) => (
            <div key={log._id || i} className="log-entry">
              <span className="log-ts">{new Date(log.createdAt).toLocaleString()}</span>
              <span className={`log-badge-s ${log.status}`}>{log.status.toUpperCase()}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)' }}>{log.userId?.username || 'unknown'}</span>
              <span className="log-msg">&quot;{log.assetName}&quot; → {log.originalAssetId}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
