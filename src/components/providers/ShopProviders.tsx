'use client';

import { OfferPopupProvider } from '@/lib/context/OfferPopupContext';

export function ShopProviders({ children }: { children: React.ReactNode }) {
  return <OfferPopupProvider>{children}</OfferPopupProvider>;
}
