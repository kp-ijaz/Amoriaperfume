'use client';

import { useState } from 'react';
import { Review } from '@/types/product';
import { ReviewCard } from './ReviewCard';
import { RatingStars } from './RatingStars';

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: reviews.length ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  const visible = reviews.slice(0, visibleCount);

  return (
    <div>
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-amoria-border)' }}>
        {/* Big number */}
        <div className="text-center sm:text-left">
          <p
            className="text-6xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
          >
            {rating.toFixed(1)}
          </p>
          <RatingStars rating={rating} size={18} />
          <p className="text-sm mt-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {reviewCount} reviews
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-2">
          {ratingBreakdown.map(({ star, percent }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs w-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
                {star}★
              </span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-amoria-border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: 'var(--color-amoria-accent)' }}
                />
              </div>
              <span className="text-xs w-8 text-right" style={{ color: 'var(--color-amoria-text-muted)' }}>
                {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div>
        {visible.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load more */}
      {visibleCount < reviews.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 4)}
          className="mt-6 px-6 py-2.5 text-sm font-medium border w-full sm:w-auto transition-colors hover:opacity-80"
          style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}
