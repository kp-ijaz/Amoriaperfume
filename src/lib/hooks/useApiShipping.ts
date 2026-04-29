'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetShippingQuote } from '@/lib/api/client';
import { ShippingQuoteResponse } from '@/lib/api/types';

const DEFAULT_COUNTRY = 'UAE';

export function useShippingQuote(country: string | undefined, subtotal: number) {
  const normalizedCountry = (country || DEFAULT_COUNTRY).trim() || DEFAULT_COUNTRY;
  const normalizedSubtotal = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;

  return useQuery({
    queryKey: ['shipping-quote', normalizedCountry, normalizedSubtotal],
    queryFn: async (): Promise<ShippingQuoteResponse> => {
      const res = await apiGetShippingQuote({
        country: normalizedCountry,
        subtotal: normalizedSubtotal,
      });
      if (!res.success || !res.data) {
        return { shippingCharge: 0, freeShippingApplied: false, matchedRule: null };
      }
      return res.data;
    },
    enabled: normalizedSubtotal >= 0,
    staleTime: 60 * 1000,
  });
}
