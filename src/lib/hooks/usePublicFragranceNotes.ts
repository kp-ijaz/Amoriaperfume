'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetPublicFragranceNotes } from '@/lib/api/public';

export function usePublicFragranceNotes(search?: string) {
  return useQuery({
    queryKey: ['public-fragrance-notes', search ?? ''],
    queryFn: async () => {
      const res = await apiGetPublicFragranceNotes({ search, limit: 80 });
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data;
    },
    staleTime: 15 * 60 * 1000,
  });
}
