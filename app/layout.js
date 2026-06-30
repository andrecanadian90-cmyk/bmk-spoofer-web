import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BERNADA STORE — Roblox Asset Creator & Audio Developer Suite',
  description: 'BERNADA STORE — The ultimate developer workspace. Process asset spoofing, convert audio formats, and master mixing consoles in one unified portal.',
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
