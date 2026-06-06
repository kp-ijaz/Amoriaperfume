'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetPromotions } from '@/lib/api/client';
import { ApiPromotion } from '@/lib/api/types';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async (): Promise<ApiPromotion[]> => {
      const res = await apiGetPromotions();
      if (!res.success || !Array.isArray(res.data)) return [];
      const now = new Date();
      return (res.data as ApiPromotion[]).filter((p) => {
        if (!p.active) return false;
        if (p.startsAt && new Date(p.startsAt) > now) return false;
        if (p.endsAt && new Date(p.endsAt) < now) return false;
        return true;
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Find a promotion by code and validate it against the subtotal (in AED). */
export function useValidatePromotion() {
  const { data: promotions = [] } = usePromotions();

  return function validateCode(
    code: string,
    subtotalAed: number
  ): { valid: true; promo: ApiPromotion } | { valid: false; message: string } {
    const promo = promotions.find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!promo) return { valid: false, message: 'Invalid coupon code.' };

    const minAed = promo.minSubtotal;
    if (subtotalAed < minAed) {
      return {
        valid: false,
        message: `Minimum order of AED ${minAed.toFixed(2)} required for this code.`,
      };
    }
    return { valid: true, promo };
  };
}
