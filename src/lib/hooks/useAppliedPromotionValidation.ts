'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiValidatePromotion } from '@/lib/api/client';
import { mapCartItemsToPromoLineItems } from '@/lib/cart/promoLineItems';

/** Re-validates the applied cart coupon against current line items and customer. */
export function useAppliedPromotionValidation() {
  const { items, coupon, subtotal } = useCart();
  const { token, user, guestInfo } = useAuth();
  const [promotionError, setPromotionError] = useState('');
  const [checkingPromotion, setCheckingPromotion] = useState(false);

  useEffect(() => {
    if (!coupon?.code) {
      setPromotionError('');
      setCheckingPromotion(false);
      return;
    }

    if (!items.length) {
      setPromotionError('Add items to your cart before using a coupon.');
      return;
    }

    let cancelled = false;
    setCheckingPromotion(true);

    (async () => {
      try {
        const lineItems = mapCartItemsToPromoLineItems(items);

        const res = await apiValidatePromotion(
          {
            code: coupon.code,
            subtotal,
            lineItems,
            customerEmail: user?.email || guestInfo?.email,
          },
          token
        );

        if (cancelled) return;
        if (!res.success || !res.data) {
          setPromotionError(res.message || 'This coupon cannot be used on this order.');
          return;
        }
        setPromotionError('');
      } catch {
        if (!cancelled) {
          setPromotionError('Unable to validate coupon. Remove it or try again.');
        }
      } finally {
        if (!cancelled) setCheckingPromotion(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coupon?.code, items, subtotal, token, user?.email, guestInfo?.email]);

  return { promotionError, checkingPromotion };
}
