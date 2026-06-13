import { OutlineSkeleton } from './OutlineSkeleton';

export function HeroBannerSkeleton() {
  return (
    <section
      className="w-full py-0 md:py-2 bg-[var(--color-amoria-bg)]"
      aria-busy="true"
      aria-label="Loading hero banner"
    >
      <style>{`
        .hero-skeleton-grid {
          display: grid;
          grid-template-columns: 1fr;
          height: 260px;
          gap: 0;
        }
        @media (min-width: 768px) {
          .hero-skeleton-grid {
            grid-template-columns: 1fr 1fr;
            height: 360px;
            gap: 10px;
            padding: 0 16px;
          }
        }
        @media (min-width: 1024px) {
          .hero-skeleton-grid {
            height: 420px;
            gap: 12px;
            padding: 0 24px;
          }
        }
        .hero-skeleton-side {
          display: none;
        }
        @media (min-width: 768px) {
          .hero-skeleton-side {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
      <div className="hero-skeleton-grid">
        <OutlineSkeleton className="h-full rounded-none md:rounded-2xl" />
        <div className="hero-skeleton-side h-full">
          <OutlineSkeleton className="flex-1 rounded-2xl" />
          <OutlineSkeleton className="flex-1 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
