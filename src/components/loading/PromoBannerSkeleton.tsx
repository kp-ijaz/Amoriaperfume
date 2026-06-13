import { OutlineSkeleton } from './OutlineSkeleton';

export function PromoBannerSkeleton() {
  return (
    <section className="w-full py-6 md:py-8 bg-[var(--color-amoria-bg)]" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <OutlineSkeleton className="w-full rounded-xl" style={{ minHeight: 220 }} />
        <OutlineSkeleton className="w-full rounded-xl" style={{ minHeight: 220 }} />
      </div>
    </section>
  );
}
