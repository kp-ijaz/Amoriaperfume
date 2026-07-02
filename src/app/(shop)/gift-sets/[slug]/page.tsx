import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchGiftSetBySlug } from '@/lib/api/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/site';
import { GiftSetPageClient } from './GiftSetPageClient';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const giftSet = await fetchGiftSetBySlug(slug);
  if (!giftSet) {
    return buildPageMetadata({ title: 'Gift Set Not Found', path: `/gift-sets/${slug}`, noIndex: true });
  }
  return buildPageMetadata({
    title: giftSet.name,
    description:
      giftSet.description?.trim() ||
      `Shop the ${giftSet.name} perfume gift set at Amoria UAE. Curated Arabian fragrances for gifting.`,
    path: `/gift-sets/${slug}`,
    image: giftSet.coverImage || giftSet.images?.[0],
    keywords: ['gift set', 'perfume gift', 'UAE', giftSet.name],
  });
}

export default async function GiftSetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const giftSet = await fetchGiftSetBySlug(slug);
  if (!giftSet) notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: giftSet.name,
    description: giftSet.description,
    image: giftSet.coverImage ? absoluteUrl(giftSet.coverImage) : undefined,
    sku: giftSet.sku,
    offers: {
      '@type': 'Offer',
      price: giftSet.giftSetPrice,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/gift-sets/${slug}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <GiftSetPageClient slug={slug} />
    </>
  );
}
