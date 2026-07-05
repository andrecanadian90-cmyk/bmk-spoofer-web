import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BERNADA STORE — Roblox Spoofer, Audio Bypass & DJ Mixer',
  description: 'Platform otomatisasi Roblox Developer terbaik untuk bypass verifikasi UGC, audio, mesh, dan pembuatan setlist transisi musik.',
};

export default function RootLayout({ children }) {
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
