'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PeopleAlsoBoughtProps {
  products: Product[];
}

export function PeopleAlsoBought({ products }: PeopleAlsoBoughtProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi]);

  if (!products.length) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-light gold-underline inline-block"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
        >
          People Also Bought
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous"
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed hover:enabled:bg-[#1A0A2E] hover:enabled:text-white"
            style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next"
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed hover:enabled:bg-[#1A0A2E] hover:enabled:text-white"
            style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden mt-8" ref={emblaRef}>
        {/* Slide widths subtract the gap so exactly 2 / 3 / 4 full cards fit
            (matches the home page grid — no half-card peeking) */}
        <div className="flex gap-5 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_calc(50%-10px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
