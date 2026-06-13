import { OutlineSkeleton } from './OutlineSkeleton';

interface ProductCardSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4 | 5;
}

const GRID_COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
} as const;

const GRID_GAPS = {
  2: 'gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10',
  3: 'gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10',
  4: 'gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8',
  5: 'gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8',
} as const;

export function ProductCardSkeletonItem() {
  return (
    <div className="flex flex-col gap-0">
      <OutlineSkeleton className="w-full rounded-none" style={{ aspectRatio: '3/4' }} />
      <div className="pt-3 space-y-1.5">
        <OutlineSkeleton className="h-2 w-1/4 rounded-sm" />
        <OutlineSkeleton className="h-3 w-3/4 rounded-sm" />
        <OutlineSkeleton className="h-2.5 w-1/3 mt-1 rounded-sm" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ count, columns = 4 }: ProductCardSkeletonProps) {
  const skeletonCount = count ?? (columns === 5 ? 5 : columns === 3 ? 6 : 4);

  return (
    <div className={`grid ${GRID_COLS[columns]} ${GRID_GAPS[columns]}`} aria-busy="true">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <ProductCardSkeletonItem key={i} />
      ))}
    </div>
  );
}
