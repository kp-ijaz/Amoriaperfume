import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBundleBySlug } from '@/lib/api/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/site';
import { BundlePageClient } from './BundlePageClient';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await fetchBundleBySlug(slug);
  if (!bundle) {
    return buildPageMetadata({ title: 'Bundle Not Found', path: `/bundles/${slug}`, noIndex: true });
  }
  return buildPageMetadata({
    title: bundle.name,
    description:
      bundle.description?.trim() ||
      `Save on the ${bundle.name} perfume bundle at Amoria UAE. Multiple authentic fragrances at a special price.`,
    path: `/bundles/${slug}`,
    image: bundle.coverImage || bundle.images?.[0],
    keywords: ['perfume bundle', 'fragrance deal', 'UAE', bundle.name],
  });
}

export default async function BundleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await fetchBundleBySlug(slug);
  if (!bundle) notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: bundle.name,
    description: bundle.description,
    image: bundle.coverImage ? absoluteUrl(bundle.coverImage) : undefined,
    sku: bundle.sku,
    offers: {
      '@type': 'Offer',
      price: bundle.bundlePrice,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/bundles/${slug}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <BundlePageClient slug={slug} />
    </>
  );
}
