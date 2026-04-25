import { VideoHero } from '@/components/home/VideoHero';
import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';
import { ScentPillars } from '@/components/home/ScentPillars';
import { ProductSectionClient } from '@/components/home/ProductSectionClient';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
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
      {/* 1 — Full-screen video hero */}
      <VideoHero />

      {/* 2 — Category icon strip (fetches from API) */}
      <CategoryIconStrip />

      {/* 3 — New Arrivals */}
      <ProductSectionClient
        title="New Arrivals"
        viewAllHref="/products"
        theme="light"
        sectionNumber="01"
        limit={4}
      />

      {/* 4 — Editorial curated collections */}
      <FeaturedCollections />

      {/* 5 — Three Pillars of Perfumery */}
      <ScentPillars />

      {/* 6 — Best Sellers (featured products) */}
      <ProductSectionClient
        title="Best Sellers"
        subtitle="Most Loved"
        viewAllHref="/products"
        theme="light"
        sectionNumber="02"
        limit={8}
        featured={true}
      />

      {/* 7 — Brand marquee (fetches from API) */}
      <BrandShowcase />

      {/* 8 — Fragrance Finder quiz CTA */}
      <FragranceFinderCTA />

      {/* 9 — Flash deals + countdown */}
      <LimitedDealsSection />

      {/* 10 — Testimonials + stats bar */}
      <TestimonialsSection />

      {/* 11 — Instagram feed */}
      <InstagramFeed />

      {/* 12 — Newsletter */}
      <NewsletterSection />

      {/* Global overlays */}
      <LimitedOfferPopup />
      <FragranceFinderWidget />
    </>
  );
}
