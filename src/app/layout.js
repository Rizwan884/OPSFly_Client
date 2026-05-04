import { Inter } from 'next/font/google';
import '../src/index.css';
import BottomNav from '@/src/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OpsFly',
  description: 'AI-powered operations management for hospitality teams.',
  manifest: '/manifest.webmanifest',
  themeColor: '#0D1B2A',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    title: 'OpsFly',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-shell">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
