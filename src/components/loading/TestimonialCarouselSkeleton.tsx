import { OutlineSkeleton } from './OutlineSkeleton';

export function TestimonialCarouselSkeleton() {
  return (
    <section className="relative overflow-hidden py-16 bg-[#0D0A08]" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-3 mb-10">
          <OutlineSkeleton className="h-2 w-28 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <OutlineSkeleton className="h-8 w-48 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OutlineSkeleton
              key={i}
              className="rounded-lg p-6"
              style={{ minHeight: 180, backgroundColor: 'rgba(255,255,255,0.04)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
