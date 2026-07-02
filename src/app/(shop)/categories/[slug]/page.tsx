import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adaptCategory } from '@/lib/api/adapters';
import { fetchCategoryBySlug } from '@/lib/api/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { CategoryPageClient } from './CategoryPageClient';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    return buildPageMetadata({ title: 'Category Not Found', path: `/categories/${slug}`, noIndex: true });
  }
  const title = `${category.name} Perfumes`;
  const description =
    category.description?.trim() ||
    `Shop ${category.name} perfumes and fragrances online at Amoria UAE. Authentic Arabian scents delivered across Dubai and the Emirates.`;
  return buildPageMetadata({
    title,
    description,
    path: `/categories/${slug}`,
    image: category.image,
    keywords: [category.name, 'perfume', 'fragrance', 'UAE'],
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const api = await fetchCategoryBySlug(slug);
  if (!api) notFound();

  const initialCategory = adaptCategory(api);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: api.name, path: `/categories/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <CategoryPageClient slug={slug} initialCategory={initialCategory} />
    </>
  );
}
