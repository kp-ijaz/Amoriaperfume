'use client';

import { useHomeSlotProducts, type HomeSlotFallbackParams } from '@/lib/hooks/usePublicCms';
import { ProductSection } from './ProductSection';
import { useLanguage } from '@/lib/context/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

interface HomeSlotSectionProps {
  slotKey: string;
  title: string;
  subtitle?: string;
  viewAllHref: string;
  theme?: 'light' | 'dark';
  sectionNumber?: string;
  limit?: number;
  columns?: 2 | 3 | 4 | 5;
  /** Used when the home slot has no curated productIds */
  fallback?: HomeSlotFallbackParams;
}

// Maps slot keys to translation keys for fallback titles/subtitles (before API integrates)
const SLOT_TITLE_KEYS: Record<string, { title: TranslationKey; subtitle: TranslationKey }> = {
  'home-new-arrivals': { title: 'slotNewArrivals', subtitle: 'slotNewArrivalsSubtitle' },
  'home-best-sellers': { title: 'slotBestSellers', subtitle: 'slotBestSellersSubtitle' },
  'home-most-viewed':  { title: 'slotTrending',    subtitle: 'slotTrendingSubtitle' },
  'home-limited-offers': { title: 'slotLimitedOffers', subtitle: 'slotLimitedOffersSubtitle' },
};

export function HomeSlotSection({
  slotKey,
  title,
  subtitle,
  viewAllHref,
  theme = 'light',
  sectionNumber = '01',
  limit = 5,
  columns = 5,
  fallback,
}: HomeSlotSectionProps) {
  const { data, isLoading } = useHomeSlotProducts(slotKey, {
    limit,
    ...fallback,
  });
  const { t } = useLanguage();

  const keys = SLOT_TITLE_KEYS[slotKey];
  const translatedTitle = keys ? t(keys.title) : title;
  const translatedSubtitle = keys ? t(keys.subtitle) : subtitle;

  // API title/subtitle takes priority; fall back to translated strings
  const displayTitle = data?.title?.trim() || translatedTitle;
  const displaySubtitle = data?.subtitle?.trim() || translatedSubtitle;
  const products = data?.products ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <ProductSection
      title={displayTitle}
      subtitle={displaySubtitle}
      products={products}
      viewAllHref={viewAllHref}
      showSkeleton={isLoading}
      theme={theme}
      sectionNumber={sectionNumber}
      columns={columns}
    />
  );
}
