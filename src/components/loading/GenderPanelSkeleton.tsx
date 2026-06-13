import { OutlineSkeleton } from './OutlineSkeleton';

export function GenderPanelSkeleton() {
  return (
    <section style={{ backgroundColor: '#0D0A08' }} aria-busy="true" aria-label="Loading collections">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 16px 40px' }}>
        <div className="flex flex-col items-center gap-3">
          <OutlineSkeleton className="h-2 w-24 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <OutlineSkeleton className="h-10 w-64 max-w-full rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <OutlineSkeleton className="h-3 w-48 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
      <div className="flex flex-col">
        {[0, 1].map((i) => (
          <div key={i} className="relative" style={{ minHeight: 320 }}>
            <OutlineSkeleton
              className="w-full h-full min-h-[320px] rounded-none border-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            />
            <div className="absolute bottom-6 left-6 flex gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <OutlineSkeleton
                  key={j}
                  className="rounded-sm"
                  style={{ width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.06)' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
