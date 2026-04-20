'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

interface PeopleAlsoBoughtProps {
  products: Product[];
}

export function PeopleAlsoBought({ products }: PeopleAlsoBoughtProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 1, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
            className="p-2 border hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--color-amoria-border)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 border hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--color-amoria-border)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden mt-8" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
