'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ApiGiftSet, ApiGiftSetOccasion } from '@/lib/api/types';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { OutlineSkeleton } from '@/components/loading';

const OCCASION_LABELS: Record<ApiGiftSetOccasion, string> = {
  general: 'Gift Set',
  eid: 'Eid Gifts',
  wedding: 'Weddings',
  birthday: 'Birthdays',
  corporate: 'Corporate',
};

interface GiftSetCardProps {
  giftSet: ApiGiftSet;
  index?: number;
}

export function GiftSetCard({ giftSet, index = 0 }: GiftSetCardProps) {
  const href = `/gift-sets/${giftSet.slug}`;
  const coverImage = giftSet.images?.[0] ?? giftSet.coverImage;
  const hasDiscount = giftSet.mrp > giftSet.giftSetPrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - giftSet.giftSetPrice / giftSet.mrp) * 100)
    : null;
  const occasion = giftSet.occasion ?? 'general';
  const itemCount = giftSet.items?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <Link
        href={href}
        className="group block overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
      >
        <div className="relative h-56 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={giftSet.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <OutlineSkeleton className="absolute inset-0 rounded-none border-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <span
            className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1"
            style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
          >
            {OCCASION_LABELS[occasion]}
          </span>
          {discountPercent != null && discountPercent > 0 && (
            <span
              className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-[0.12em] px-2 py-1"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Save {discountPercent}%
            </span>
          )}
          {itemCount > 0 && (
            <p
              className="absolute bottom-3 left-4 text-[11px] font-medium"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'} included
            </p>
          )}
        </div>

        <div className="p-5">
          <h2
            className="text-lg font-semibold mb-1 line-clamp-2"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
          >
            {giftSet.name}
          </h2>
          {giftSet.description && (
            <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#6B6B6B' }}>
              {giftSet.description}
            </p>
          )}
          <div className="flex items-end justify-between gap-3">
            <div>
              {hasDiscount && (
                <p className="text-xs line-through mb-0.5" style={{ color: '#9B9B9B' }}>
                  {formatCurrency(giftSet.mrp)}
                </p>
              )}
              <p className="text-base font-semibold" style={{ color: '#1A0A2E' }}>
                {formatCurrency(giftSet.giftSetPrice)}
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all group-hover:gap-2.5 shrink-0"
              style={{ color: '#1A0A2E' }}
            >
              View <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
