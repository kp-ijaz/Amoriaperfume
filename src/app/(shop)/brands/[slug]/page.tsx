import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adaptBrand } from '@/lib/api/adapters';
import { fetchBrandBySlug } from '@/lib/api/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { BrandPageClient } from './BrandPageClient';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await fetchBrandBySlug(slug);
  if (!brand) {
    return buildPageMetadata({ title: 'Brand Not Found', path: `/brands/${slug}`, noIndex: true });
  }
  const title = `${brand.name} Perfumes`;
  const description =
    brand.description?.trim() ||
    `Shop ${brand.name} perfumes, oud, and attars online at Amoria UAE. Authentic fragrances with delivery across Dubai and the Emirates.`;
  return buildPageMetadata({
    title,
    description,
    path: `/brands/${slug}`,
    image: brand.productCoverImage || brand.logo,
    keywords: [brand.name, 'perfume', 'oud', 'UAE'],
  });
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const api = await fetchBrandBySlug(slug);
  if (!api) notFound();

  const initialBrand = adaptBrand(api);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Brands', path: '/brands' },
    { name: api.name, path: `/brands/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <BrandPageClient slug={slug} initialBrand={initialBrand} />
    </>
  );
}
