import type { Metadata } from 'next';
import { absoluteUrl } from './site';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from './constants';

export interface PageMetadataInput {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  keywords?: string | string[];
  noIndex?: boolean;
}

function normalizeImage(image?: string | null): string | undefined {
  if (!image?.trim()) return undefined;
  return absoluteUrl(image.trim());
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  keywords,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = normalizeImage(image) ?? absoluteUrl(DEFAULT_OG_IMAGE);
  const keywordList = keywords
    ? Array.isArray(keywords)
      ? keywords
      : keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords: keywordList,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_AE',
      type: 'website',
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export const noIndexMetadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  noIndex: true,
});
