'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroCoverImages } from '@/lib/hooks/usePublicCms';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { filterCoverImagesForDevice } from '@/lib/utils/coverImageDevice';
import {
  heroCarouselAspectClass,
  heroSidePanelAspectClass,
} from '@/lib/constants/heroBannerSizes';
import { HeroBannerSkeleton } from '@/components/loading';

function CarouselBannerImage({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div
      className="relative h-full w-full min-h-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain object-center"
        priority={priority}
        unoptimized
      />
    </div>
  );
}

function SidePanelCard({
  image,
  alt,
  href,
  className,
  sizes,
  cover = false,
}: {
  image: string;
  alt: string;
  href: string;
  className?: string;
  sizes: string;
  cover?: boolean;
}) {
  const content = (
    <div
      className="relative h-full w-full min-h-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className={cover ? 'h-full w-full object-cover object-center' : 'object-contain object-center'}
        unoptimized
      />
    </div>
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

export function CompactHeroBanner() {
  const { data, isLoading } = useHeroCoverImages();
  const isDesktop = useIsDesktop();

  const sliderBanners = useMemo(
    () => filterCoverImagesForDevice(data?.sliders ?? [], isDesktop),
    [data?.sliders, isDesktop]
  );

  const sidePanelBanners = useMemo(
    () => filterCoverImagesForDevice(data?.sidePanels ?? [], isDesktop).slice(0, 2),
    [data?.sidePanels, isDesktop]
  );

  const banners = sliderBanners.map((b) => ({
    id: b._id,
    image: b.imageUrl,
    href: b.redirectUrl?.trim() || '',
    alt: b.title?.trim() || 'Promotional banner',
  }));

  const sidePanels = sidePanelBanners.map((b) => ({
    id: b._id,
    image: b.imageUrl,
    href: b.redirectUrl?.trim() || '',
    alt: b.title?.trim() || 'Promotional offer',
  }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: banners.length > 1 },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
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

  if (isLoading) return <HeroBannerSkeleton />;

  if (banners.length === 0 && sidePanels.length === 0) return null;

  const showSideColumn = isDesktop && sidePanels.length > 0;

  return (
    <section
      className="w-full py-0 md:py-2"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <div
        className={`grid w-full min-h-0 items-stretch gap-0 md:gap-2.5 md:px-4 lg:gap-3 lg:px-6 ${
          showSideColumn ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {banners.length > 0 ? (
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
                        <CarouselBannerImage
                          src={banner.image}
                          alt={banner.alt}
                          priority={i === 0}
                          sizes="(max-width: 767px) 100vw, 50vw"
                        />
                      </Link>
                    ) : (
                      <CarouselBannerImage
                        src={banner.image}
                        alt={banner.alt}
                        priority={i === 0}
                        sizes="(max-width: 767px) 100vw, 50vw"
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
                          selectedIndex === i
                            ? 'var(--color-amoria-accent)'
                            : 'rgba(255,255,255,0.45)',
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {showSideColumn ? (
          <div className="hidden h-full min-h-0 w-full min-w-0 max-w-full flex-col gap-2 md:flex lg:gap-3">
            {sidePanels.map((panel) => (
              <SidePanelCard
                key={panel.id}
                image={panel.image}
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

      {!isDesktop && sidePanels.length > 0 ? (
        <div className="flex flex-col gap-2 px-0 pt-2 pb-1 md:hidden">
          {sidePanels.map((panel) => (
            <SidePanelCard
              key={panel.id}
              image={panel.image}
              alt={panel.alt}
              href={panel.href}
              cover
              sizes="100vw"
              className={`relative block h-full w-full max-w-full overflow-hidden rounded-none ${heroSidePanelAspectClass}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
