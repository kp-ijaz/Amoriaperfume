'use client';

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  apiGetProducts,
  apiGetProduct,
  apiGetProductReviews,
  apiCreateProductReview,
  ProductsParams,
} from '@/lib/api/client';
import { adaptProducts, adaptProduct, adaptReviews } from '@/lib/api/adapters';
import { Product } from '@/types/product';

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
  categories?: string[];   // category _id values
  brands?: string[];       // brand _id values
  genders?: string[];
  priceRange?: [number, number];
  fragranceFamilies?: string[];
  discountOnly?: boolean;
  minRating?: number;
  concentrations?: string[];
  searchQuery?: string;
}

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

/** Fetch all products (up to 100) and filter/sort client-side. */
export function useApiProducts(initialFilters: ApiProductFilters = {}) {
  const [filters, setFilters] = useState<ApiProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<ApiSortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  // Build server-side params from filters
  const serverParams: ProductsParams = useMemo(() => ({
    limit: 100,
    search: filters.searchQuery || undefined,
    category: filters.categories?.[0],
    brand: filters.brands?.[0],
  }), [filters.searchQuery, filters.categories, filters.brands]);

  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.list(serverParams),
    queryFn: () => apiGetProducts(serverParams),
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = useMemo(() => {
    if (!data?.data?.items) return [];
    return adaptProducts(data.data.items);
  }, [data]);

  // Client-side filtering for fields not supported by the server
  const filtered = useMemo(() => {
    let result = [...allProducts];

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
        filters.fragranceFamilies!.some((f) =>
          p.fragranceFamily.toLowerCase().includes(f.toLowerCase())
        )
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
        filters.concentrations!.some(
          (c) => p.concentration.toLowerCase() === c.toLowerCase()
        )
      );
    }

    return getSortedProducts(result, sortBy);
  }, [allProducts, filters, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return {
    products: visible,
    totalCount: filtered.length,
    hasMore,
    isLoading,
    error,
    filters,
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
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      apiCreateProductReview(productId, data),
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
