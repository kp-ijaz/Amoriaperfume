'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetCategories } from '@/lib/api/client';
import { adaptCategories } from '@/lib/api/adapters';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiGetCategories();
      if (!res.success || !res.data?.items) return [];
      return adaptCategories(res.data.items.filter((c) => c.status === 'active'));
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const res = await apiGetCategories(slug);
      const item = res.data?.items?.[0];
      if (!item) return null;
      return { id: item._id, slug: item.slug, name: item.name, image: item.image, description: item.description };
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
}
