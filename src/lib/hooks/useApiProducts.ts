'use client';

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  apiGetProducts,
  apiGetProduct,
  apiGetProductBySlug,
  apiGetProductReviews,
  apiCreateProductReview,
  ProductsParams,
} from '@/lib/api/client';
import { adaptProducts, adaptProduct, adaptReviews } from '@/lib/api/adapters';
import { Product } from '@/types/product';
import { useAuth } from '@/lib/hooks/useAuth';

// ─── Keys ────────────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductsParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  slug: (slug: string) => ['products', 'slug', slug] as const,
  reviews: (id: string) => ['products', 'reviews', id] as const,
  section: (params: ProductsParams) => ['products', 'section', params] as const,
};

// ─── Sorting & Filtering (client-side, used by PLP) ──────────────────────────

export type ApiSortOption =
  | 'newest'
  | 'bestsellers'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'most-reviewed';

export interface ApiProductFilters {
  categories?: string[];
  brands?: string[];
  categorySlug?: string;
  brandSlug?: string;
  genders?: string[];
  priceRange?: [number, number];
  fragranceFamilies?: string[];
  discountOnly?: boolean;
  minRating?: number;
  concentrations?: string[];
  searchQuery?: string;
  collection?: string;
  featured?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  limitedOffer?: boolean;
  /** When set, product order comes from the API (e.g. most_viewed). */
  serverSort?: 'most_viewed';
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface AvailableProductFilters {
  categories: FilterOption[];
  brands: FilterOption[];
  genders: FilterOption[];
  fragranceFamilies: FilterOption[];
  concentrations: FilterOption[];
}

const GENDER_LABELS: Record<string, string> = {
  men: "Men's",
  women: "Women's",
  unisex: 'Unisex',
};

function getSortedProducts(products: Product[], sortBy: ApiSortOption): Product[] {
  const arr = [...products];
  switch (sortBy) {
    case 'price-asc':
      return arr.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pa - pb;
      });
    case 'price-desc':
      return arr.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pb - pa;
      });
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'most-reviewed':
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'bestsellers':
      return arr.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
    case 'newest':
    default:
      return arr.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
  }
}

function applyClientFilters(products: Product[], filters: ApiProductFilters): Product[] {
  let result = [...products];
  if (filters.categories?.length) result = result.filter((p) => filters.categories!.includes(p.category));
  if (filters.brands?.length) result = result.filter((p) => filters.brands!.includes(p.brand));
  if (filters.genders?.length) result = result.filter((p) => filters.genders!.includes(p.gender));
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((p) => {
      const price = p.variants[0]?.salePrice ?? p.variants[0]?.price ?? 0;
      return price >= min && price <= max;
    });
  }
  if (filters.fragranceFamilies?.length) {
    result = result.filter((p) =>
      filters.fragranceFamilies!.some((f) => p.fragranceFamily.toLowerCase().includes(f.toLowerCase()))
    );
  }
  if (filters.discountOnly) result = result.filter((p) => p.isOnSale);
  if (filters.minRating) result = result.filter((p) => p.rating >= filters.minRating!);
  if (filters.concentrations?.length) {
    result = result.filter((p) =>
      filters.concentrations!.some((c) => p.concentration.toLowerCase() === c.toLowerCase())
    );
  }
  return result;
}

