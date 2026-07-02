import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adaptProduct } from '@/lib/api/adapters';
import { fetchProductBySlug } from '@/lib/api/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  getProductMetaFromApi,
} from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductPageClient } from './ProductPageClient';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const api = await fetchProductBySlug(slug);
  if (!api) {
    return buildPageMetadata({ title: 'Product Not Found', path: `/products/${slug}`, noIndex: true });
  }
  const meta = getProductMetaFromApi(api);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.path,
    image: meta.image,
    keywords: meta.keywords,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const api = await fetchProductBySlug(slug);
  if (!api) notFound();

  const initialProduct = adaptProduct(api);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    ...(api.category?.name
      ? [{ name: api.category.name, path: `/categories/${api.category.slug}` }]
      : []),
    { name: api.name, path: `/products/${api.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[buildProductJsonLd(api), breadcrumbs]} />
      <ProductPageClient slug={slug} initialProduct={initialProduct} />
    </>
  );
}
