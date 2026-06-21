import { OutlineSkeleton } from './OutlineSkeleton';
import {
  heroCarouselAspectClass,
  heroSidePanelAspectClass,
} from '@/lib/constants/heroBannerSizes';

export function HeroBannerSkeleton() {
  return (
    <section
      className="w-full py-0 md:py-2 bg-[var(--color-amoria-bg)]"
      aria-busy="true"
      aria-label="Loading hero banner"
    >
      <div className="grid w-full grid-cols-1 items-stretch gap-0 md:grid-cols-2 md:gap-2.5 md:px-4 lg:gap-3 lg:px-6">
        <OutlineSkeleton
          className={`w-full self-start rounded-none md:rounded-2xl ${heroCarouselAspectClass}`}
        />
        <div className="hidden h-full min-h-0 flex-col gap-2 md:flex lg:gap-3">
          <OutlineSkeleton className="min-h-0 w-full flex-1 rounded-2xl" />
          <OutlineSkeleton className="min-h-0 w-full flex-1 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
