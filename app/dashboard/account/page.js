'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export default function AccountPage() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [robloxId, setRobloxId] = useState(user?.robloxId || '');
  const [apiKey, setApiKey] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);

  const verifyUser = async () => {
    if (!robloxId) return;
    setLoading(true);
    try {
      const res = await fetch(`https://users.roblox.com/v1/users/${robloxId}`);
      const data = await res.json();
      if (data.errors) throw new Error('User not found');
      setPreview(data);
      showToast('User found', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const linkAccount = async () => {
    if (!robloxId || !apiKey) { showToast('Fill in all fields', 'error'); return; }
    setLinking(true);
    try {
      const res = await fetch('/api/roblox/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ robloxId, apiKey }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast('Roblox account linked', 'success');
      refreshUser();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLinking(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Roblox Account</h2>

      {user?.robloxId && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(57,255,20,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000' }}>
              {user.robloxUsername?.[0]?.toUpperCase() || 'R'}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user.robloxUsername}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user.robloxId}</div>
            </div>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Linked</span>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>{user?.robloxId ? 'Update Account' : 'Link Account'}</h3>
        <div className="form-group">
          <label className="form-label">Roblox User ID</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" className="input input-mono" placeholder="10178074818" value={robloxId} onChange={e => setRobloxId(e.target.value)} />
            <button className="btn btn-outline" onClick={verifyUser} disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Verify'}
            </button>
          </div>
        </div>

        {preview && (
          <div style={{ padding: 16, background: 'rgba(57,255,20,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(57,255,20,0.15)', marginBottom: 16 }}>
            <div style={{ fontWeight: 700 }}>{preview.displayName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{preview.name} · ID: {preview.id}</div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Open Cloud API Key</label>
          <input type="password" className="input input-mono" placeholder="your-api-key-here" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Get your API key from <a href="https://create.roblox.com/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>create.roblox.com/credentials</a>
          </div>
        </div>

        <button className="btn btn-primary" onClick={linkAccount} disabled={linking} style={{ width: '100%' }}>
          {linking ? <span className="spinner"></span> : user?.robloxId ? 'Update Account' : 'Link Account'}
        </button>
      </div>
    </div>
  );
}
