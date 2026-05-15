'use client';

import { useMemo } from 'react';
import { products as allProducts } from '@/lib/data/products';
import { Product } from '@/types/product';
import { ProductSection } from './ProductSection';

interface StaticProductSectionProps {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  theme?: 'light' | 'dark';
  sectionNumber?: string;
  limit?: number;
  columns?: 2 | 3 | 4 | 5;
  filter?: {
    gender?: 'men' | 'women' | 'unisex';
    category?: string;
    isNewArrival?: boolean;
    isBestseller?: boolean;
    isFeatured?: boolean;
    isOnSale?: boolean;
    tag?: string;
    minPrice?: number;
  };
  sortBy?: 'reviewCount' | 'price-desc' | 'price-asc' | 'rating';
}

export function StaticProductSection({
  title,
  subtitle,
  viewAllHref,
  theme = 'light',
  sectionNumber = '01',
  limit = 8,
  columns = 4,
  filter = {},
  sortBy,
}: StaticProductSectionProps) {
  const filtered = useMemo<Product[]>(() => {
    let result = [...allProducts];

    if (filter.gender) {
      // Exact gender match to keep Men's and Women's sections distinct
      result = result.filter((p) => p.gender === filter.gender);
    }
    if (filter.category) {
      result = result.filter((p) =>
        p.category.toLowerCase().includes(filter.category!.toLowerCase())
      );
    }
    if (filter.isNewArrival) {
      result = result.filter((p) => p.isNewArrival);
    }
    if (filter.isBestseller) {
      result = result.filter((p) => p.isBestseller);
    }
    if (filter.isFeatured) {
      result = result.filter((p) => p.isFeatured);
    }
    if (filter.isOnSale) {
      result = result.filter((p) => p.isOnSale);
    }
    if (filter.tag) {
      result = result.filter((p) => p.tags?.includes(filter.tag!));
    }
    if (filter.minPrice !== undefined) {
      result = result.filter((p) => {
        const price = p.variants[0]?.salePrice ?? p.variants[0]?.price ?? 0;
        return price >= filter.minPrice!;
      });
    }

    // Sort
    if (sortBy === 'reviewCount') {
      result = result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-desc') {
      result = result.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pb - pa;
      });
    } else if (sortBy === 'price-asc') {
      result = result.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pa - pb;
      });
    } else if (sortBy === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    }

    return result.slice(0, limit);
  }, [filter, limit, sortBy]);

  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={filtered}
      viewAllHref={viewAllHref}
      showSkeleton={false}
      theme={theme}
      sectionNumber={sectionNumber}
      columns={columns}
    />
  );
}
