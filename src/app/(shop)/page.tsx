import { CompactHeroBanner } from '@/components/home/CompactHeroBanner';
import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';
import { PromoStripBanner } from '@/components/home/PromoStripBanner';
import { HomeSlotSection } from '@/components/home/HomeSlotSection';
import { PromoBanners } from '@/components/home/PromoBanners';
import { ShopByBrandsGrid } from '@/components/home/ShopByBrandsGrid';
import { MenWomenBanner } from '@/components/home/MenWomenBanner';
import { BrandInspirations } from '@/components/home/ScentPillars';
import { LimitedDealsSection } from '@/components/home/LimitedDealsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { LimitedOfferPopup } from '@/components/home/LimitedOfferPopup';
import { FragranceFinderWidget } from '@/components/home/FragranceFinderWidget';

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero banner carousel + side panels */}
      <CompactHeroBanner />

      {/* 2 — Category icon strip (vperfumes circular icons) */}
      <CategoryIconStrip />

      {/* 3 — Cashback promo strip (gold, vperfumes style) */}
      <PromoStripBanner />

      {/* 4 — New Arrivals */}
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

      {/* 5 — Two side-by-side promotional banners (vperfumes style) */}
      <PromoBanners />

      {/* 6 — Flash deals + countdown (moved here) */}
      <LimitedDealsSection />

      {/* 7 — Shop by Brands (dark section) */}
      <ShopByBrandsGrid />

      {/* 8 — Best Sellers */}
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

      {/* 9 — Trending Perfumes */}
      <HomeSlotSection
        slotKey="home-most-viewed"
        title="Trending Perfumes"
        subtitle="What's Hot Right Now"
        viewAllHref="/products?trending=true"
        theme="light"
        sectionNumber="03"
        limit={5}
        columns={5}
        fallback={{ trending: true }}
      />

      {/* 10 — Perfumes For Men & Women (with mini product picks) */}
      <MenWomenBanner />

      {/* 11 — Brand Inspirations */}
      <BrandInspirations />

      {/* 12 — Testimonials + stats bar */}
      <TestimonialsSection />

      {/* 13 — Instagram feed */}
      <InstagramFeed />

      {/* 14 — Newsletter */}
      <NewsletterSection />

      {/* Global overlays */}
      <LimitedOfferPopup />
      <FragranceFinderWidget />
    </>
  );
}
