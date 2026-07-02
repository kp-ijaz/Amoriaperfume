import type { Metadata } from 'next';
import { fetchPublicPage } from '@/lib/api/server';
import { buildPageMetadata } from './metadata';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function buildCmsPageMetadata(
  slug: string,
  fallbackTitle: string,
  fallbackPath: string
): Promise<Metadata> {
  const page = await fetchPublicPage(slug);
  if (!page) {
    return buildPageMetadata({
      title: fallbackTitle,
      path: fallbackPath,
    });
  }

  const description =
    page.metaDescription?.trim() ||
    stripHtml(page.body).slice(0, 160) ||
    fallbackTitle;

  return buildPageMetadata({
    title: page.metaTitle?.trim() || page.title || fallbackTitle,
    description,
    path: fallbackPath,
    image: page.ogImage,
  });
}
