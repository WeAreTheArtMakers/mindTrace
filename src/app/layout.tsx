import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://thinktrail.netlify.app'),
  title: 'MindTrace - Capture Your Thinking Process',
  description: 'MindTrace helps you capture how you think, not just what you conclude. Document your problem-solving journey step by step.',
  keywords: ['mindtrace', 'thinktrail', 'thinking process', 'problem solving', 'thought documentation', 'mind mapping', 'decision making'],
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'MindTrace - Capture Your Thinking Process',
    description: 'Document your problem-solving journey step by step. Capture how you think, not just what you conclude.',
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
    title: 'MindTrace - Capture Your Thinking Process',
    description: 'Document your problem-solving journey step by step.',
    images: ['/logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MindTrace',
  },
  alternates: {
    canonical: 'https://thinktrail.netlify.app',
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
  // JSON-LD for website schema
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MindTrace',
    alternateName: 'ThinkTrail',
    url: 'https://thinktrail.netlify.app',
    description: 'Capture how you think, not just what you conclude. Document your problem-solving journey.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://thinktrail.netlify.app/?query={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MindTrace',
    url: 'https://thinktrail.netlify.app',
    logo: 'https://thinktrail.netlify.app/logo.png',
    sameAs: [],
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "v1v034kh6t");
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <ThemeProvider>
          <LanguageProvider>
            <main className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 py-6 pb-32">
              {children}
            </main>
            <InstallPrompt />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
