'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export default function DashboardPage() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [assetInput, setAssetInput] = useState('');
  const [spoofing, setSpoofing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimerState] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    return () => { if (timer) clearInterval(timer); };
  }, [timer]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs?limit=20', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs);
        const s = data.data.logs.filter(l => l.status === 'success').length;
        const f = data.data.logs.filter(l => l.status === 'failed').length;
        setStats({ total: data.data.pagination.total, successful: s, failed: f });
      }
    } catch {}
  };

  const startSpoof = async () => {
    if (!assetInput.trim()) { showToast('Enter asset IDs first', 'error'); return; }
    if (!user.robloxId) { showToast('Link your Roblox account first', 'error'); return; }

    setSpoofing(true);
    setStatus('Spoofing...');
    setProgress(10);
    setElapsed(0);

    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    setTimerState(t);

    try {
      setProgress(30);
      const res = await fetch('/api/roblox/spoof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assets: assetInput }),
      });

      setProgress(80);
      const data = await res.json();

      if (data.success) {
        setProgress(100);
        setStatus('Spoofing Completed');
        setStats({ total: data.data.total, successful: data.data.successful, failed: data.data.failed });

        const newLogs = data.data.logs.map((l, i) => ({
          _id: Date.now() + i,
          assetName: l.assetName,
          originalAssetId: l.originalId,
          newAssetId: l.newId,
          status: l.status,
          fileSize: l.fileSize || 0,
          duration: l.duration,
          error: l.error,
          createdAt: new Date().toISOString(),
        }));
        setLogs(newLogs);
        showToast(`Spoofed ${data.data.successful}/${data.data.total} assets`, 'success');
        refreshUser();
      } else {
        setStatus('Failed');
        showToast(data.error, 'error');
      }
    } catch (err) {
      setStatus('Error');
      showToast(err.message, 'error');
    } finally {
      clearInterval(t);
      setTimerState(null);
      setSpoofing(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div>
      {/* Account Info */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#000' }}>
          {user?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.robloxUsername || user?.username}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user?.robloxId ? `Roblox ID: ${user.robloxId}` : '⚠️ Roblox account not linked'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)' }}>● {user?.coins || 0} Coins</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Spoofed</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Successful</div>
          <div className="stat-card-value green">{stats.successful}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Failed</div>
          <div className="stat-card-value red">{stats.failed}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Bulk Spoof */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Bulk Spoof</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>Input assets LUA table or raw IDs to start bypass spoofer.</p>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Assets Input List</div>
          <textarea
            className="textarea"
            placeholder={'{ "Jojo Pose", 11564428254632 },\n{ "Clean Kicks", 12820096568127 },\n\nor raw IDs:\n11564428254632\n12820096568127'}
            value={assetInput}
            onChange={e => setAssetInput(e.target.value)}
            style={{ marginBottom: 12, minHeight: 160 }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--accent)' }}>☑</span> Auto-Upload to Roblox Open Cloud
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: 14 }} onClick={startSpoof} disabled={spoofing}>
            {spoofing ? <><span className="spinner"></span> Spoofing...</> : '⚡ Start Bypass'}
          </button>
        </div>

        {/* Execution Logs */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Execution Logs</h3>
            <span className="badge badge-success">{logs.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 340, overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No logs yet. Start a spoof to see results.</div>
            ) : logs.map((log, i) => (
              <div key={log._id || i} className="log-entry">
                <span className="log-ts">{new Date(log.createdAt).toLocaleTimeString()}</span>
                <span className={`log-badge-s ${log.status}`}>{log.status.toUpperCase()}</span>
                <span className="log-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 160px)' }}>
                  &quot;{log.assetName}&quot; → {log.status === 'success' ? (
                    <>
                      {log.buffer ? (
                        <button
                          onClick={() => {
                            const byteCharacters = atob(log.buffer);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: 'application/octet-stream' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `animation_${log.originalAssetId}.rbxm`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: 600,
                            padding: 0,
                            font: 'inherit',
                          }}
                        >
                          ⬇ Download
                        </button>
                      ) : log.newAssetId ? (
                        <a 
                          href={log.newAssetId.startsWith('pending') ? '#' : `https://create.roblox.com/dashboard/creations/assets/${log.newAssetId}`} 
                          target={log.newAssetId.startsWith('pending') ? '_self' : '_blank'} 
                          rel="noreferrer" 
                          style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}
                          onClick={e => log.newAssetId.startsWith('pending') && e.preventDefault()}
                        >
                          {log.newAssetId.startsWith('pending') ? 'Processing' : `ID: ${log.newAssetId}`}
                        </a>
                      ) : 'Uploaded'} ({formatSize(log.fileSize)})
                    </>
                  ) : (
                    <span style={{ color: 'var(--fail)' }} title={log.error}>{log.error || 'Failed'}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Spoofing Status */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Spoofing Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifycontent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● Status</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: status === 'Spoofing Completed' ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{status}</span>
            </div>
            <div style={{ display: 'flex', justifycontent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● Time Elapsed</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{formatTime(elapsed)}</span>
            </div>
            <div style={{ display: 'flex', justifycontent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● Progress</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{progress}%</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <div style={{ display: 'flex', justifycontent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>● Spoofed Items</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{stats.successful}/{stats.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Deployment Summary */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Deployment Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Attempts</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stats.total}</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Success Rate</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Successful</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{stats.successful}</div></div>
            <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Failed</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--fail)' }}>{stats.failed}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
