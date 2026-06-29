'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TopUpPage() {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/coins/balance', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setCoins(data.data.coins);
        setTransactions(data.data.transactions);
      }
    } catch {}
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Top Up Coins</h2>

      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: 40, borderColor: 'rgba(255,214,10,0.2)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Current Balance</div>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>{coins}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>COINS</div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>How to Top Up</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p>1. Contact admin via Discord or Telegram</p>
          <p>2. Transfer payment to the provided account</p>
          <p>3. Send proof of payment to admin</p>
          <p>4. Admin will add coins to your account within minutes</p>
        </div>
        <div style={{ marginTop: 16, padding: 12, background: 'rgba(57,255,20,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Rate</div>
          <div style={{ fontWeight: 700 }}>1 Coin = 1 Spoof</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Transaction History</h3>
        {transactions.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No transactions yet</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${t.type === 'topup' ? 'success' : t.type === 'spend' ? 'warning' : 'info'}`}>{t.type}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.amount > 0 ? 'var(--accent)' : 'var(--fail)' }}>{t.amount > 0 ? '+' : ''}{t.amount}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
