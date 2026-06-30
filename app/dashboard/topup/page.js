'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  id: {
    title: 'Top Up Koin',
    selectPkg: 'Pilih Paket Koin',
    rankBenefits: '👑 Pangkat & Benefit Member',
    basicDesc: 'Batas 10x spoof per minggu (semua tipe aset digabung) • Antrean Standard.',
    premiumDesc: 'Tidak ada batasan spoof • Prioritas antrean di atas Basic.',
    exclusiveDesc: 'Tidak ada batasan spoof • Prioritas antrean tinggi (bebas antrean).',
    topSpenderDesc: 'UNLIMITED COIN (Bypass Gratis Selamanya 0 Koin) • Prioritas antrean paling tinggi.',
    purchaseVerification: 'Verifikasi Pembelian',
    howToBuy: 'Pembelian koin maupun upgrade rank hanya dilayani melalui pembuatan tiket bantuan (support ticket) di server Discord resmi kami.',
    step1: 'Klik tombol Open Discord Support Ticket di bawah untuk bergabung.',
    step2: 'Buka channel support/ticket di Discord lalu buat tiket baru.',
    step3: 'Kirimkan username Anda beserta pilihan paket koin/rank target.',
    step4: 'Lakukan pembayaran sesuai metode yang dipandu oleh administrator.',
    step5: 'Saldo koin atau rank baru Anda akan langsung dikreditkan secara instan setelah verifikasi.',
    availableBalance: 'Saldo Tersedia',
    coins: 'Koin',
    trxHistory: 'Riwayat Transaksi',
    noTrx: 'Belum ada transaksi tercatat',
    openTicketBtn: 'Buka Tiket Bantuan Discord',
  },
  en: {
    title: 'Top Up Coins',
    selectPkg: 'Select Coin Package',
    rankBenefits: '👑 Ranks & Member Benefits',
    basicDesc: 'Limit of 10x spoof per week (all asset types combined) • Standard Queue.',
    premiumDesc: 'No spoof limits • Queue priority above Basic.',
    exclusiveDesc: 'No spoof limits • High queue priority (no queue).',
    topSpenderDesc: 'UNLIMITED COIN (Free Bypass Forever 0 Coins) • Highest queue priority.',
    purchaseVerification: 'Purchase Verification',
    howToBuy: 'Coin purchases and rank upgrades are only processed through support tickets in our official Discord server.',
    step1: 'Click the Open Discord Support Ticket button below to join.',
    step2: 'Open the support/ticket channel on Discord and create a new ticket.',
    step3: 'Send your username along with your choice of coin package or target rank.',
    step4: 'Make the payment according to the method guided by the administrator.',
    step5: 'Your coin balance or new rank will be credited instantly after verification.',
    availableBalance: 'Available Balance',
    coins: 'Coins',
    trxHistory: 'Transaction History',
    noTrx: 'No transactions recorded',
    openTicketBtn: 'Open Discord Support Ticket',
  }
};

