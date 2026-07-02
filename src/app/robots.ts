import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/checkout/',
        '/cart',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/order-confirmation',
        '/track-order',
        '/api/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
