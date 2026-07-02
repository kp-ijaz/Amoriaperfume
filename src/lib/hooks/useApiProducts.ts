'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductsParams } from '@/lib/api/client';
import { apiGetProducts, apiGetProductBySlug, apiGetProductReviews } from '@/lib/api/client';
import { adaptProduct, adaptProducts, adaptReviews } from '@/lib/api/adapters';
import { Product } from '@/types/product';
import {
  countActiveSidebarFilters,
  LOCKED_SCOPE_KEYS,
  pickLockedScope,
  type SidebarFilterKey,
} from '@/lib/plp/productFilterConfig';

export type ApiSortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating'
  | 'name_asc'
  | 'name_desc'
  | 'bestsellers'
  | 'most-reviewed';

export type ApiProductFilters = {
  categories?: string[];
  brands?: string[];
  genders?: string[];
  concentrations?: string[];
  sizes?: number[];
  seasons?: string[];
  dayNight?: string[];
  priceRange?: { min: number; max: number };
  discountOnly?: boolean;
  inStockOnly?: boolean;
  minRating?: number;
  searchQuery?: string;
  categorySlug?: string;
  brandSlug?: string;
  collection?: string;
  featured?: boolean;
  bestSeller?: boolean;
  availability?: 'online' | 'offline' | 'both';
  trending?: boolean;
  newArrival?: boolean;
  limitedOffer?: boolean;
  brandInspiration?: boolean;
  serverSort?: 'most_viewed';
  productIds?: string[];
};

export type FilterOption = {
  value: string;
  label: string;
  count: number;
};

export type AvailableProductFilters = {
  categories: FilterOption[];
  brands: FilterOption[];
  genders: FilterOption[];
  concentrations: FilterOption[];
  sizes: FilterOption[];
  seasons: FilterOption[];
  dayNight: FilterOption[];
  priceBounds: { min: number; max: number };
};

export type UseApiProductsOptions = {
  lockedFilters?: ApiProductFilters;
};

const SERVER_FETCH_LIMIT = 100;

const GENDER_LABELS: Record<string, string> = {
  men: "Men's",
  women: "Women's",
  unisex: 'Unisex',
};

const SEASON_LABELS: Record<string, string> = {
  summer: 'Summer',
  winter: 'Winter',
  autumn: 'Autumn',
  spring: 'Spring',
};

const DAY_NIGHT_LABELS: Record<string, string> = {
  day: 'Day',
  night: 'Night',
  both: 'Day & night',
};

function getProductPrice(product: Product): number {
  const variant = product.variants[0];
  return variant?.salePrice ?? variant?.price ?? 0;
}

function productHasStock(product: Product): boolean {
  return product.variants.some((v) => v.stock > 0);
}

function getProductSizes(product: Product): number[] {
  return product.variants.map((v) => v.sizeMl).filter((s) => s > 0);
}

function applyClientFilters(products: Product[], filters: ApiProductFilters): Product[] {
  return products.filter((product) => {
    if (filters.categories?.length) {
      if (!product.category || !filters.categories.includes(product.category)) return false;
    }
    if (filters.brands?.length) {
      if (!product.brand || !filters.brands.includes(product.brand)) return false;
    }
    if (filters.genders?.length) {
      if (!product.gender || !filters.genders.includes(product.gender)) return false;
    }
    if (filters.concentrations?.length) {
      if (!product.concentration || !filters.concentrations.includes(product.concentration)) return false;
    }
    if (filters.sizes?.length) {
      const sizes = getProductSizes(product);
      if (!filters.sizes.some((s) => sizes.includes(s))) return false;
    }
    if (filters.seasons?.length) {
      const productSeasons = product.seasons ?? [];
      if (!filters.seasons.some((s) => productSeasons.includes(s as (typeof productSeasons)[number]))) return false;
    }
    if (filters.dayNight?.length) {
      if (!product.dayNight || !filters.dayNight.includes(product.dayNight)) return false;
    }
    if (filters.priceRange) {
      const price = getProductPrice(product);
      if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
    }
    if (filters.discountOnly && !product.isOnSale) return false;
    if (filters.inStockOnly && !productHasStock(product)) return false;
    if (filters.minRating != null && (product.rating ?? 0) < filters.minRating) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...product.topNotes,
        ...product.heartNotes,
        ...product.baseNotes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.productIds?.length) {
      if (!filters.productIds.includes(product.id)) return false;
    }
    return true;
  });
}

