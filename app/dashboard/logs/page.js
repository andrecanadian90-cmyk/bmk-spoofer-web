'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  id: {
    title: 'Log Eksekusi',
    searchPlaceholder: '🔍 Cari berdasarkan nama aset atau ID...',
    noLogs: 'Belum ada log ditemukan',
    noAssetIdToast: 'ID Aset tidak valid untuk diunduh',
    downloadingToast: 'Mengunduh aset dari Roblox...',
    downloadSuccess: 'Aset berhasil diunduh!',
    downloadFailed: 'Gagal mengunduh aset. Pastikan akun Roblox Anda terhubung.',
    downloadBtn: 'Unduh',
    loading: 'Memuat...',
  },
  en: {
    title: 'Execution Logs',
    searchPlaceholder: '🔍 Search by asset name or ID...',
    noLogs: 'No logs found',
    noAssetIdToast: 'No valid asset ID found for download',
    downloadingToast: 'Downloading bypassed asset from Roblox...',
    downloadSuccess: 'Asset downloaded successfully!',
    downloadFailed: 'Failed to download asset file. Ensure your Roblox account is linked.',
    downloadBtn: 'Download',
    loading: 'Loading...',
  }
};

export default function LogsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const t = (key) => translations[language]?.[key] || translations['id'][key];

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?page=${page}&limit=30`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setLogs(data.data.logs); setPagination(data.data.pagination); }
    } catch {}
  };

  const handleDownload = async (log) => {
    const assetId = log.newAssetId || log.originalAssetId;
    if (!assetId) {
      showToast(t('noAssetIdToast'), 'error');
      return;
    }
    setDownloadingId(log._id);
    try {
      showToast(t('downloadingToast'), 'info');
      const res = await fetch(`/api/roblox/download?assetId=${assetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Determine file extension
      const isAudio = log.assetName?.toLowerCase().includes('audio') || log.originalAssetId?.startsWith('audio');
      const isMesh = log.assetName?.toLowerCase().includes('mesh') || log.assetName?.toLowerCase().includes('ugc');
      const ext = isAudio ? 'mp3' : (isMesh ? 'fbx' : 'rbxm');
      a.download = `${log.assetName || 'bypassed_asset'}.${ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast(t('downloadSuccess'), 'success');
    } catch (err) {
      showToast(t('downloadFailed'), 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = search ? logs.filter(l => l.assetName?.toLowerCase().includes(search.toLowerCase()) || l.originalAssetId?.includes(search)) : logs;

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>{t('title')}</h2>
      <div style={{ marginBottom: 16 }}>
        <input className="input" placeholder={t('searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>{t('noLogs')}</div>
          ) : filtered.map((log, i) => (
            <div key={log._id || i} className="log-entry" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px' }}>
              <span className="log-ts">{new Date(log.createdAt).toLocaleString()}</span>
              <span className={`log-badge-s ${log.status}`}>{log.status.toUpperCase()}</span>
              <span className="log-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
                {log.originalLine && log.originalLine.includes(log.originalAssetId) ? (
                  (() => {
                    const parts = log.originalLine.split(log.originalAssetId);
                    return (
                      <>
                        {parts[0]}
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{log.newAssetId || log.originalAssetId}</span>
                        {parts[1]}
                      </>
                    );
                  })()
                ) : (
                  `"${log.assetName}" → ${log.originalAssetId}${log.newAssetId ? ` → ${log.newAssetId}` : ''}`
                )}
              </span>
              
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.duration ? `${log.duration}ms` : ''}</span>
                {log.status === 'success' && (
                  <button
                    onClick={() => handleDownload(log)}
                    disabled={downloadingId === log._id}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {downloadingId === log._id ? '⏳ ...' : `📥 ${t('downloadBtn')}`}
                  </button>
                )}
              </div>
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
