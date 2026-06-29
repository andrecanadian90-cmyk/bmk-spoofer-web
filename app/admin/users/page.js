'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [coinAmount, setCoinAmount] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch {} finally { setLoading(false); }
  };

  const addCoins = async () => {
    if (!coinAmount || !modal) return;
    try {
      const res = await fetch('/api/admin/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: modal._id, amount: Number(coinAmount), description: `Admin top-up` }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Added ${coinAmount} coins to ${modal.username}`, 'success');
        setModal(null);
        setCoinAmount('');
        fetchUsers();
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleBan = async (userId, action) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${action === 'ban' ? 'banned' : 'unbanned'}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = search
    ? users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner-lg"></div></div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Manage Users</h2>
      <div style={{ marginBottom: 16 }}>
        <input className="input" placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Coins</th>
                <th>Spoofs</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--warning)' }}>{u.coins}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{u.spoofCount || 0}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.banned ? 'badge-error' : 'badge-success'}`}>{u.banned ? 'Banned' : 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setModal(u); setCoinAmount(''); }}>+ Coins</button>
                      <button className={`btn btn-sm ${u.banned ? 'btn-outline' : 'btn-danger'}`} onClick={() => toggleBan(u._id, u.banned ? 'unban' : 'ban')}>
                        {u.banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Coins to {modal.username}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Current balance: <strong style={{ color: 'var(--warning)' }}>{modal.coins}</strong></div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input type="number" className="input input-mono" placeholder="100" value={coinAmount} onChange={e => setCoinAmount(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={addCoins}>Add Coins</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