function buildFacetOptions(
  allValuesSource: Product[],
  countedSource: Product[],
  getValue: (p: Product) => string,
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
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return Array.from(allValues)
    .map((v) => ({ value: v, label: getLabel ? getLabel(v) : v, count: counts.get(v) ?? 0 }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ─── Home page sections ───────────────────────────────────────────────────────

/**
 * Fetch products for a home-page section.
 * The query key is keyed on params only (not limit) so multiple components
 * with the same params share a single API call via React Query's cache.
 * The limit is applied client-side as a slice.
 */
export function useProductsByLimit(limit = 8, params: ProductsParams = {}) {
  // Strip limit from the cache key so same-param callers share one request
  const { limit: _ignored, ...cacheParams } = params as ProductsParams & { limit?: number };

  return useQuery({
    queryKey: productKeys.section(cacheParams),
    queryFn: async () => {
      const res = await apiGetProducts({ ...cacheParams, limit: 20 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 10 * 60 * 1000,
    select: (data) => data.slice(0, limit),
  });
}

// ─── PLP — all products with client-side filtering ───────────────────────────

export function useApiProducts(initialFilters: ApiProductFilters = {}) {
  const [filters, setFilters] = useState<ApiProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<ApiSortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  const serverParams: ProductsParams = useMemo(() => ({
    limit: 100,
    search: filters.searchQuery || undefined,
    categorySlug: filters.categorySlug || undefined,
    brandSlug: filters.brandSlug || undefined,
    collection: filters.collection || undefined,
    featured: filters.featured,
    bestSeller: filters.bestSeller,
    trending: filters.trending,
    newArrival: filters.newArrival,
    limitedOffer: filters.limitedOffer,
    sort: filters.serverSort,
  }), [
    filters.searchQuery,
    filters.categorySlug,
    filters.brandSlug,
    filters.collection,
    filters.featured,
    filters.bestSeller,
    filters.trending,
    filters.newArrival,
    filters.limitedOffer,
    filters.serverSort,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.list(serverParams),
    queryFn: async () => {
      const res = await apiGetProducts(serverParams);
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = data ?? [];

  const availableFilters = useMemo<AvailableProductFilters>(() => ({
    categories: buildFacetOptions(allProducts, applyClientFilters(allProducts, { ...filters, categories: undefined }), (p) => p.category),
    brands:     buildFacetOptions(allProducts, applyClientFilters(allProducts, { ...filters, brands: undefined }),     (p) => p.brand),
    genders:    buildFacetOptions(allProducts, applyClientFilters(allProducts, { ...filters, genders: undefined }),    (p) => p.gender, (v) => GENDER_LABELS[v] ?? v),
    fragranceFamilies: buildFacetOptions(allProducts, applyClientFilters(allProducts, { ...filters, fragranceFamilies: undefined }), (p) => p.fragranceFamily),
    concentrations:    buildFacetOptions(allProducts, applyClientFilters(allProducts, { ...filters, concentrations: undefined }),    (p) => p.concentration),
  }), [allProducts, filters]);

  const filtered = useMemo(() => {
    const applied = applyClientFilters(allProducts, filters);
    if (filters.serverSort) return applied;
    return getSortedProducts(applied, sortBy);
  }, [allProducts, filters, sortBy]);

  return {
    products: filtered.slice(0, visibleCount),
    totalCount: filtered.length,
    hasMore: visibleCount < filtered.length,
    isLoading,
    error,
    filters,
    availableFilters,
    sortBy,
    setFilters,
    updateFilter: <K extends keyof ApiProductFilters>(key: K, value: ApiProductFilters[K]) =>
      setFilters((prev) => ({ ...prev, [key]: value })),
    clearFilters: () => setFilters({}),
    setSortBy,
    loadMore: () => setVisibleCount((prev) => prev + 12),
  };
}

// ─── Single product ───────────────────────────────────────────────────────────

export function useApiProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await apiGetProduct(id);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Not found');
      return adaptProduct(res.data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useApiProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: async () => {
      const res = await apiGetProductBySlug(slug);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Not found');
      return adaptProduct(res.data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: async () => {
      const res = await apiGetProductReviews(productId);
      if (!res.success) return [];
      return adaptReviews(Array.isArray(res.data) ? res.data : []);
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      if (!token) throw new Error('Please sign in to submit a review.');
      return apiCreateProductReview(productId, data, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.reviews(productId) });
      qc.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

// ─── Multiple products by ID (wishlist / recently viewed) ────────────────────

export function useProductsByIds(ids: string[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: productKeys.detail(id),
      queryFn: async () => {
        const res = await apiGetProduct(id);
        if (!res.success || !res.data) return null;
        return adaptProduct(res.data);
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!id,
    })),
  });

  const products = results.map((r) => r.data).filter((p): p is Product => p != null);
  const isLoading = results.some((r) => r.isLoading) && products.length === 0;
  return { products, isLoading };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const res = await apiGetProducts({ search: query, limit: 5 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

// ─── Featured (kept for backward compat) ─────────────────────────────────────

export function useFeaturedProducts(limit = 8) {
  return useProductsByLimit(limit, { featured: true });
}
