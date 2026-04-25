'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetBrands, apiGetBrand } from '@/lib/api/client';
import { adaptBrands, adaptBrand } from '@/lib/api/adapters';

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

/** Find a brand by its slug from the full brands list. */
export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: ['brands', 'slug', slug],
    queryFn: async () => {
      const res = await apiGetBrands();
      if (!res.success || !Array.isArray(res.data)) return null;
      const found = res.data.find((b) => b.slug === slug);
      return found ? adaptBrand(found) : null;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
}
