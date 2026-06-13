import { OutlineSkeleton } from './OutlineSkeleton';

export function InstagramGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="relative py-20 overflow-hidden bg-[#FAF8F5]" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <OutlineSkeleton className="h-2 w-32 rounded-sm" />
          <OutlineSkeleton className="h-8 w-56 max-w-full rounded-sm" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <OutlineSkeleton key={i} className="aspect-square w-full rounded-none" />
          ))}
        </div>
      </div>
    </section>
  );
}
