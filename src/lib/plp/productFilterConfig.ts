import type { ApiProductFilters } from '@/lib/hooks/useApiProducts';

export type SidebarFilterKey = keyof Pick<
  ApiProductFilters,
  | 'categories'
  | 'brands'
  | 'genders'
  | 'concentrations'
  | 'priceRange'
  | 'sizes'
  | 'seasons'
  | 'dayNight'
  | 'discountOnly'
  | 'minRating'
  | 'inStockOnly'
>;

export type FilterSectionType = 'checkbox' | 'radio' | 'range' | 'toggle';

export type FilterSectionDef = {
  id: string;
  label: string;
  type: FilterSectionType;
  filterKey: SidebarFilterKey;
  defaultOpen?: boolean;
};

export const SIDEBAR_FILTER_KEYS: SidebarFilterKey[] = [
  'categories',
  'brands',
  'genders',
  'concentrations',
  'priceRange',
  'sizes',
  'seasons',
  'dayNight',
  'discountOnly',
  'minRating',
  'inStockOnly',
];

/** Scope / merchandising keys preserved when clearing sidebar filters */
export const LOCKED_SCOPE_KEYS: (keyof ApiProductFilters)[] = [
  'categorySlug',
  'brandSlug',
  'collection',
  'brandInspiration',
  'featured',
  'bestSeller',
  'trending',
  'newArrival',
  'limitedOffer',
  'availability',
  'serverSort',
  'productIds',
  'searchQuery',
];

export const FILTER_SECTIONS: FilterSectionDef[] = [
  { id: 'category', label: 'Category', type: 'checkbox', filterKey: 'categories', defaultOpen: true },
  { id: 'brand', label: 'Brand', type: 'checkbox', filterKey: 'brands', defaultOpen: true },
  { id: 'gender', label: 'Gender', type: 'checkbox', filterKey: 'genders', defaultOpen: true },
  { id: 'concentration', label: 'Concentration', type: 'checkbox', filterKey: 'concentrations' },
  { id: 'price', label: 'Price (AED)', type: 'range', filterKey: 'priceRange' },
  { id: 'size', label: 'Size (ml)', type: 'checkbox', filterKey: 'sizes' },
  { id: 'season', label: 'Season', type: 'checkbox', filterKey: 'seasons' },
  { id: 'dayNight', label: 'Time of day', type: 'checkbox', filterKey: 'dayNight' },
  { id: 'discountOnly', label: 'On sale', type: 'toggle', filterKey: 'discountOnly' },
  { id: 'rating', label: 'Minimum rating', type: 'radio', filterKey: 'minRating' },
  { id: 'inStockOnly', label: 'In stock only', type: 'toggle', filterKey: 'inStockOnly' },
];

export const GENDER_LABELS: Record<string, string> = {
  men: "Men's",
  women: "Women's",
  unisex: 'Unisex',
};

export const SEASON_LABELS: Record<string, string> = {
  summer: 'Summer',
  winter: 'Winter',
  autumn: 'Autumn',
  spring: 'Spring',
};

export const DAY_NIGHT_LABELS: Record<string, string> = {
  day: 'Day',
  night: 'Night',
  both: 'Day & night',
};

export const CHIP_LABELS: Partial<Record<keyof ApiProductFilters, string>> = {
  categories: 'Category',
  brands: 'Brand',
  genders: 'Gender',
  concentrations: 'Concentration',
  sizes: 'Size',
  seasons: 'Season',
  dayNight: 'Time',
  discountOnly: 'On sale',
  inStockOnly: 'In stock',
  minRating: 'Rating',
  priceRange: 'Price',
  limitedOffer: 'Limited offers',
  brandInspiration: 'Brand inspirations',
  featured: 'Featured',
  bestSeller: 'Best sellers',
  availability: 'Online only',
  trending: 'Trending',
  newArrival: 'New arrivals',
  serverSort: 'Most viewed',
  productIds: 'Scent quiz matches',
};

export function countActiveSidebarFilters(filters: ApiProductFilters): number {
  let count = 0;
  for (const key of SIDEBAR_FILTER_KEYS) {
    const value = filters[key];
    if (Array.isArray(value)) {
      if (value.length > 0) count += value.length;
    } else if (key === 'priceRange' && value) {
      count += 1;
    } else if (key === 'minRating' && value != null) {
      count += 1;
    } else if ((key === 'discountOnly' || key === 'inStockOnly') && value) {
      count += 1;
    }
  }
  return count;
}

export function pickLockedScope(filters: ApiProductFilters): ApiProductFilters {
  const locked: ApiProductFilters = {};
  for (const key of LOCKED_SCOPE_KEYS) {
    const value = filters[key];
    if (value === undefined || value === false) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    (locked as Record<string, unknown>)[key] = value;
  }
  return locked;
}
