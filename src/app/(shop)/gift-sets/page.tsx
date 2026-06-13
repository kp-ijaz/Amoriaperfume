'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { GiftSetCard } from '@/components/gift-set/GiftSetCard';
import { useGiftSets } from '@/lib/hooks/useGiftSets';
import { ApiGiftSetOccasion } from '@/lib/api/types';

const OCCASION_CHIPS: {
  label: string;
  icon: string;
  occasion?: ApiGiftSetOccasion;
}[] = [
  { label: 'All Gift Sets', icon: '🎁' },
  { label: 'Eid Gifts', icon: '🌙', occasion: 'eid' },
  { label: 'Weddings', icon: '💍', occasion: 'wedding' },
  { label: 'Birthdays', icon: '🎂', occasion: 'birthday' },
  { label: 'Corporate', icon: '🤝', occasion: 'corporate' },
];

function parseOccasionParam(value: string | null): ApiGiftSetOccasion | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'eid' || normalized === 'wedding' || normalized === 'birthday' || normalized === 'corporate') {
    return normalized;
  }
  return undefined;
}

export default function GiftSetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeOccasion = parseOccasionParam(searchParams.get('occasion'));
  const { data: giftSets = [], isLoading } = useGiftSets(activeOccasion);

  function handleOccasionClick(occasion?: ApiGiftSetOccasion) {
    if (!occasion) {
      router.push('/gift-sets');
      return;
    }
    router.push(`/gift-sets?occasion=${occasion}`);
  }

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#1A0A2E' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
            }}
          >
            <Gift size={22} style={{ color: '#C9A84C' }} />
          </div>
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'rgba(201,168,76,0.7)' }}
          >
            For Every Occasion
          </p>
          <h1
            className="text-4xl md:text-5xl font-light text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gift <em style={{ color: '#C9A84C' }}>Sets</em>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Curated fragrance gifts that make every moment unforgettable. Beautifully packaged and ready to gift.
          </p>
        </motion.div>
      </div>

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E3DC' }}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-3">
          {OCCASION_CHIPS.map((occ) => {
            const isActive = occ.occasion === activeOccasion || (!occ.occasion && !activeOccasion);
            return (
              <button
                key={occ.label}
                type="button"
                onClick={() => handleOccasionClick(occ.occasion)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border"
                style={{
                  borderColor: isActive ? '#1A0A2E' : '#E8E3DC',
                  backgroundColor: isActive ? '#1A0A2E' : '#FAF8F5',
                  color: isActive ? '#C9A84C' : '#1A0A2E',
                }}
              >
                <span>{occ.icon}</span>
                {occ.label}
              </button>
            );
          })}
          <Link
            href="/gift-cards"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border hover:border-[#1A0A2E]"
            style={{ borderColor: '#E8E3DC', backgroundColor: '#FAF8F5', color: '#1A0A2E' }}
          >
            <span>💳</span>
            Gift Cards
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
              >
                <div className="h-56 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : giftSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftSets.map((giftSet, i) => (
              <GiftSetCard key={giftSet._id} giftSet={giftSet} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
              {activeOccasion
                ? 'No gift sets for this occasion yet. Try another filter or browse all fragrances.'
                : 'Gift sets are being curated. Browse our full fragrance range in the meantime.'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Browse All Fragrances <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#1A0A2E' }}>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p
            className="text-xs tracking-[0.28em] uppercase mb-3"
            style={{ color: 'rgba(201,168,76,0.6)' }}
          >
            Complimentary Service
          </p>
          <h3
            className="text-2xl font-light text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Free Gift <em style={{ color: '#C9A84C' }}>Wrapping</em>
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Every gift set comes beautifully wrapped in our signature gold and purple packaging — at no
            extra charge.
          </p>
        </div>
      </div>
    </div>
  );
}
