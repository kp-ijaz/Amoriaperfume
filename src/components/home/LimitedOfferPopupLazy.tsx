'use client';

import dynamic from 'next/dynamic';

const LimitedOfferPopup = dynamic(
  () => import('@/components/home/LimitedOfferPopup').then((m) => m.LimitedOfferPopup),
  { ssr: false, loading: () => null }
);

export function LimitedOfferPopupLazy() {
  return <LimitedOfferPopup />;
}
