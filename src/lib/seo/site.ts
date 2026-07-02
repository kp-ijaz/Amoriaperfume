const DEFAULT_SITE_URL = 'https://amoriaperfume.ae';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function productUrl(slug: string): string {
  return absoluteUrl(`/products/${slug}`);
}

export function brandUrl(slug: string): string {
  return absoluteUrl(`/brands/${slug}`);
}

export function categoryUrl(slug: string): string {
  return absoluteUrl(`/categories/${slug}`);
}
