'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  apiGetPublicBootstrap,
  apiGetPublicCoverImages,
  apiGetPublicHomepageSections,
  apiGetPublicHomeSlots,
  apiGetPublicPage,
  apiGetPublicBlogPosts,
  apiGetPublicOfferPopup,
  PublicCoverImage,
  PublicHomepageSection,
  PublicPlatformSnippet,
} from '@/lib/api/public';
import { apiGetProducts } from '@/lib/api/client';
import { adaptProducts } from '@/lib/api/adapters';
import { ApiProduct } from '@/lib/api/types';
import { Product } from '@/types/product';
import type { HeroCoverBundle } from '@/lib/utils/heroCoverImages';
import { OfferPopupConfig } from '@/lib/pricing/offerPopupPricing';
import {
  formatPromoStripMessage,
  formatUtilityBarTickerText,
  isPromotionDisplayable,
  parseLegacyPromoStripText,
  type PromoStripPromotion,
} from '@/lib/homepage/promoStripMessage';
import { useLanguage } from '@/lib/context/LanguageContext';

export const publicCmsKeys = {
  bootstrap: ['public', 'bootstrap'] as const,
  coverImages: (bannerType?: string) => ['public', 'cover-images', bannerType] as const,
  homepageSections: ['public', 'homepage-sections'] as const,
  homeSlots: ['public', 'home-slots'] as const,
  homeSlot: (key: string) => ['public', 'home-slot', key] as const,
  page: (slug: string) => ['public', 'page', slug] as const,
  blog: ['public', 'blog'] as const,
  offerPopup: ['public', 'offer-popup'] as const,
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
          mobileImageUrl: b.mobileImageUrl ? resolveCmsMediaUrl(b.mobileImageUrl) : b.mobileImageUrl,
          thumbnailUrl: b.thumbnailUrl ? resolveCmsMediaUrl(b.thumbnailUrl) : b.thumbnailUrl,
        }));
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
}

