import { OutlineSkeleton } from './OutlineSkeleton';

export function BrandTileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <OutlineSkeleton
          key={i}
          className="w-full rounded-none"
          style={{ height: 248, backgroundColor: 'rgba(255,255,255,0.03)' }}
        />
      ))}
    </>
  );
}
