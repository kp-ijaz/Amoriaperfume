'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGetBrands, apiGetBrand, apiGetBrandBySlug } from '@/lib/api/client';
import { adaptBrands, adaptBrand, brandDisplayImage } from '@/lib/api/adapters';

/** Max brands in the homepage “Shop by Brands” row (matches desktop grid columns). */
export const HOME_BRANDS_ROW_LIMIT = 4;

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await apiGetBrands();
      if (!res.success || !Array.isArray(res.data)) return [];
      return adaptBrands(res.data.filter((b) => b.active));
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: async () => {
      const res = await apiGetBrand(id);
      if (!res.success || !res.data) return null;
      return adaptBrand(res.data);
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: ['brands', 'slug', slug],
    queryFn: async () => {
      const res = await apiGetBrandBySlug(slug);
      if (!res.success || !res.data) return null;
      return adaptBrand(res.data);
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
}

export type HomeBrandTile = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  count: string;
  image: string;
  accent: string;
};

/** Homepage brand row — uses API `productCoverImage` per brand, falls back to logo. */
export function useHomeBrandsRow() {
  const { data: apiBrands = [], isLoading } = useBrands();

  const brands = useMemo((): HomeBrandTile[] => {
    return apiBrands.slice(0, HOME_BRANDS_ROW_LIMIT).map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      tagline: b.description?.slice(0, 40) || 'Explore',
      count: '',
      image: brandDisplayImage(b) || '',
      accent: '#C9A84C',
    }));
  }, [apiBrands]);

  return { brands, isLoading };
}
