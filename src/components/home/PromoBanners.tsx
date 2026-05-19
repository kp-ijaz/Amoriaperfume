'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePublicCoverImages } from '@/lib/hooks/usePublicCms';

export function PromoBanners() {
  const { data: covers = [], isLoading } = usePublicCoverImages('home_banner_v3');

  if (isLoading) {
    return (
      <section className="py-8 flex justify-center">
        <span className="w-8 h-8 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
      </section>
    );
  }

  if (covers.length === 0) return null;

  const banners = covers.slice(0, 2).map((b) => ({
    id: b._id,
    badge: b.content?.split('|')[0]?.trim() || 'OFFER',
    badgeBg: '#DC2626',
    headline: b.title?.split(' ').slice(0, -1).join(' ') || b.title || '',
    headlineAccent: b.title?.split(' ').slice(-1)[0] || '',
    sub: b.subtitle || '',
    code: b.content?.includes('|') ? b.content.split('|')[1]?.trim() : null,
    cta: 'Shop Now',
    href: b.redirectUrl || '/products',
    image: b.imageUrl,
  }));

  return (
    <section
      className="w-full py-6 md:py-8"
      style={{ backgroundColor: 'var(--color-amoria-bg)' }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="relative overflow-hidden group block"
            style={{ minHeight: 220, borderRadius: 12 }}
          >
            <Image
              src={banner.image}
              alt={banner.headline}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <motion.div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 z-10">
              <span
                className="text-[10px] font-bold tracking-widest uppercase text-white w-fit px-2 py-0.5 mb-3"
                style={{ backgroundColor: banner.badgeBg }}
              >
                {banner.badge}
              </span>
              <h3
                className="text-2xl md:text-3xl font-light text-white leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {banner.headline}{' '}
                <span style={{ color: 'var(--color-amoria-accent)' }}>{banner.headlineAccent}</span>
              </h3>
              {banner.sub && (
                <p className="text-white/75 text-sm mt-2 max-w-xs line-clamp-2">{banner.sub}</p>
              )}
              {banner.code && (
                <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
                  Code: {banner.code}
                </p>
              )}
              <span className="mt-4 text-xs font-semibold tracking-widest uppercase text-white">
                {banner.cta} →
              </span>
            </div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
