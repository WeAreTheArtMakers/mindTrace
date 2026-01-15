import { MetadataRoute } from 'next';
import { getAllTraces } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thinktrail.netlify.app';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic trace pages
  try {
    const traces = await getAllTraces();
    const tracePages: MetadataRoute.Sitemap = traces.map((trace) => ({
      url: `${baseUrl}/trace/${trace.id}`,
      lastModified: new Date(trace.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...tracePages];
  } catch {
    return staticPages;
  }
}
