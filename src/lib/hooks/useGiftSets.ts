'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetGiftSetBySlug, apiGetGiftSets } from '@/lib/api/client';
import { ApiGiftSet, ApiGiftSetOccasion } from '@/lib/api/types';
import { resolveCmsMediaUrl } from '@/lib/utils/cmsMediaUrl';

export const giftSetKeys = {
  all: ['gift-sets'] as const,
  list: (occasion?: ApiGiftSetOccasion) => ['gift-sets', 'list', occasion ?? 'all'] as const,
  detail: (slug: string) => ['gift-sets', 'detail', slug] as const,
};

function normalizePackageImages(images?: string[] | null, coverImage?: string | null) {
  const resolved = (images ?? []).map((url) => resolveCmsMediaUrl(url)).filter(Boolean);
  if (resolved.length) return resolved;
  const cover = resolveCmsMediaUrl(coverImage);
  return cover ? [cover] : [];
}

function normalizeGiftSet(giftSet: ApiGiftSet): ApiGiftSet {
  const images = normalizePackageImages(giftSet.images, giftSet.coverImage);
  return {
    ...giftSet,
    images,
    coverImage: images[0] ?? resolveCmsMediaUrl(giftSet.coverImage),
  };
}

export function useGiftSets(occasion?: ApiGiftSetOccasion) {
  return useQuery({
    queryKey: giftSetKeys.list(occasion),
    queryFn: async (): Promise<ApiGiftSet[]> => {
      const res = await apiGetGiftSets(occasion);
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data.map(normalizeGiftSet);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGiftSetBySlug(slug: string) {
  return useQuery({
    queryKey: giftSetKeys.detail(slug),
    queryFn: async (): Promise<ApiGiftSet | null> => {
      const res = await apiGetGiftSetBySlug(slug);
      if (!res.success || !res.data) return null;
      return normalizeGiftSet(res.data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
