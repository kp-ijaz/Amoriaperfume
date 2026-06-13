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
  | 'instagram';

export type HomepageLayoutRow = {
  key: HomepageLayoutKey;
  enabled?: boolean;
};

/** Canonical section order — kept in sync with backend REORDERABLE_SECTION_KEYS. */
export const REORDERABLE_HOMEPAGE_LAYOUT_KEYS: HomepageLayoutKey[] = [
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
];

export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayoutKey[] = [...REORDERABLE_HOMEPAGE_LAYOUT_KEYS];

function insertMissingLayoutKeys(keys: HomepageLayoutKey[]): HomepageLayoutKey[] {
  const result = [...keys];
  const seen = new Set(keys);

  for (const key of REORDERABLE_HOMEPAGE_LAYOUT_KEYS) {
    if (seen.has(key)) continue;
    const insertAt = REORDERABLE_HOMEPAGE_LAYOUT_KEYS.indexOf(key);
    let pos = result.length;
    for (let i = 0; i < result.length; i++) {
      const idx = REORDERABLE_HOMEPAGE_LAYOUT_KEYS.indexOf(result[i]);
      if (idx > insertAt) {
        pos = i;
        break;
      }
    }
    result.splice(pos, 0, key);
    seen.add(key);
  }

  return result;
}

export function normalizeHomepageLayout(rows: { key: string; enabled?: boolean }[] | undefined | null): HomepageLayoutKey[] {
  const allowed = new Set<string>(REORDERABLE_HOMEPAGE_LAYOUT_KEYS);
  const seen = new Set<HomepageLayoutKey>();
  const ordered: HomepageLayoutKey[] = [];

  for (const row of rows ?? []) {
    const key = String(row?.key || '');
    if (!allowed.has(key) || seen.has(key as HomepageLayoutKey) || row?.enabled === false) continue;
    seen.add(key as HomepageLayoutKey);
    ordered.push(key as HomepageLayoutKey);
  }

  return insertMissingLayoutKeys(ordered);
}
