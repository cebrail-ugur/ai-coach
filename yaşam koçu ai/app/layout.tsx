import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'AI Koç — Kişisel Gelişim Platformu',
  description:
    'Yapay zeka destekli kişisel koçluk. Hedeflerine ulaş, alışkanlıklarını güçlendir, potansiyelini keşfet.',
  keywords: 'ai koç, kişisel gelişim, hedef takibi, alışkanlık, yaşam koçu',
  authors: [{ name: 'AI Koç' }],
  creator: 'AI Koç',
  applicationName: 'AI Koç',
  referrer: 'strict-origin-when-cross-origin',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'AI Koç — Kişisel Gelişim Platformu',
    description: 'Yapay zeka destekli kişisel koçluk.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'AI Koç',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f13',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${inter.className} antialiased bg-[#0f0f13] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
