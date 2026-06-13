import { OutlineSkeleton } from './OutlineSkeleton';

export function CategoryStripSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}
      aria-busy="true"
      aria-label="Loading categories"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 16px 24px' }}>
        <div className="flex items-start gap-3 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0" style={{ width: 88 }}>
              <OutlineSkeleton className="rounded-full" style={{ width: 72, height: 72 }} />
              <OutlineSkeleton className="h-2 w-14 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
