import type { MetadataRoute } from 'next';
import { CONTENT_PAGE_TYPES } from '@/lib/cms/contentPageTypes';
import {
  fetchAllProducts,
  fetchBrands,
  fetchBundles,
  fetchCategories,
  fetchGiftSets,
} from '@/lib/api/server';
import { getSiteUrl } from '@/lib/seo/site';

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/products', priority: 0.9, changeFrequency: 'daily' },
  { path: '/brands', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/categories', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/gift-sets', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/bundles', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collections', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/bakhoor', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/brand-inspiration', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/fragrance-finder', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/store-locator', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/custom-perfume', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/gift-cards', priority: 0.5, changeFrequency: 'monthly' },
];

function entry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'weekly',
    priority: opts.priority ?? 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands, categories, giftSets, bundles] = await Promise.all([
    fetchAllProducts(),
    fetchBrands(),
    fetchCategories(),
    fetchGiftSets(),
    fetchBundles(),
  ]);

  const urls: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) =>
    entry(route.path, { changeFrequency: route.changeFrequency, priority: route.priority })
  );

  for (const page of CONTENT_PAGE_TYPES) {
    urls.push(
      entry(page.path, { changeFrequency: 'monthly', priority: 0.5 })
    );
  }

  for (const product of products) {
    if (!product.slug) continue;
    urls.push(
      entry(`/products/${product.slug}`, {
        lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    );
  }

  for (const brand of brands) {
    if (!brand.slug) continue;
    urls.push(entry(`/brands/${brand.slug}`, { changeFrequency: 'weekly', priority: 0.7 }));
  }

  for (const category of categories) {
    if (!category.slug) continue;
    urls.push(entry(`/categories/${category.slug}`, { changeFrequency: 'weekly', priority: 0.7 }));
  }

  for (const giftSet of giftSets) {
    if (!giftSet.slug) continue;
    urls.push(
      entry(`/gift-sets/${giftSet.slug}`, {
        lastModified: giftSet.updatedAt ? new Date(giftSet.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    );
  }

  for (const bundle of bundles) {
    if (!bundle.slug) continue;
    urls.push(
      entry(`/bundles/${bundle.slug}`, {
        lastModified: bundle.updatedAt ? new Date(bundle.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    );
  }

  return urls;
}
