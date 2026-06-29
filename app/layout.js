import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BMK Spoofer — Bypass & Refake Any Banned or Disabled Devices',
  description: 'BMK Spoofer — The most advanced spoofing tool to bypass and refake any banned or disabled devices in any services.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <div className="page-container">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
