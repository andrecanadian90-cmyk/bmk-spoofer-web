import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BERNADA STORE — Website Under Maintenance',
  description: 'Kami sedang melakukan peningkatan sistem. Kami akan segera kembali online.',
};

const MAINTENANCE_MODE = true; // Set to false to end maintenance mode

export default function RootLayout({ children }) {
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning style={{ margin: 0, padding: 0, backgroundColor: '#020617', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            color: '#f8fafc',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
          }}>
            {/* Glowing background spots */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              pointerEvents: 'none',
              filter: 'blur(40px)'
            }} />
            <div style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
              bottom: '10%',
              right: '10%',
              pointerEvents: 'none',
              filter: 'blur(60px)'
            }} />

            {/* Card wrapper */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '48px 32px',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)'
            }}>
              {/* Spinning Logo / Icon */}
              <div className="spinning-cog" style={{
                fontSize: '4.5rem',
                marginBottom: '24px',
                display: 'inline-block',
                filter: 'drop-shadow(0 0 20px rgba(37, 99, 235, 0.3))'
              }}>
                ⚙️
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase'
              }}>
                WEBSITE SEDANG MAINTENANCE...
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '0.92rem',
                color: '#94a3b8',
                lineHeight: '1.6',
                margin: '0 0 32px 0'
              }}>
                Kami sedang melakukan peningkatan kualitas sistem, pemeliharaan database, dan penyesuaian fungsionalitas guna memberikan layanan terbaik. Portal akan kembali aktif segera setelah pemeliharaan selesai.
              </p>

              {/* Status Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#3b82f6',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                <span className="pulse-dot" />
                Upgrading System Core & Tuning
              </div>
            </div>

            {/* CSS Animation injection */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.35; transform: scale(0.9); }
                50% { opacity: 1; transform: scale(1.15); }
              }
              .spinning-cog {
                animation: spin 6s linear infinite;
              }
              .pulse-dot {
                width: 8px;
                height: 8px;
                borderRadius: 50%;
                backgroundColor: #3b82f6;
                animation: pulse 1.5s ease-in-out infinite;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
              }
            `}} />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <Navbar />
              <div className="page-container">
                {children}
              </div>
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
