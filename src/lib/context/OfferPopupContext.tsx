'use client';

import { createContext, useContext, useMemo } from 'react';
import { useOfferPopupConfig } from '@/lib/hooks/usePublicCms';
import { OfferPopupConfig } from '@/lib/pricing/offerPopupPricing';
import { Product } from '@/types/product';

type OfferPopupContextValue = {
  config: OfferPopupConfig | null;
  isLoading: boolean;
  products: Product[];
};

const OfferPopupContext = createContext<OfferPopupContextValue>({
  config: null,
  isLoading: false,
  products: [],
});

export function OfferPopupProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useOfferPopupConfig();

  const value = useMemo<OfferPopupContextValue>(
    () => ({
      config: data?.config ?? null,
      isLoading,
      products: data?.products ?? [],
    }),
    [data, isLoading]
  );

  return <OfferPopupContext.Provider value={value}>{children}</OfferPopupContext.Provider>;
}

export function useOfferPopup() {
  return useContext(OfferPopupContext);
}
