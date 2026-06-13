import { OutlineSkeleton } from './OutlineSkeleton';

export function PdpSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-label="Loading product">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex gap-2.5">
            <div className="hidden md:flex flex-col gap-2 w-16">
              {Array.from({ length: 4 }).map((_, i) => (
                <OutlineSkeleton key={i} className="aspect-square w-full rounded-sm" />
              ))}
            </div>
            <OutlineSkeleton className="flex-1 w-full rounded-sm" style={{ aspectRatio: '3/4', minHeight: 360 }} />
          </div>
          <div className="space-y-4 pt-2">
            <OutlineSkeleton className="h-2 w-20 rounded-sm" />
            <OutlineSkeleton className="h-8 w-3/4 max-w-md rounded-sm" />
            <OutlineSkeleton className="h-4 w-24 rounded-sm" />
            <OutlineSkeleton className="h-10 w-32 rounded-sm" />
            <div className="space-y-2 pt-4">
              <OutlineSkeleton className="h-3 w-full rounded-sm" />
              <OutlineSkeleton className="h-3 w-full rounded-sm" />
              <OutlineSkeleton className="h-3 w-2/3 rounded-sm" />
            </div>
            <div className="flex gap-2 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <OutlineSkeleton key={i} className="h-9 w-16 rounded-sm" />
              ))}
            </div>
            <OutlineSkeleton className="h-12 w-full max-w-sm rounded-sm mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
