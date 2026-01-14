import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  metadataBase: new URL('https://thinktrail.netlify.app'),
  title: 'MindTrace',
  description: 'Capture how you think, not just what you conclude',
  manifest: '/manifest.json',
  openGraph: {
    title: 'MindTrace',
    description: 'Capture how you think, not just what you conclude',
    url: 'https://thinktrail.netlify.app',
    siteName: 'MindTrace',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'MindTrace Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindTrace',
    description: 'Capture how you think, not just what you conclude',
    images: ['/logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MindTrace',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-screen antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <ThemeProvider>
          <LanguageProvider>
            <main className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 py-6 pb-32">
              {children}
            </main>
            <InstallPrompt />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
