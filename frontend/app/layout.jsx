import API_BASE_URL from '@/config/api';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://evanscom.vercel.app'),
  title: {
    default: 'Evans Luxe Beauty | Organic Botanical Skincare',
    template: '%s | Evans Luxe Beauty'
  },
  description: 'Experience radiant skin naturally with Evans Luxe Beauty. Our 100% organic, botanical care products are cruelty-free and sustainably sourced for your beauty.',
  keywords: ['organic skincare', 'botanical beauty', 'natural cosmetics', 'Evans Luxe Beauty', 'cruelty-free skincare'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Evans Luxe Beauty | Organic Botanical Skincare',
    description: 'Experience radiant skin naturally with Evans Luxe Beauty. Our 100% organic, botanical care products are cruelty-free.',
    url: 'https://evanscom.vercel.app',
    siteName: 'Evans Luxe Beauty',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Evans Luxe Beauty',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evans Luxe Beauty | Organic Botanical Skincare',
    description: 'Experience radiant skin naturally with Evans Luxe Beauty.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#5A2A6C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Evans Luxe" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
        <link rel="preconnect" href={API_BASE_URL} />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="bg-gray-100 min-h-screen font-sans">
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#5A2A6C', color: 'white' }}>
            Please enable JavaScript to use this site for the best experience.
          </div>
        </noscript>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
