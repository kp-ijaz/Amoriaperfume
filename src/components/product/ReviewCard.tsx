import { Review } from '@/types/product';
import { RatingStars } from './RatingStars';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-5 border-b" style={{ borderColor: 'var(--color-amoria-border)' }}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
          style={{ backgroundColor: 'var(--color-amoria-primary)' }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-amoria-text)' }}>
              {review.reviewerName}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {review.location}
            </span>
            {review.isVerified && (
              <Badge variant="secondary" className="text-[10px] py-0">
                ✓ Verified Purchase
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={review.rating} size={13} />
            <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {new Date(review.date).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-amoria-text)' }}>
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
