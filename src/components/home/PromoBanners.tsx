'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { usePublicCoverImages } from '@/lib/hooks/usePublicCms';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { filterCoverImagesForDevice, resolveCoverImageUrl } from '@/lib/utils/coverImageDevice';
import { promoBannerAspectClass } from '@/lib/constants/heroBannerSizes';
import { PromoBannerSkeleton } from '@/components/loading';

function PromoBannerCard({
  image,
  alt,
  href,
}: {
  image: string;
  alt: string;
  href: string;
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
        sizes="(max-width: 767px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );

  const className = `group relative block w-full min-h-0 overflow-hidden ${promoBannerAspectClass}`;

  if (href) {
    return (
      <Link href={href} className={className} style={{ borderRadius: 12 }}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} style={{ borderRadius: 12 }}>
      {content}
    </div>
  );
}

export function PromoBanners() {
  const { data: covers = [], isLoading } = usePublicCoverImages('home_banner_v3');
  const isDesktop = useIsDesktop();

  const visibleCovers = useMemo(
    () => filterCoverImagesForDevice(covers, isDesktop).slice(0, 2),
    [covers, isDesktop]
  );

  if (isLoading) return <PromoBannerSkeleton />;

  if (visibleCovers.length === 0) return null;

  const banners = visibleCovers.map((b) => ({
    id: b._id,
    href: b.redirectUrl?.trim() || '',
    alt: b.title?.trim() || 'Promotional banner',
    image: resolveCoverImageUrl(b, isDesktop),
  }));

  return (
    <section
      className="w-full py-6 md:py-8"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <motion.div
        className="mx-auto grid w-full min-h-0 grid-cols-1 gap-3 px-4 md:grid-cols-2 md:gap-4 md:px-4 lg:px-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {banners.map((banner) => (
          <PromoBannerCard
            key={banner.id}
            image={banner.image}
            alt={banner.alt}
            href={banner.href}
          />
        ))}
      </motion.div>
    </section>
  );
}
