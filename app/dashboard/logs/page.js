'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?page=${page}&limit=30`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setLogs(data.data.logs); setPagination(data.data.pagination); }
    } catch {}
  };

  const filtered = search ? logs.filter(l => l.assetName?.toLowerCase().includes(search.toLowerCase()) || l.originalAssetId?.includes(search)) : logs;

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Execution Logs</h2>
      <div style={{ marginBottom: 16 }}>
        <input className="input" placeholder="🔍 Search by asset name or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No logs found</div>
          ) : filtered.map((log, i) => (
            <div key={log._id || i} className="log-entry">
              <span className="log-ts">{new Date(log.createdAt).toLocaleString()}</span>
              <span className={`log-badge-s ${log.status}`}>{log.status.toUpperCase()}</span>
              <span className="log-msg">&quot;{log.assetName}&quot; → {log.originalAssetId} {log.newAssetId ? `→ ${log.newAssetId}` : ''}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.duration ? `${log.duration}ms` : ''}</span>
            </div>
          ))}
        </div>
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span style={{ padding: '6px 14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{page} / {pagination.pages}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
