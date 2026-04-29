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
  reviews: (id: string) => ['products', 'reviews', id] as const,
};

// ─── Product list with client-side filtering + sort ──────────────────────────

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

  if (filters.categories?.length) {
    result = result.filter((p) => filters.categories!.includes(p.category));
  }
  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand));
  }
  if (filters.genders?.length) {
    result = result.filter((p) => filters.genders!.includes(p.gender));
  }
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
  if (filters.discountOnly) {
    result = result.filter((p) => p.isOnSale);
  }
  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }
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
  getValue: (product: Product) => string,
  getLabel?: (value: string) => string
): FilterOption[] {
  const allValues = new Set<string>();
  for (const product of allValuesSource) {
    const value = getValue(product);
    if (value) allValues.add(value);
  }

  const counts = new Map<string, number>();
  for (const product of countedSource) {
    const value = getValue(product);
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(allValues)
    .map((value) => ({
      value,
      label: getLabel ? getLabel(value) : value,
      count: counts.get(value) ?? 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Fetch all products (up to 100) and filter/sort client-side. */
export function useApiProducts(initialFilters: ApiProductFilters = {}) {
  const [filters, setFilters] = useState<ApiProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<ApiSortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  // Build server-side params from filters
  const serverParams: ProductsParams = useMemo(() => ({
    limit: 100,
    search: filters.searchQuery || undefined,
    categorySlug: filters.categorySlug || undefined,
    brandSlug: filters.brandSlug || undefined,
    collection: filters.collection || undefined,
  }), [filters.searchQuery, filters.categorySlug, filters.brandSlug, filters.collection]);

  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.list(serverParams),
    queryFn: () => apiGetProducts(serverParams),
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = useMemo(() => {
    if (!data?.data?.items) return [];
    return adaptProducts(data.data.items);
  }, [data]);

  const contextProducts = allProducts;

  const availableFilters = useMemo<AvailableProductFilters>(() => {
    const withoutCategory = applyClientFilters(contextProducts, { ...filters, categories: undefined });
    const withoutBrand = applyClientFilters(contextProducts, { ...filters, brands: undefined });
    const withoutGender = applyClientFilters(contextProducts, { ...filters, genders: undefined });
    const withoutFamily = applyClientFilters(contextProducts, { ...filters, fragranceFamilies: undefined });
    const withoutConcentration = applyClientFilters(contextProducts, { ...filters, concentrations: undefined });

    return {
      categories: buildFacetOptions(contextProducts, withoutCategory, (p) => p.category),
      brands: buildFacetOptions(contextProducts, withoutBrand, (p) => p.brand),
      genders: buildFacetOptions(contextProducts, withoutGender, (p) => p.gender, (v) => GENDER_LABELS[v] ?? v),
      fragranceFamilies: buildFacetOptions(contextProducts, withoutFamily, (p) => p.fragranceFamily),
      concentrations: buildFacetOptions(contextProducts, withoutConcentration, (p) => p.concentration),
    };
  }, [contextProducts, filters]);

  // Client-side filtering
  const filtered = useMemo(() => {
    const result = applyClientFilters(contextProducts, filters);
    return getSortedProducts(result, sortBy);
  }, [contextProducts, filters, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return {
    products: visible,
    totalCount: filtered.length,
    hasMore,
    isLoading,
    error,
    filters,
    availableFilters,
    sortBy,
    setFilters,
    updateFilter: <K extends keyof ApiProductFilters>(
      key: K,
      value: ApiProductFilters[K]
    ) => setFilters((prev) => ({ ...prev, [key]: value })),
    clearFilters: () => setFilters({}),
    setSortBy,
    loadMore: () => setVisibleCount((prev) => prev + 12),
  };
}

/** Fetch a single product by MongoDB _id. */
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

/** Fetch a single product by slug. */
export function useApiProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', 'detail-slug', slug],
    queryFn: async () => {
      const res = await apiGetProductBySlug(slug);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Not found');
      return adaptProduct(res.data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch reviews for a product. */
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

/** Create a review for a product. */
export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      if (!token) {
        throw new Error('Please sign in to submit a review.');
      }
      return apiCreateProductReview(productId, data, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.reviews(productId) });
      qc.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

/** Fetch featured products for home page sections. */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const res = await apiGetProducts({ featured: true, limit });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch products for a specific section (no featured filter needed). */
export function useProductsByLimit(limit = 8, params: ProductsParams = {}) {
  return useQuery({
    queryKey: ['products', 'section', limit, params],
    queryFn: async () => {
      const res = await apiGetProducts({ limit, ...params });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch multiple products by their MongoDB _ids (for wishlist / recently viewed). */
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

  const products = results
    .map((r) => r.data)
    .filter((p): p is Product => p !== null && p !== undefined);
  const isLoading = results.some((r) => r.isLoading) && products.length === 0;

  return { products, isLoading };
}

/** Search products via API — pass a debounced query string, enabled when length >= 2. */
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
