'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetCollections } from '@/lib/api/client';
import { ApiCollection } from '@/lib/api/types';

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<ApiCollection[]> => {
      const res = await apiGetCollections();
      if (!res.success || !Array.isArray(res.data)) return [];
      return (res.data as ApiCollection[]).filter((c) => c.active);
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useCollection(slug: string) {
  return useQuery({
    queryKey: ['collections', slug],
    queryFn: async (): Promise<ApiCollection | null> => {
      const res = await apiGetCollections(slug);
      const items = Array.isArray(res.data) ? res.data : [];
      return (items as ApiCollection[]).find((c) => c.slug === slug) ?? null;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
}