export default function TopUpPage() {
  const { user, token } = useAuth();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [coins, setCoins] = useState(0);

  const t = (key) => translations[language]?.[key] || translations['id'][key];

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
      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 24 }}>{t('title')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left Side: Coin Packages & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Packages */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>{t('selectPkg')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { qty: 10, price: 'Rp 10.000', save: null },
                { qty: 50, price: 'Rp 45.000', save: language === 'id' ? 'Hemat 10%' : 'Save 10%' },
                { qty: 100, price: 'Rp 85.000', save: language === 'id' ? 'Hemat 15%' : 'Save 15%' },
                { qty: 250, price: 'Rp 200.000', save: language === 'id' ? 'Hemat 20%' : 'Save 20%' },
                { qty: 500, price: 'Rp 375.000', save: language === 'id' ? 'Hemat 25%' : 'Save 25%' },
                { qty: 1000, price: 'Rp 700.000', save: language === 'id' ? 'Hemat 30%' : 'Save 30%' }
              ].map((pkg) => (
                <div key={pkg.qty} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '16px 8px',
                  textAlign: 'center',
                  transition: 'var(--transition)',
                  cursor: 'pointer',
                  position: 'relative'
                }} className="card-glow">
                  {pkg.save && (
                    <span style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(57, 255, 20, 0.12)',
                      color: '#39ff14',
                      fontSize: '0.52rem',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: 4,
                      border: '1px solid rgba(57, 255, 20, 0.2)'
                    }}>
                      {pkg.save}
                    </span>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', marginTop: pkg.save ? 4 : 0 }}>{pkg.qty} {t('coins')}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{pkg.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rank Benefits */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('rankBenefits')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Basic */}
              <div style={{
                background: 'rgba(107, 114, 128, 0.03)',
                border: '1px solid rgba(107, 114, 128, 0.1)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    color: '#9ca3af',
                    background: 'rgba(107, 114, 128, 0.08)',
                    padding: '4px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(107, 114, 128, 0.15)',
                    letterSpacing: '0.05em'
                  }}>BASIC</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: t('basicDesc') }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>FREE TIER</span>
              </div>

              {/* Premium */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.03)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '4px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    letterSpacing: '0.05em'
                  }}>PREMIUM</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: t('premiumDesc') }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700, letterSpacing: '0.05em' }}>Min. 50 Coins</span>
              </div>

              {/* Exclusive */}
              <div style={{
                background: 'rgba(124, 58, 237, 0.03)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    color: '#7c3aed',
                    background: 'rgba(124, 58, 237, 0.08)',
                    padding: '4px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(124, 58, 237, 0.15)',
                    letterSpacing: '0.05em'
                  }}>EXCLUSIVE</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: t('exclusiveDesc') }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.05em' }}>Min. 500 Coins</span>
              </div>

              {/* Top Spender */}
              <div style={{
                background: 'rgba(251, 191, 36, 0.04)',
                border: '1px solid rgba(251, 191, 36, 0.18)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    color: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.1)',
                    padding: '4px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    letterSpacing: '0.05em'
                  }}>TOP SPENDER</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: t('topSpenderDesc') }} />
                </div>
              </div>
            </div>
          </div>

          {/* How to Buy */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>{t('purchaseVerification')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                {t('howToBuy')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-subtle)', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>1.</span>
                  <span>{t('step1')}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>2.</span>
                  <span>{t('step2')}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>3.</span>
                  <span>{t('step3')}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>4.</span>
                  <span>{t('step4')}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>5.</span>
                  <span>{t('step5')}</span>
                </div>
              </div>
            </div>

            <a 
              href="https://discord.gg/x26ky9drYr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 8,
                marginTop: 20,
                padding: '12px 20px',
                background: 'rgba(37, 99, 235, 0.08)',
                color: 'var(--accent)',
                fontWeight: '700',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                borderRadius: 10,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              className="ticket-btn-hover"
            >
              <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor" style={{ marginRight: 6 }}>
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c.87-.64,1.72-1.32,2.53-2a75.76,75.76,0,0,0,72.82,0c.81.71,1.66,1.39,2.53,2a68.43,68.43,0,0,1-10.45,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129.87,50.36,124,27.56,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
              </svg>
              <span>{t('openTicketBtn')}</span>
            </a>
          </div>

        </div>

        {/* Right Side: Current Balance */}
        <div>
          <div className="card" style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 20px', 
            borderColor: 'rgba(37, 99, 235, 0.15)',
            background: 'rgba(37, 99, 235, 0.02)',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.05)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{t('availableBalance')}</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {user?.role === 'top_spender' || user?.role === 'admin' ? 'UNLIMITED' : coins}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 12 }}>{t('coins')}</div>
          </div>
        </div>

      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>{t('trxHistory')}</h3>
        {transactions.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('noTrx')}</div>
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
                    <td>
                      <span className={`badge ${t.type === 'topup' ? 'badge-success' : 'badge-error'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.amount > 0 ? 'var(--success)' : 'var(--fail)' }}>
                      {t.amount > 0 ? '+' : ''}{t.amount}
                    </td>
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
