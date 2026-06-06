'use client';

import type { ReactNode } from 'react';
import { PromoStripBanner } from '@/components/home/PromoStripBanner';
import { HomeSlotSection } from '@/components/home/HomeSlotSection';
import { PromoBanners } from '@/components/home/PromoBanners';
import { LimitedDealsSection } from '@/components/home/LimitedDealsSection';
import { ShopByBrandsGrid } from '@/components/home/ShopByBrandsGrid';
import { MostViewedSection } from '@/components/home/MostViewedSection';
import { MenWomenBanner } from '@/components/home/MenWomenBanner';
import { BrandInspirations } from '@/components/home/ScentPillars';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import type { HomepageLayoutKey } from '@/lib/homepage/homepageLayoutDefaults';

export const HOMEPAGE_SECTION_RENDERERS: Record<HomepageLayoutKey, () => ReactNode> = {
  announcement: () => <PromoStripBanner />,
  new_arrivals: () => (
    <HomeSlotSection
      slotKey="home-new-arrivals"
      title="New Arrivals"
      subtitle="Just Landed"
      viewAllHref="/products?newArrival=true"
      theme="light"
      sectionNumber="01"
      limit={5}
      columns={5}
      fallback={{ newArrival: true }}
    />
  ),
  promo_banners: () => <PromoBanners />,
  limited_offers: () => <LimitedDealsSection />,
  shop_by_brands: () => <ShopByBrandsGrid />,
  best_sellers: () => (
    <HomeSlotSection
      slotKey="home-best-sellers"
      title="Best Sellers"
      subtitle="Most Loved"
      viewAllHref="/products?bestSeller=true"
      theme="light"
      sectionNumber="02"
      limit={5}
      columns={5}
      fallback={{ bestSeller: true }}
    />
  ),
  most_viewed: () => <MostViewedSection />,
  men_women: () => <MenWomenBanner />,
  brand_inspirations: () => <BrandInspirations />,
  testimonials: () => <TestimonialsSection />,
  instagram: () => <InstagramFeed />,
  newsletter: () => <NewsletterSection />,
};

export function renderHomepageSection(key: HomepageLayoutKey): ReactNode {
  const render = HOMEPAGE_SECTION_RENDERERS[key];
  return render ? render() : null;
}