function buildFacetOptions(
  allValuesSource: Product[],
  countedSource: Product[],
  getValue: (p: Product) => string | undefined,
  getLabel?: (v: string) => string
): FilterOption[] {
  const allValues = new Set<string>();
  for (const p of allValuesSource) {
    const v = getValue(p);
    if (v) allValues.add(v);
  }

  const counts = new Map<string, number>();
  for (const p of countedSource) {
    const v = getValue(p);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }

  return Array.from(allValues)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: getLabel ? getLabel(value) : value,
      count: counts.get(value) ?? 0,
    }));
}

function buildArrayFacetOptions(
  allValuesSource: Product[],
  countedSource: Product[],
  getValues: (p: Product) => string[],
  getLabel?: (v: string) => string
): FilterOption[] {
  const allValues = new Set<string>();
  for (const p of allValuesSource) {
    for (const v of getValues(p)) allValues.add(v);
  }

  const counts = new Map<string, number>();
  for (const p of countedSource) {
    for (const v of getValues(p)) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }

  return Array.from(allValues)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: getLabel ? getLabel(value) : value,
      count: counts.get(value) ?? 0,
    }));
}

function buildSizeFacetOptions(allValuesSource: Product[], countedSource: Product[]): FilterOption[] {
  const allValues = new Set<number>();
  for (const p of allValuesSource) {
    for (const s of getProductSizes(p)) allValues.add(s);
  }

  const counts = new Map<number, number>();
  for (const p of countedSource) {
    for (const s of getProductSizes(p)) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }

  return Array.from(allValues)
    .sort((a, b) => a - b)
    .map((value) => ({
      value: String(value),
      label: `${value} ml`,
      count: counts.get(value) ?? 0,
    }));
}

function getPriceBounds(products: Product[]): { min: number; max: number } {
  if (!products.length) return { min: 0, max: 1000 };
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    const price = getProductPrice(p);
    if (price < min) min = price;
    if (price > max) max = price;
  }
  return {
    min: min === Infinity ? 0 : Math.floor(min),
    max: Math.ceil(max),
  };
}

