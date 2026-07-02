'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroCoverImages } from '@/lib/hooks/usePublicCms';
import {
  heroCarouselAspectClass,
  heroSidePanelAspectClass,
} from '@/lib/constants/heroBannerSizes';
import { HeroBannerSkeleton } from '@/components/loading';
import type { HeroCoverBundle } from '@/lib/utils/heroCoverImages';
import { mapSidePanels, mapSliderBanners } from '@/lib/utils/heroCoverImages';

function ResponsiveBannerImage({
  desktopSrc,
  mobileSrc,
  alt,
  priority,
  sizes,
  cover = false,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  cover?: boolean;
}) {
  const objectClass = cover ? 'object-cover object-center' : 'object-contain object-center';
  return (
    <div
      className="relative h-full w-full min-h-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <Image
        src={mobileSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`md:hidden ${objectClass}`}
        priority={priority}
      />
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`hidden md:block ${objectClass}`}
        priority={priority}
      />
    </div>
  );
}

function SidePanelCard({
  desktopImage,
  mobileImage,
  alt,
  href,
  className,
  sizes,
  cover = false,
}: {
  desktopImage: string;
  mobileImage: string;
  alt: string;
  href: string;
  className?: string;
  sizes: string;
  cover?: boolean;
}) {
  const content = (
    <ResponsiveBannerImage
      desktopSrc={desktopImage}
      mobileSrc={mobileImage}
      alt={alt}
      sizes={sizes}
      cover={cover}
    />
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={alt}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function HeroCarousel({
  banners,
  sizes,
}: {
  banners: ReturnType<typeof mapSliderBanners>;
  sizes: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: banners.length > 1 },
    banners.length > 1 ? [Autoplay({ delay: 4500, stopOnInteraction: false })] : []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className={`relative w-full min-w-0 self-start overflow-hidden rounded-none md:rounded-2xl ${heroCarouselAspectClass}`}
    >
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="relative h-full min-h-0 min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              {banner.href ? (
                <Link
                  href={banner.href}
                  className="absolute inset-0 z-[1] block h-full w-full"
                  aria-label={banner.alt}
                >
                  <ResponsiveBannerImage
                    desktopSrc={banner.desktopImage}
                    mobileSrc={banner.mobileImage}
                    alt={banner.alt}
                    priority={i === 0}
                    sizes={sizes}
                  />
                </Link>
              ) : (
                <ResponsiveBannerImage
                  desktopSrc={banner.desktopImage}
                  mobileSrc={banner.mobileImage}
                  alt={banner.alt}
                  priority={i === 0}
                  sizes={sizes}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
            aria-label="Next slide"
          >
            <ChevronRight size={16} className="text-white" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: selectedIndex === i ? '20px' : '6px',
                  height: '6px',
                  backgroundColor:
                    selectedIndex === i ? 'var(--color-amoria-accent)' : 'rgba(255,255,255,0.45)',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function CompactHeroBanner({ initialHeroData }: { initialHeroData?: HeroCoverBundle }) {
  const { data, isLoading } = useHeroCoverImages(initialHeroData);
  const heroData = data ?? initialHeroData;

  const mobileSliders = useMemo(
    () => mapSliderBanners(heroData?.sliders ?? [], false),
    [heroData?.sliders]
  );
  const desktopSliders = useMemo(
    () => mapSliderBanners(heroData?.sliders ?? [], true),
    [heroData?.sliders]
  );
  const desktopSidePanels = useMemo(
    () => mapSidePanels(heroData?.sidePanels ?? [], true),
    [heroData?.sidePanels]
  );
  const mobileSidePanels = useMemo(
    () => mapSidePanels(heroData?.sidePanels ?? [], false),
    [heroData?.sidePanels]
  );

  const hasContent =
    mobileSliders.length > 0 ||
    desktopSliders.length > 0 ||
    desktopSidePanels.length > 0 ||
    mobileSidePanels.length > 0;

  if (isLoading && !initialHeroData) return <HeroBannerSkeleton />;
  if (!hasContent) return null;

  const showDesktopSideColumn = desktopSidePanels.length > 0;

  return (
    <section
      className="w-full py-0 md:py-2"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
      aria-label="Featured promotions"
    >
      <h1 className="sr-only">Premium Arabian Perfumes in UAE — Amoria</h1>

      {/* Mobile layout */}
      <div className="md:hidden">
        {mobileSliders.length > 0 ? (
          <HeroCarousel banners={mobileSliders} sizes="100vw" />
        ) : null}
        {mobileSidePanels.length > 0 ? (
          <div className="flex flex-col gap-2 px-0 pt-2 pb-1">
            {mobileSidePanels.map((panel) => (
              <SidePanelCard
                key={panel.id}
                desktopImage={panel.desktopImage}
                mobileImage={panel.mobileImage}
                alt={panel.alt}
                href={panel.href}
                cover
                sizes="100vw"
                className={`relative block h-full w-full max-w-full overflow-hidden rounded-none ${heroSidePanelAspectClass}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop layout */}
      <div
        className={`hidden md:grid w-full min-h-0 items-stretch gap-2.5 px-4 lg:gap-3 lg:px-6 ${
          showDesktopSideColumn ? 'grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {desktopSliders.length > 0 ? (
          <HeroCarousel banners={desktopSliders} sizes="50vw" />
        ) : null}

        {showDesktopSideColumn ? (
          <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col gap-2 lg:gap-3">
            {desktopSidePanels.map((panel) => (
              <SidePanelCard
                key={panel.id}
                desktopImage={panel.desktopImage}
                mobileImage={panel.mobileImage}
                alt={panel.alt}
                href={panel.href}
                cover
                sizes="50vw"
                className="relative block h-full min-h-0 w-full max-w-full flex-1 overflow-hidden rounded-2xl"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
