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
            --muted: #737373;
            --border: #e5e5e5;
            --accent: #4fd1c5;
          }
          .dark {
            --bg: #0a0a0a;
            --text: #f5f5f5;
            --muted: #a3a3a3;
            --border: #262626;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0a0a0a;
              --text: #f5f5f5;
              --muted: #a3a3a3;
              --border: #262626;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: var(--bg);
            color: var(--text);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            line-height: 1.5;
          }
          main { max-width: 48rem; margin: 0 auto; padding: 1.5rem 1rem 8rem; }
          header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
          input, select, button { font-family: inherit; font-size: 1rem; }
          input, select { 
            width: 100%; padding: 0.75rem 1rem; 
            border: 1px solid var(--border); border-radius: 0.5rem;
            background: var(--bg); color: var(--text);
          }
          button { 
            padding: 0.5rem 1rem; border-radius: 0.5rem; 
            border: 1px solid var(--border); background: var(--bg);
            color: var(--text); cursor: pointer;
          }
          a { color: var(--accent); text-decoration: none; }
          ul { list-style: none; }
          .modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 50; padding: 1rem;
          }
          .modal-content {
            background: var(--bg); border-radius: 1rem;
            padding: 1.5rem; max-width: 28rem; width: 100%;
          }
          h1, h2, h3 { font-weight: 600; }
          h2 { font-size: 1.25rem; margin-bottom: 1rem; }
          ol { padding-left: 0; counter-reset: item; }
          ol li { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; }
          ol li::before {
            counter-increment: item;
            content: counter(item);
            flex-shrink: 0; width: 1.5rem; height: 1.5rem;
            background: var(--border); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.875rem; font-weight: 500;
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
        <noscript>
          <style>{`
            body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
            h1 { color: #4fd1c5; margin-bottom: 1rem; }
            p { margin-bottom: 1rem; line-height: 1.6; }
          `}</style>
          <h1>MindTrace</h1>
          <p>JavaScript is required to use MindTrace. Please enable JavaScript in your browser settings.</p>
          <p>MindTrace helps you capture how you think, not just what you conclude. Document your problem-solving journey step by step.</p>
        </noscript>
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
