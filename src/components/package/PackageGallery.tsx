'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { OutlineSkeleton } from '@/components/loading';

type PackageGalleryProps = {
  images: string[];
  name: string;
  objectFit?: 'cover' | 'contain';
  imagePadding?: string;
};

export function PackageGallery({
  images,
  name,
  objectFit = 'cover',
  imagePadding = objectFit === 'contain' ? 'p-10' : '',
}: PackageGalleryProps) {
  const [active, setActive] = useState(0);
  const galleryImages = images.filter(Boolean);

  if (!galleryImages.length) {
    return (
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
      >
        <OutlineSkeleton className="absolute inset-0 rounded-none border-0" />
      </div>
    );
  }

  if (galleryImages.length === 1) {
    return (
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
      >
        <Image
          src={galleryImages[0]}
          alt={name}
          fill
          className={objectFit === 'contain' ? `object-contain ${imagePadding}` : 'object-cover'}
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="hidden md:flex flex-col gap-2 shrink-0" style={{ width: 60 }}>
        {galleryImages.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className="relative overflow-hidden shrink-0 transition-all"
            style={{
              width: 60,
              height: 60,
              border: i === active ? '2px solid #1A0A2E' : '1.5px solid #E0DBDA',
              backgroundColor: '#F8F8F8',
            }}
          >
            <Image src={url} alt={`${name} ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '1/1', backgroundColor: 'white', border: '1px solid #E8E3DC' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Image
                src={galleryImages[active] ?? galleryImages[0]}
                alt={name}
                fill
                className={objectFit === 'contain' ? `object-contain ${imagePadding}` : 'object-cover'}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-2 md:hidden">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="rounded-full transition-all"
              style={{
                width: i === active ? 18 : 6,
                height: 6,
                backgroundColor: i === active ? '#1A0A2E' : '#D4CAC0',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function resolvePackageImages(
  images?: string[] | null,
  coverImage?: string | null
): string[] {
  const normalized = (images ?? []).map((url) => url?.trim()).filter(Boolean) as string[];
  if (normalized.length) return normalized;
  const cover = coverImage?.trim();
  return cover ? [cover] : [];
}
