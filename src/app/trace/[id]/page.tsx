import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTrace, getFirstTraceId } from '@/lib/db';
import { TraceView } from './TraceView';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trace = await getTrace(id);
  
  if (!trace) {
    return {
      title: 'Trace Not Found | MindTrace',
    };
  }

  const description = trace.problem.length > 160 
    ? trace.problem.substring(0, 157) + '...' 
    : trace.problem;

  return {
    title: `${trace.problem.substring(0, 60)} | MindTrace`,
    description,
    keywords: [...trace.tags, 'mindtrace', 'thinktrail', 'thinking process', 'problem solving'],
    openGraph: {
      title: trace.problem,
      description,
      url: `https://thinktrail.netlify.app/trace/${id}`,
      siteName: 'MindTrace',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'MindTrace Logo',
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: trace.problem,
      description,
      images: ['/logo.png'],
      creator: '@thinktrail',
    },
  };
}

export default async function TracePage({ params }: Props) {
  const { id } = await params;
  const trace = await getTrace(id);
  const featuredId = await getFirstTraceId();
  
  if (!trace) notFound();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: trace.problem,
    description: trace.problem,
    author: {
      '@type': 'Organization',
      name: 'MindTrace',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MindTrace',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thinktrail.netlify.app/logo.png',
      },
    },
    datePublished: trace.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thinktrail.netlify.app/trace/${id}`,
    },
    keywords: trace.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TraceView trace={trace} featuredId={featuredId} />
    </>
  );
}
