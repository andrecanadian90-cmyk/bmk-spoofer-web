import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BMK Spoofer — Bypass & Refake Any Banned or Disabled Devices',
  description: 'BMK Spoofer — The most advanced spoofing tool to bypass and refake any banned or disabled devices in any services.',
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
