import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
}

export function RatingStars({ rating, size = 14 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? 'var(--color-amoria-accent)' : half ? 'url(#half)' : 'transparent'}
            style={{ color: 'var(--color-amoria-accent)' }}
          />
        );
      })}
    </div>
  );
}