function sortProducts(products: Product[], sortBy: ApiSortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    case 'price_desc':
      return sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    case 'newest':
      return sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'bestsellers':
      return sorted.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    case 'most-reviewed':
      return sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

export function useApiProducts(
  initialFilters: ApiProductFilters = {},
  options?: UseApiProductsOptions
) {
  const lockedFilters = options?.lockedFilters ?? {};
  const [filters, setFilters] = useState<ApiProductFilters>(() => ({
    ...lockedFilters,
    ...initialFilters,
  }));
  const [sortBy, setSortBy] = useState<ApiSortOption>('featured');
  const [displayCount, setDisplayCount] = useState(20);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters((prev) => ({ ...lockedFilters, ...initialFilters, ...pickLockedScope(prev) }));
  }, [JSON.stringify(initialFilters), JSON.stringify(lockedFilters)]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const serverParams: Parameters<typeof apiGetProducts>[0] = {
      limit: SERVER_FETCH_LIMIT,
      page: 1,
    };

    if (filters.categorySlug) serverParams.categorySlug = filters.categorySlug;
    if (filters.brandSlug) serverParams.brandSlug = filters.brandSlug;
    if (filters.collection) serverParams.collection = filters.collection;
    if (filters.featured) serverParams.featured = true;
    if (filters.bestSeller) serverParams.bestSeller = true;
    if (filters.trending) serverParams.trending = true;
    if (filters.newArrival) serverParams.newArrival = true;
    if (filters.limitedOffer) serverParams.limitedOffer = true;
    if (filters.brandInspiration) serverParams.brandInspiration = true;
    if (filters.availability) serverParams.availability = filters.availability;
    if (filters.searchQuery) serverParams.search = filters.searchQuery;
    if (filters.genders?.length === 1) serverParams.gender = filters.genders[0];
    if (filters.concentrations?.length === 1) serverParams.concentration = filters.concentrations[0];
    if (filters.minRating != null) serverParams.minRating = filters.minRating;
    if (filters.seasons?.length) serverParams.seasons = filters.seasons.join(',');
    if (filters.dayNight?.length === 1) serverParams.dayNight = filters.dayNight[0];
    if (filters.priceRange) {
      serverParams.minPrice = filters.priceRange.min;
      serverParams.maxPrice = filters.priceRange.max;
    }
    if (filters.serverSort === 'most_viewed') serverParams.sort = 'most_viewed';

    apiGetProducts(serverParams)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setAllProducts(adaptProducts(res.data.items));
        } else {
          setError(res.message ?? 'Failed to load products');
          setAllProducts([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
          setAllProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    filters.categorySlug,
    filters.brandSlug,
    filters.collection,
    filters.featured,
    filters.bestSeller,
    filters.trending,
    filters.newArrival,
    filters.limitedOffer,
    filters.brandInspiration,
    filters.availability,
    filters.searchQuery,
    filters.genders,
    filters.concentrations,
    filters.minRating,
    filters.seasons,
    filters.dayNight,
    filters.priceRange,
    filters.serverSort,
  ]);

  const filteredProducts = useMemo(
    () => sortProducts(applyClientFilters(allProducts, filters), sortBy),
    [allProducts, filters, sortBy]
  );

  const availableFilters = useMemo((): AvailableProductFilters => {
    const scoped = applyClientFilters(allProducts, pickLockedScope(filters));
    const forFacets = applyClientFilters(
      scoped,
      Object.fromEntries(
        Object.entries(filters).filter(([k]) => !LOCKED_SCOPE_KEYS.includes(k as keyof ApiProductFilters))
      ) as ApiProductFilters
    );

    const facetBase = scoped;
    const facetCounted = forFacets;

    return {
      categories: buildFacetOptions(
        facetBase,
        facetCounted,
        (p) => p.category,
        undefined
      ),
      brands: buildFacetOptions(facetBase, facetCounted, (p) => p.brand),
      genders: buildFacetOptions(
        facetBase,
        facetCounted,
        (p) => p.gender,
        (v) => GENDER_LABELS[v] ?? v
      ),
      concentrations: buildFacetOptions(facetBase, facetCounted, (p) => p.concentration),
      sizes: buildSizeFacetOptions(facetBase, facetCounted),
      seasons: buildArrayFacetOptions(
        facetBase,
        facetCounted,
        (p) => p.seasons ?? [],
        (v) => SEASON_LABELS[v] ?? v
      ),
      dayNight: buildFacetOptions(
        facetBase,
        facetCounted,
        (p) => p.dayNight,
        (v) => DAY_NIGHT_LABELS[v] ?? v
      ),
      priceBounds: getPriceBounds(facetBase),
    };
  }, [allProducts, filters]);

  const products = useMemo(
    () => filteredProducts.slice(0, displayCount),
    [filteredProducts, displayCount]
  );

  const totalCount = filteredProducts.length;
  const hasMore = displayCount < filteredProducts.length;
  const activeFilterCount = countActiveSidebarFilters(filters);

  const updateFilter = useCallback(
    <K extends keyof ApiProductFilters>(key: K, value: ApiProductFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setDisplayCount(20);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({ ...lockedFilters });
    setDisplayCount(20);
  }, [lockedFilters]);

  const loadMore = useCallback(() => {
    setDisplayCount((c) => c + 20);
  }, []);

  return {
    products,
    totalCount,
    hasMore,
    isLoading,
    error,
    filters,
    availableFilters,
    sortBy,
    activeFilterCount,
    setFilters,
    updateFilter,
    clearFilters,
    setSortBy,
    loadMore,
  };
}

export type { SidebarFilterKey };

// ─── Auxiliary product hooks (used across storefront) ─────────────────────────

export function useProductsByLimit(limit: number, params: ProductsParams = {}) {
  return useQuery({
    queryKey: ['products', 'limit', limit, params],
    queryFn: async () => {
      const res = await apiGetProducts({ ...params, limit, page: 1 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useQuizCatalogProducts(enabled = true) {
  return useQuery({
    queryKey: ['products', 'quiz-catalog'],
    queryFn: async () => {
      const res = await apiGetProducts({ limit: 100, page: 1 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const res = await apiGetProducts({ search: query, limit: 8, page: 1 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}

export function useProductsByIds(ids: string[]) {
  const stableKey = ids.slice().sort().join(',');
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'byIds', stableKey],
    queryFn: async () => {
      if (!ids.length) return [];
      const res = await apiGetProducts({ limit: 100, page: 1 });
      if (!res.success || !res.data?.items) return [];
      const idSet = new Set(ids);
      return adaptProducts(res.data.items).filter((p) => idSet.has(p.id));
    },
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  return { products, isLoading };
}

export function useApiProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      const res = await apiGetProductBySlug(slug);
      if (!res.success || !res.data) return null;
      return adaptProduct(res.data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['products', productId, 'reviews'],
    queryFn: async () => {
      const res = await apiGetProductReviews(productId);
      if (!res.success || !res.data) return [];
      return adaptReviews(res.data);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}
