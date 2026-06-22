import { OutlineSkeleton } from './OutlineSkeleton';
import { promoBannerAspectClass } from '@/lib/constants/heroBannerSizes';

export function PromoBannerSkeleton() {
  return (
    <section className="w-full py-6 md:py-8 bg-[var(--color-amoria-bg)]" aria-busy="true">
      <div className="mx-auto grid w-full grid-cols-1 gap-3 px-4 md:grid-cols-2 md:gap-4 md:px-4 lg:px-6">
        <OutlineSkeleton className={`w-full rounded-xl ${promoBannerAspectClass}`} />
        <OutlineSkeleton className={`w-full rounded-xl ${promoBannerAspectClass}`} />
      </div>
    </section>
  );
}
