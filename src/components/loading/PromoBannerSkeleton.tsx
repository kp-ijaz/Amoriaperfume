import { OutlineSkeleton } from './OutlineSkeleton';

export function PromoBannerSkeleton() {
  return (
    <section className="w-full py-6 md:py-8 bg-[var(--color-amoria-bg)]" aria-busy="true">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 md:grid-cols-2 md:gap-4 md:px-6">
        <OutlineSkeleton className="aspect-[12/5] w-full rounded-xl md:aspect-[28/10]" />
        <OutlineSkeleton className="aspect-[12/5] w-full rounded-xl md:aspect-[28/10]" />
      </div>
    </section>
  );
}
