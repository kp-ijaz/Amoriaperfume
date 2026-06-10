'use client';

import { useQuery } from '@tanstack/react-query';
import {
  apiGetPublicBootstrap,
  apiGetPublicCoverImages,
  apiGetPublicHomepageSections,
  apiGetPublicHomeSlots,
  apiGetPublicHomeSlotByKey,
  apiGetPublicPage,
  apiGetPublicBlogPosts,
  PublicCoverImage,
  PublicHomepageSection,
  PublicPlatformSnippet,
} from '@/lib/api/public';
import { apiGetProducts } from '@/lib/api/client';
import { adaptProduct, adaptProducts } from '@/lib/api/adapters';
import { ApiProduct } from '@/lib/api/types';
import { Product } from '@/types/product';

export const publicCmsKeys = {
  bootstrap: ['public', 'bootstrap'] as const,
  coverImages: (bannerType?: string) => ['public', 'cover-images', bannerType] as const,
  homepageSections: ['public', 'homepage-sections'] as const,
  homeSlots: ['public', 'home-slots'] as const,
  homeSlot: (key: string) => ['public', 'home-slot', key] as const,
  page: (slug: string) => ['public', 'page', slug] as const,
  blog: ['public', 'blog'] as const,
};

export function usePublicBootstrap() {
  return useQuery({
    queryKey: publicCmsKeys.bootstrap,
    queryFn: async () => {
      const res = await apiGetPublicBootstrap();
      if (!res.success || !res.data) throw new Error(res.message ?? 'Failed to load storefront');
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePublicCoverImages(bannerType?: string) {
  return useQuery({
    queryKey: publicCmsKeys.coverImages(bannerType),
    queryFn: async (): Promise<PublicCoverImage[]> => {
      const res = await apiGetPublicCoverImages(
        bannerType ? { banner_type: bannerType } : undefined
      );
      if (!res.success) {
        throw new Error(res.message ?? 'Failed to load banners');
      }
      if (!Array.isArray(res.data)) return [];
      const { resolveCmsMediaUrl } = await import('@/lib/utils/cmsMediaUrl');
      return res.data
        .filter((b) => b.imageUrl)
        .map((b) => ({
          ...b,
          imageUrl: resolveCmsMediaUrl(b.imageUrl),
          thumbnailUrl: b.thumbnailUrl ? resolveCmsMediaUrl(b.thumbnailUrl) : b.thumbnailUrl,
        }));
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
}

/** Single request for hero carousel + side panels (avoids duplicate storefront resolution). */
export function useHeroCoverImages() {
  return useQuery({
    queryKey: ['public', 'cover-images', 'hero-bundle'],
    queryFn: async () => {
      const res = await apiGetPublicCoverImages();
      if (!res.success) {
        throw new Error(res.message ?? 'Failed to load hero banners');
      }
      const { resolveCmsMediaUrl } = await import('@/lib/utils/cmsMediaUrl');
      const all = (Array.isArray(res.data) ? res.data : [])
        .filter((b) => b.imageUrl && b.enabled !== false)
        .map((b) => ({
          ...b,
          imageUrl: resolveCmsMediaUrl(b.imageUrl),
          thumbnailUrl: b.thumbnailUrl ? resolveCmsMediaUrl(b.thumbnailUrl) : b.thumbnailUrl,
        }));
      return {
        sliders: all.filter((b) => b.banner_type === 'home_slider'),
        sidePanels: all.filter((b) => b.banner_type === 'hero_side_panel'),
      };
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function usePublicHomepageSections() {
  return useQuery({
    queryKey: publicCmsKeys.homepageSections,
    queryFn: async (): Promise<PublicHomepageSection[]> => {
      const res = await apiGetPublicHomepageSections();
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePublicHomeSlots() {
  return useQuery({
    queryKey: publicCmsKeys.homeSlots,
    queryFn: async () => {
      const res = await apiGetPublicHomeSlots();
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

/** Max products shown per homepage product row (New Arrivals, Best Sellers, etc.). */
export const HOME_PRODUCTS_PER_ROW = 4;

export type HomeSlotFallbackParams = {
  limit?: number;
  featured?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  limitedOffer?: boolean;
  sort?: 'newest';
};

export function useHomeSlotProducts(
  slotKey: string,
  fallbackParams: HomeSlotFallbackParams = {}
) {
  const limit = fallbackParams.limit ?? HOME_PRODUCTS_PER_ROW;
  return useQuery({
    queryKey: [...publicCmsKeys.homeSlot(slotKey), 'products', fallbackParams],
    queryFn: async (): Promise<{ title: string; subtitle?: string; products: Product[] }> => {
      try {
        const slotRes = await apiGetPublicHomeSlotByKey(slotKey);
        if (slotRes.success && slotRes.data) {
          const slot = slotRes.data;
          const ids = (slot.productIds ?? [])
            .map((p) => (typeof p === 'string' ? p : (p as { _id?: string })?._id))
            .filter(Boolean) as string[];
          if (ids.length > 0) {
            const { apiGetProduct } = await import('@/lib/api/client');
            const fetched = await Promise.all(
              ids.slice(0, limit).map(async (id) => {
                const pr = await apiGetProduct(id);
                if (pr.success && pr.data) return adaptProduct(pr.data);
                return null;
              })
            );
            const valid = fetched.filter((p): p is Product => p != null);
            if (valid.length > 0) {
              return {
                title: slot.title,
                subtitle: slot.subtitle,
                products: valid.slice(0, limit),
              };
            }
          }
        }
      } catch {
        /* fall through */
      }
      const res = await apiGetProducts({
        limit,
        featured: fallbackParams.featured,
        bestSeller: fallbackParams.bestSeller,
        trending: fallbackParams.trending,
        newArrival: fallbackParams.newArrival,
        limitedOffer: fallbackParams.limitedOffer,
        sort:
          !fallbackParams.newArrival &&
          !fallbackParams.bestSeller &&
          !fallbackParams.trending &&
          !fallbackParams.limitedOffer &&
          !fallbackParams.featured &&
          fallbackParams.sort === 'newest'
            ? 'newest'
            : undefined,
      });
      if (!res.success || !res.data?.items) return { title: '', products: [] };
      return { title: '', products: adaptProducts(res.data.items).slice(0, limit) };
    },
    staleTime: 60 * 1000,
  });
}

export function useHomepageSectionConfig<T>(type: string, fallback: T): T {
  const { data: sections = [] } = usePublicHomepageSections();
  const section = sections.find((s) => s.type === type);
  return (section?.config as T) ?? fallback;
}

export type TestimonialItem = { name: string; location: string; rating: number; text: string };

export function useTestimonials() {
  const config = useHomepageSectionConfig<{ items?: TestimonialItem[] }>('testimonials', { items: [] });
  return config.items?.filter((i) => i.name?.trim() && i.text?.trim()) ?? [];
}

export type NewsletterConfig = { title?: string; subtitle?: string; buttonLabel?: string };

export function useNewsletterConfig(): NewsletterConfig {
  return useHomepageSectionConfig<NewsletterConfig>('newsletter', {});
}

export function usePlatformAnnouncement(): PublicPlatformSnippet | null {
  const { data } = usePublicBootstrap();
  return data?.platform ?? null;
}

export function usePublicContentPage(slug: string) {
  return useQuery({
    queryKey: publicCmsKeys.page(slug),
    queryFn: async () => {
      const res = await apiGetPublicPage(slug);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Page not found');
      return res.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicBlogPosts() {
  return useQuery({
    queryKey: publicCmsKeys.blog,
    queryFn: async () => {
      const res = await apiGetPublicBlogPosts();
      if (!res.success || !Array.isArray(res.data)) return [];
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
