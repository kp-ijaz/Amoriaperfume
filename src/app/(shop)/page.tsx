import { CompactHeroBanner } from '@/components/home/CompactHeroBanner';
import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';
import { PromoStripBanner } from '@/components/home/PromoStripBanner';
import { ProductSectionClient } from '@/components/home/ProductSectionClient';
import { StaticProductSection } from '@/components/home/StaticProductSection';
import { PromoBanners } from '@/components/home/PromoBanners';
import { ShopByBrandsGrid } from '@/components/home/ShopByBrandsGrid';
import { ShopByCategoryGrid } from '@/components/home/ShopByCategoryGrid';
import { MenWomenBanner } from '@/components/home/MenWomenBanner';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BrandInspirations } from '@/components/home/ScentPillars';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { FragranceFinderCTA } from '@/components/home/FragranceFinderCTA';
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
      <ProductSectionClient
        title="New Arrivals"
        subtitle="Just Landed"
        viewAllHref="/products?sort=newest"
        theme="light"
        sectionNumber="01"
        limit={5}
        columns={5}
      />

      {/* 5 — Two side-by-side promotional banners (vperfumes style) */}
      <PromoBanners />

      {/* 6 — Top Luxury Perfumes */}
      <StaticProductSection
        title="Top Luxury Perfumes"
        subtitle="Premium Selection"
        viewAllHref="/products?sort=price-desc"
        theme="light"
        sectionNumber="02"
        limit={5}
        columns={5}
        filter={{ minPrice: 300 }}
        sortBy="price-desc"
      />

      {/* 7 — Shop by Brands (dark section) */}
      <ShopByBrandsGrid />

      {/* 8 — Best Sellers (API data) */}
      <ProductSectionClient
        title="Best Sellers"
        subtitle="Most Loved"
        viewAllHref="/products?sort=bestsellers"
        theme="light"
        sectionNumber="03"
        limit={5}
        columns={5}
        featured={true}
      />

      {/* 9 — Shop by Category grid */}
      <ShopByCategoryGrid />

      {/* 10 — Most Viewed Products */}
      <StaticProductSection
        title="Most Viewed"
        subtitle="Trending Now"
        viewAllHref="/products?sort=popular"
        theme="light"
        sectionNumber="04"
        limit={5}
        columns={5}
        sortBy="reviewCount"
      />

      {/* 11 — Perfumes For Men & Women (with mini product picks) */}
      <MenWomenBanner />

      {/* 12 — Editorial curated collections */}
      <FeaturedCollections />

      {/* 13 — Brand Inspirations */}
      <BrandInspirations />

      {/* 14 — Brand logos marquee */}
      <BrandShowcase />

      {/* 15 — Fragrance Finder quiz CTA */}
      <FragranceFinderCTA />

      {/* 16 — Flash deals + countdown */}
      <LimitedDealsSection />

      {/* 17 — Testimonials + stats bar */}
      <TestimonialsSection />

      {/* 18 — Instagram feed */}
      <InstagramFeed />

      {/* 19 — Newsletter */}
      <NewsletterSection />

      {/* Global overlays */}
      <LimitedOfferPopup />
      <FragranceFinderWidget />
    </>
  );
}
