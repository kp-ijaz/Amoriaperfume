'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroCoverImages } from '@/lib/hooks/usePublicCms';
import { FALLBACK_HERO_SIDE_PANELS, FALLBACK_HERO_SLIDES } from '@/components/home/heroFallbacks';

export function CompactHeroBanner() {
  const { data, isLoading, isError } = useHeroCoverImages();

  const sliderBanners = data?.sliders ?? [];
  const sidePanelBanners = data?.sidePanels ?? [];
  const usingFallback = !isLoading && (isError || sliderBanners.length === 0);

  const banners = (usingFallback ? FALLBACK_HERO_SLIDES : sliderBanners.map((b) => ({
    id: b._id,
    image: b.imageUrl,
    title: b.title || 'Discover Amoria',
    subtitle: b.subtitle || '',
    ctaLink: b.redirectUrl || '/products',
    ctaText: b.content?.trim() || 'Shop Now',
  })));

  const sidePanels = (usingFallback
    ? FALLBACK_HERO_SIDE_PANELS
    : sidePanelBanners.slice(0, 2).map((b) => ({
    id: b._id,
    image: b.imageUrl,
    badge: b.content?.split('|')[0]?.trim() || 'OFFER',
    badgeColor: '#E53E3E',
    title: b.title || '',
    subtitle: b.subtitle || '',
    code: b.content?.includes('|') ? b.content.split('|')[1]?.trim() : null,
    href: b.redirectUrl || '/products',
    cta: 'Shop Now',
  })));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="w-full h-[260px] md:h-[420px] bg-[var(--color-amoria-bg)] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <>
      {/* Inline responsive rules for hero grid */}
      <style>{`
        .amoria-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          height: 260px;
          gap: 0;
        }
        @media (min-width: 768px) {
          .amoria-hero-grid {
            grid-template-columns: 1fr 1fr;
            height: 360px;
            gap: 10px;
            padding: 0 16px;
          }
        }
        @media (min-width: 1024px) {
          .amoria-hero-grid {
            height: 420px;
            gap: 12px;
            padding: 0 24px;
          }
        }
      `}</style>

      <section
        className="w-full py-0 md:py-2"
        style={{ backgroundColor: 'var(--color-amoria-bg)' }}
      >
        <div className="amoria-hero-grid">

          {/* LEFT — main carousel */}
          <div className="relative overflow-hidden rounded-none md:rounded-2xl h-full">
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex-[0_0_100%] relative h-full">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-7 md:px-10 z-10">
                      <span
                        className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2"
                        style={{ color: 'var(--color-amoria-accent)' }}
                      >
                        New Collection 2025
                      </span>
                      <h2
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight mb-2 max-w-xs"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {banner.title}
                      </h2>
                      <p className="text-white/70 text-xs md:text-sm mb-4 max-w-[220px] leading-relaxed line-clamp-2">
                        {banner.subtitle}
                      </p>
                      <Link
                        href={banner.ctaLink}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase w-fit transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: 'var(--color-amoria-accent)',
                          color: 'var(--color-amoria-primary)',
                        }}
                      >
                        {banner.ctaText}
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="text-white" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: selectedIndex === i ? '20px' : '6px',
                    height: '6px',
                    backgroundColor:
                      selectedIndex === i
                        ? 'var(--color-amoria-accent)'
                        : 'rgba(255,255,255,0.45)',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — two stacked offer panels, desktop only */}
          <div className="hidden md:flex flex-col gap-2 lg:gap-3 h-full">
            {sidePanels.map((panel) => (
              <Link
                key={panel.id}
                href={panel.href}
                className="relative flex-1 overflow-hidden group rounded-2xl"
                style={{ minHeight: 0 }}
              >
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15 transition-all duration-300 group-hover:from-black/75" />

                {/* Badge */}
                <span
                  className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 text-white z-10"
                  style={{ backgroundColor: panel.badgeColor }}
                >
                  {panel.badge}
                </span>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                  <p
                    className="text-base lg:text-lg font-semibold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {panel.title}
                  </p>
                  <p className="text-white/65 text-[11px] mt-0.5 mb-1.5">{panel.subtitle}</p>
                  {panel.code && (
                    <span
                      className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 mb-2 rounded-sm"
                      style={{
                        backgroundColor: 'rgba(201,168,76,0.18)',
                        color: 'var(--color-amoria-accent)',
                        border: '1px solid rgba(201,168,76,0.35)',
                      }}
                    >
                      Code: {panel.code}
                    </span>
                  )}
                  <div>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 group-hover:gap-2"
                      style={{ color: 'var(--color-amoria-accent)' }}
                    >
                      {panel.cta} <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
