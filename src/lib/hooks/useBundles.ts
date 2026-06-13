'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetBundleBySlug, apiGetBundles } from '@/lib/api/client';
import { ApiBundle } from '@/lib/api/types';
import { resolveCmsMediaUrl } from '@/lib/utils/cmsMediaUrl';

export const bundleKeys = {
  all: ['bundles'] as const,
  list: ['bundles', 'list'] as const,
  detail: (slug: string) => ['bundles', 'detail', slug] as const,
};

function normalizeBundle(bundle: ApiBundle): ApiBundle {
  const images = normalizePackageImages(bundle.images, bundle.coverImage);
  return {
    ...bundle,
    images,
    coverImage: images[0] ?? (bundle.coverImage ? resolveCmsMediaUrl(bundle.coverImage) : bundle.coverImage),
  };
}

function normalizePackageImages(images?: string[] | null, coverImage?: string | null) {
  const resolved = (images ?? []).map((url) => resolveCmsMediaUrl(url)).filter(Boolean);
  if (resolved.length) return resolved;
  const cover = resolveCmsMediaUrl(coverImage);
  return cover ? [cover] : [];
}

export function useBundles() {
  return useQuery({
    queryKey: bundleKeys.list,
    queryFn: async (): Promise<ApiBundle[]> => {
      const res = await apiGetBundles();
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data.map(normalizeBundle);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBundleBySlug(slug: string) {
  return useQuery({
    queryKey: bundleKeys.detail(slug),
    queryFn: async (): Promise<ApiBundle | null> => {
      const res = await apiGetBundleBySlug(slug);
      if (!res.success || !res.data) return null;
      return normalizeBundle(res.data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
