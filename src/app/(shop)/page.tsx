import { VideoHero } from '@/components/home/VideoHero';
import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';
import { ScentPillars } from '@/components/home/ScentPillars';
import { ProductSection } from '@/components/home/ProductSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { FragranceFinderCTA } from '@/components/home/FragranceFinderCTA';
import { LimitedDealsSection } from '@/components/home/LimitedDealsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { LimitedOfferPopup } from '@/components/home/LimitedOfferPopup';
import { FragranceFinderWidget } from '@/components/home/FragranceFinderWidget';
import { getNewArrivals, getBestsellers } from '@/lib/data/products';

export default function HomePage() {
  const newArrivals = getNewArrivals().slice(0, 4);
  const bestsellers = getBestsellers().slice(0, 4);

  return (
    <>
      {/* 1 — Full-screen video hero */}
      <VideoHero />

      {/* 2 — Category icon strip */}
      <CategoryIconStrip />

      {/* 4 — New Arrivals */}
      <ProductSection
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/products?filter=new"
        theme="light"
        sectionNumber="01"
      />

      {/* 5 — Editorial curated collections */}
      <FeaturedCollections />

      {/* 6 — Three Pillars of Perfumery (Oud · Rose · Amber) */}
      <ScentPillars />

      {/* 7 — Best Sellers */}
      <ProductSection
        title="Best Sellers"
        products={bestsellers}
        viewAllHref="/products?filter=bestsellers"
        theme="light"
        sectionNumber="02"
      />

      {/* 8 — Brand marquee */}
      <BrandShowcase />

      {/* 9 — Fragrance Finder quiz CTA */}
      <FragranceFinderCTA />

      {/* 10 — Flash deals + countdown */}
      <LimitedDealsSection />

      {/* 11 — Testimonials + stats bar */}
      <TestimonialsSection />

      {/* 12 — Instagram feed */}
      <InstagramFeed />

      {/* 13 — Newsletter */}
      <NewsletterSection />

      {/* Global overlays */}
      <LimitedOfferPopup />
      <FragranceFinderWidget />
    </>
  );
}
