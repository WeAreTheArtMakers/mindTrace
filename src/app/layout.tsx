import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Analytics } from '@/components/Analytics';
import { SplashScreen } from '@/components/SplashScreen';

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
        url: 'https://thinktrail.netlify.app/mindTrace.png',
        width: 600,
        height: 600,
        alt: 'MindTrace Logo',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thinktrail',
    creator: '@thinktrail',
    title: 'MindTrace - Düşünce Sürecinizi Kaydedin',
    description: 'Sadece sonuçları değil, nasıl düşündüğünüzü de kaydedin. Problem çözme yolculuğunuzu adım adım belgeleyin.',
    images: {
      url: 'https://thinktrail.netlify.app/og-image-new.jpg',
      alt: 'MindTrace - Düşünce Sürecinizi Kaydedin',
    },
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
    logo: 'https://thinktrail.netlify.app/og-image-optimized.jpg',
    sameAs: [],
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Critical CSS to prevent FOUC (Flash of Unstyled Content) */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #fafafa;
            --text: #171717;
          }
          .dark {
            --bg: #0a0a0a;
            --text: #f5f5f5;
          }
          body {
            background: var(--bg);
            color: var(--text);
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            min-height: 100vh;
          }
          /* Hide content until CSS loads */
          .loading-screen {
            position: fixed;
            inset: 0;
            background: var(--bg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
        ` }} />
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@thinktrail" />
        <meta name="twitter:creator" content="@thinktrail" />
        <meta name="twitter:title" content="MindTrace - Düşünce Sürecinizi Kaydedin" />
        <meta name="twitter:description" content="Sadece sonuçları değil, nasıl düşündüğünüzü de kaydedin. Problem çözme yolculuğunuzu adım adım belgeleyin." />
        <meta name="twitter:image" content="https://thinktrail.netlify.app/og-image-new.jpg" />
        <meta name="twitter:image:alt" content="MindTrace - Düşünce Sürecinizi Kaydedin" />
        {/* Open Graph meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MindTrace - Capture Your Thinking Process" />
        <meta property="og:description" content="Document your problem-solving journey step by step." />
        <meta property="og:image" content="https://thinktrail.netlify.app/mindTrace.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="MindTrace Logo" />
        <meta property="og:url" content="https://thinktrail.netlify.app" />
        <meta property="og:site_name" content="MindTrace" />
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
            <SplashScreen />
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
