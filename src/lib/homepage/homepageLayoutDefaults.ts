export type HomepageLayoutKey =
  | 'announcement'
  | 'new_arrivals'
  | 'promo_banners'
  | 'limited_offers'
  | 'shop_by_brands'
  | 'best_sellers'
  | 'most_viewed'
  | 'men_women'
  | 'brand_inspirations'
  | 'testimonials'
  | 'instagram'
  | 'newsletter';

export type HomepageLayoutRow = {
  key: HomepageLayoutKey;
  enabled?: boolean;
};

export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayoutKey[] = [
  'announcement',
  'new_arrivals',
  'promo_banners',
  'limited_offers',
  'shop_by_brands',
  'best_sellers',
  'most_viewed',
  'men_women',
  'brand_inspirations',
  'testimonials',
  'instagram',
  'newsletter',
];

export function normalizeHomepageLayout(rows: { key: string; enabled?: boolean }[] | undefined | null): HomepageLayoutKey[] {
  const allowed = new Set<string>(DEFAULT_HOMEPAGE_LAYOUT);
  const seen = new Set<HomepageLayoutKey>();
  const ordered: HomepageLayoutKey[] = [];

  for (const row of rows ?? []) {
    const key = String(row?.key || '');
    if (!allowed.has(key) || seen.has(key as HomepageLayoutKey) || row?.enabled === false) continue;
    seen.add(key as HomepageLayoutKey);
    ordered.push(key as HomepageLayoutKey);
  }

  for (const key of DEFAULT_HOMEPAGE_LAYOUT) {
    if (!seen.has(key)) ordered.push(key);
  }

  return ordered;
}
