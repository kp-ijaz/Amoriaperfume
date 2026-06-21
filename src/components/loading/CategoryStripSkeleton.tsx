import { OutlineSkeleton } from './OutlineSkeleton';

export function CategoryStripSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}
      aria-busy="true"
      aria-label="Loading categories"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 16px 24px' }}>
        <div className="flex items-start gap-2 overflow-hidden md:flex-wrap md:justify-center md:gap-x-2 md:gap-y-4 md:overflow-visible">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex w-[92px] shrink-0 flex-col items-center gap-2 md:w-[calc((100%-5*0.5rem)/6)] md:max-w-[calc((100%-5*0.5rem)/6)] md:flex-[0_0_calc((100%-5*0.5rem)/6)]"
            >
              <OutlineSkeleton className="rounded-full" style={{ width: 80, height: 80 }} />
              <OutlineSkeleton className="h-2 w-14 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
