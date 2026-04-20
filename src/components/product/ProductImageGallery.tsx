'use client';

import { useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductImage } from '@/types/product';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef] = useEmblaCarousel();

  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <>
      {/* Desktop gallery */}
      <div className="hidden md:block">
        {/* Main image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden group mb-3">
          {selectedImage && (
            <Image
              src={selectedImage.url}
              alt={`${productName} - ${selectedImage.alt}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              unoptimized
            />
          )}
        </div>
        {/* Thumbnails */}
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="relative w-16 h-16 overflow-hidden border-2 flex-shrink-0 transition-colors"
              style={{
                borderColor: selectedIndex === i ? 'var(--color-amoria-accent)' : 'var(--color-amoria-border)',
              }}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_100%] relative aspect-square bg-gray-50">
              <Image src={img.url} alt={img.alt} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: selectedIndex === i ? 'var(--color-amoria-accent)' : 'var(--color-amoria-border)' }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
