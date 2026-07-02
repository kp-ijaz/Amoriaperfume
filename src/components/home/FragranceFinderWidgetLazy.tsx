'use client';

import dynamic from 'next/dynamic';

const FragranceFinderWidget = dynamic(
  () =>
    import('@/components/home/FragranceFinderWidget').then((m) => m.FragranceFinderWidget),
  { ssr: false, loading: () => null }
);

export function FragranceFinderWidgetLazy() {
  return <FragranceFinderWidget />;
}