/** Single request for hero carousel + side panels (avoids duplicate storefront resolution). */
export function useHeroCoverImages(initialData?: HeroCoverBundle) {
  return useQuery({
    queryKey: ['public', 'cover-images', 'hero-bundle'],
    queryFn: async () => {
      const res = await apiGetPublicCoverImages();
      if (!res.success) {
        throw new Error(res.message ?? 'Failed to load hero banners');
      }
      const { processHeroCoverImages } = await import('@/lib/utils/heroCoverImages');
      return processHeroCoverImages(Array.isArray(res.data) ? res.data : []);
    },
    initialData,
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
  brandInspiration?: boolean;
  sort?: 'newest';
};

function extractSlotProductIds(productIds: unknown[]): string[] {
  return productIds
    .map((p) => (typeof p === 'string' ? p : (p as { _id?: string })?._id))
    .filter(Boolean) as string[];
}

function filterProductsByFallback(
  products: Product[],
  params: HomeSlotFallbackParams
): Product[] {
  const limit = params.limit ?? HOME_PRODUCTS_PER_ROW;
  let list = products;
  if (params.newArrival) list = list.filter((p) => p.isNewArrival);
  if (params.bestSeller) list = list.filter((p) => p.isBestseller);
  if (params.trending) list = list.filter((p) => p.isTrending);
  if (params.limitedOffer) list = list.filter((p) => p.isLimitedOffer);
  if (params.featured) list = list.filter((p) => p.isFeatured);
  if (params.brandInspiration) list = list.filter((p) => p.isBrandInspiration);
  return list.slice(0, limit);
}

/** Single catalog fetch shared by all homepage product rows. */
export function useHomepageProductPool() {
  return useQuery({
    queryKey: ['public', 'homepage-product-pool'],
    queryFn: async () => {
      const res = await apiGetProducts({ limit: 100, page: 1 });
      if (!res.success || !res.data?.items) return [];
      return adaptProducts(res.data.items);
    },
    staleTime: 60 * 1000,
  });
}

export function useHomeSlotProducts(
  slotKey: string,
  fallbackParams: HomeSlotFallbackParams = {}
) {
  const limit = fallbackParams.limit ?? HOME_PRODUCTS_PER_ROW;
  const { data: slots = [], isLoading: slotsLoading } = usePublicHomeSlots();
  const { data: pool = [], isLoading: poolLoading } = useHomepageProductPool();

  const data = useMemo((): { title: string; subtitle?: string; products: Product[] } => {
    const slot = slots.find((s) => s.key === slotKey && s.active !== false);

    if (slot?.productIds?.length) {
      const ids = extractSlotProductIds(slot.productIds);
      const curated = ids
        .map((id) => pool.find((p) => p.id === id))
        .filter((p): p is Product => p != null);
      if (curated.length > 0) {
        return {
          title: slot.title,
          subtitle: slot.subtitle,
          products: curated.slice(0, limit),
        };
      }
    }

    return {
      title: slot?.title ?? '',
      subtitle: slot?.subtitle,
      products: filterProductsByFallback(pool, { ...fallbackParams, limit }),
    };
  }, [
    slots,
    pool,
    slotKey,
    limit,
    fallbackParams.newArrival,
    fallbackParams.bestSeller,
    fallbackParams.trending,
    fallbackParams.limitedOffer,
    fallbackParams.featured,
    fallbackParams.brandInspiration,
  ]);

  return {
    data,
    isLoading: slotsLoading || poolLoading,
  };
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

export function usePlatformAnnouncement(): PublicPlatformSnippet | null {
  const { data } = usePublicBootstrap();
  return data?.platform ?? null;
}

export type PromoStripConfig = {
  promotionId?: string;
  headline?: string;
  ctaHref?: string;
  promotion?: PromoStripPromotion | null;
};

export type PromoStripDisplay = {
  message: string;
  code: string | null;
  ctaHref: string;
};

export function usePromoStripConfig(): PromoStripDisplay | null {
  const { data: bootstrap } = usePublicBootstrap();
  const sections = bootstrap?.homepageSections ?? [];
  const promoSection = sections.find((s) => s.type === 'promo_strip');
  const config = (promoSection?.config ?? {}) as PromoStripConfig;

  if (promoSection && config.promotionId) {
    const promo = config.promotion;
    if (!promo || !isPromotionDisplayable(promo)) return null;
    const { message, code } = formatPromoStripMessage(promo, config.headline);
    return {
      message,
      code,
      ctaHref: config.ctaHref?.trim() || '/products',
    };
  }

  const legacyText = bootstrap?.platform?.flashAnnouncementText?.trim();
  if (!legacyText) return null;
  const { message, code } = parseLegacyPromoStripText(legacyText);
  return { message, code, ctaHref: '/products' };
}

export type UtilityBarOfferDisplay = {
  text: string;
  color: string;
  href?: string;
};

export type UtilityBarLeftBadge = {
  icon?: string;
  text: string;
};

type UtilityBarLeftBadgeConfig = {
  enabled?: boolean;
  icon?: string;
  textEn?: string;
  textAr?: string;
};

type UtilityBarCustomTickerItemConfig = {
  textEn: string;
  textAr?: string;
  href?: string;
  color?: string;
};

export type UtilityBarDisplay = {
  enabled: boolean;
  leftBadge: UtilityBarLeftBadge | null;
  offers: UtilityBarOfferDisplay[];
  showStoreLocator: boolean;
  showStoreLocatorMap: boolean;
  showLanguageSwitcher: boolean;
};

const UTILITY_BAR_OFFER_COLORS = [
  '#dc2626',
  '#16a34a',
  'var(--color-amoria-accent)',
  '#7c3aed',
  '#ea580c',
];

function resolveBilingualText(
  lang: 'en' | 'ar',
  textEn?: string,
  textAr?: string,
): string {
  const en = textEn?.trim() ?? '';
  const ar = textAr?.trim() ?? '';
  if (lang === 'ar' && ar) return ar;
  return en;
}

export function useUtilityBarConfig(): UtilityBarDisplay {
  const { lang } = useLanguage();
  const { data: bootstrap } = usePublicBootstrap();
  const section = bootstrap?.homepageSections?.find((s) => s.type === 'utility_bar');
  const config = (section?.config ?? {}) as {
    promotionIds?: string[];
    promotions?: PromoStripPromotion[];
    leftBadge?: UtilityBarLeftBadgeConfig;
    customTickerItems?: UtilityBarCustomTickerItemConfig[];
    showStoreLocator?: boolean;
    showStoreLocatorMap?: boolean;
    showLanguageSwitcher?: boolean;
  };

  const sectionEnabled = section ? section.enabled !== false : true;

  const customOffers: UtilityBarOfferDisplay[] = (config.customTickerItems ?? []).flatMap(
    (item, i) => {
      const text = resolveBilingualText(lang, item.textEn, item.textAr);
      if (!text) return [];
      const offer: UtilityBarOfferDisplay = {
        text,
        color: item.color?.trim() || UTILITY_BAR_OFFER_COLORS[i % UTILITY_BAR_OFFER_COLORS.length],
      };
      const href = item.href?.trim();
      if (href) offer.href = href;
      return [offer];
    },
  );

  const promoOffers: UtilityBarOfferDisplay[] = (config.promotions ?? [])
    .filter(isPromotionDisplayable)
    .map((promo, i) => ({
      text: formatUtilityBarTickerText(promo),
      color: UTILITY_BAR_OFFER_COLORS[(customOffers.length + i) % UTILITY_BAR_OFFER_COLORS.length],
      href: '/products',
    }));

  const offers = [...customOffers, ...promoOffers];

  const leftBadgeConfig = config.leftBadge;
  const leftBadgeText = leftBadgeConfig?.enabled !== false
    ? resolveBilingualText(lang, leftBadgeConfig?.textEn, leftBadgeConfig?.textAr)
    : '';
  const leftBadge: UtilityBarLeftBadge | null =
    leftBadgeConfig?.enabled !== false && leftBadgeText
      ? {
          icon: leftBadgeConfig?.icon?.trim() || undefined,
          text: leftBadgeText,
        }
      : null;

  const showStoreLocator = section ? config.showStoreLocator !== false : true;
  const showStoreLocatorMap = section ? config.showStoreLocatorMap !== false : true;
  const showLanguageSwitcher = section ? config.showLanguageSwitcher !== false : true;
  const hasRightSide = showStoreLocator || showLanguageSwitcher;
  const enabled = sectionEnabled && (offers.length > 0 || hasRightSide || !!leftBadge);

  return {
    enabled,
    leftBadge,
    offers,
    showStoreLocator,
    showStoreLocatorMap,
    showLanguageSwitcher,
  };
}

export function useOfferPopupConfig() {
  return useQuery({
    queryKey: publicCmsKeys.offerPopup,
    queryFn: async (): Promise<{ config: OfferPopupConfig; products: Product[] } | null> => {
      const res = await apiGetPublicOfferPopup();
      if (!res.success || !res.data) return null;
      const raw = res.data;
      const products = adaptProducts((raw.products ?? []) as ApiProduct[]);
      const config: OfferPopupConfig = {
        enabled: raw.enabled,
        discountPercent: raw.discountPercent,
        startsAt: raw.startsAt,
        endsAt: raw.endsAt,
        title: raw.title,
        subtitle: raw.subtitle,
        headline: raw.headline,
        displayDelayMs: raw.displayDelayMs,
        productIds: raw.productIds ?? [],
        products,
      };
      return { config, products };
    },
    staleTime: 30 * 1000,
    retry: 1,
  });
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
