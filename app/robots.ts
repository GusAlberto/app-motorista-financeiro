import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Protected app routes require auth and redirect to /login for
      // crawlers anyway — disallow them outright to avoid wasted crawl
      // budget and indexing of redirect chains.
      disallow: ['/dashboard', '/settings', '/transactions'],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
