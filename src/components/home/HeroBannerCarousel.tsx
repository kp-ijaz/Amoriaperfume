'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { banners } from '@/lib/data/banners';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroBannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden" style={{ height: 'calc(100vh - 112px)', minHeight: '500px' }}>
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
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h2
                  className="text-5xl md:text-6xl font-light text-white mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {banner.title}
                </h2>
                <p className="text-white/80 mb-8 max-w-md">{banner.subtitle}</p>
                <Link
                  href={banner.ctaLink}
                  className="px-8 py-3 text-sm font-semibold tracking-wider uppercase"
                  style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
                >
                  {banner.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <ChevronRight size={20} className="text-white" />
      </button>
    </section>
  );
}
