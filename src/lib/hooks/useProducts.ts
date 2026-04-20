'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { products as allProducts } from '@/lib/data/products';

export type SortOption =
  | 'newest'
  | 'bestsellers'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'most-reviewed';

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  genders?: string[];
  priceRange?: [number, number];
  fragranceFamilies?: string[];
  discountOnly?: boolean;
  minRating?: number;
  concentrations?: string[];
  searchQuery?: string;
}

function getProductPrice(product: Product): number {
  const primaryVariant = product.variants[0];
  return primaryVariant?.salePrice ?? primaryVariant?.price ?? 0;
}

export function useProducts(initialProducts?: Product[]) {
  const base = initialProducts ?? allProducts;
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    let result = [...base];

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.categories?.length) {
      result = result.filter((p) =>
        filters.categories!.some(
          (c) => p.category.toLowerCase() === c.toLowerCase()
        )
      );
    }

    if (filters.brands?.length) {
      result = result.filter((p) =>
        filters.brands!.some((b) => p.brand.toLowerCase() === b.toLowerCase())
      );
    }

    if (filters.genders?.length) {
      result = result.filter((p) => filters.genders!.includes(p.gender));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => {
        const price = getProductPrice(p);
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

    // Sort
    switch (sortBy) {
      case 'bestsellers':
        result = result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case 'price-asc':
        result = result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        break;
      case 'price-desc':
        result = result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        break;
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case 'most-reviewed':
        result = result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result = result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
    }

    return result;
  }, [base, filters, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return {
    products: visible,
    totalCount: filtered.length,
    hasMore,
    filters,
    sortBy,
    setFilters,
    updateFilter: (key: keyof ProductFilters, value: ProductFilters[typeof key]) =>
      setFilters((prev) => ({ ...prev, [key]: value })),
    clearFilters: () => setFilters({}),
    setSortBy,
    loadMore: () => setVisibleCount((prev) => prev + 12),
  };
}
