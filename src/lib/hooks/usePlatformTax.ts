'use client';

import { usePublicBootstrap } from '@/lib/hooks/usePublicCms';
import type { TaxSettings } from '@/lib/utils/calculateVAT';

const DEFAULT_TAX: TaxSettings = {
  taxInclusive: false,
  taxPercent: 5,
};

export function usePlatformTax(): TaxSettings {
  const { data } = usePublicBootstrap();
  const platform = data?.platform;
  return {
    taxInclusive: !!platform?.taxInclusive,
    taxPercent: Number(platform?.taxPercent ?? DEFAULT_TAX.taxPercent),
  };
}
