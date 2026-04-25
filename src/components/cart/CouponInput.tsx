'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { useValidatePromotion } from '@/lib/hooks/useApiPromotions';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Tag, X } from 'lucide-react';
import { toast } from 'sonner';

export function CouponInput() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { coupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const validateCode = useValidatePromotion();

  function handleApply() {
    setError('');
    const result = validateCode(code.trim(), subtotal);

    if (!result.valid) {
      setError(result.message);
      return;
    }

    const { promo } = result;

    // Map API promo kind → internal CouponCode type
    let discount = 0;
    let type: 'percentage' | 'freeshipping' = 'percentage';

    if (promo.kind === 'free_shipping') {
      type = 'freeshipping';
      discount = 0;
    } else if (promo.kind === 'percent_off') {
      type = 'percentage';
      discount = promo.value / 100; // e.g. 10% → 0.10
    } else if (promo.kind === 'fixed_off') {
      // Treat fixed as percentage based on current subtotal
      type = 'percentage';
      discount = subtotal > 0 ? (promo.value / subtotal) : 0;
    }

    applyCoupon({ code: promo.code, discount, type });

    const savings =
      type === 'freeshipping'
        ? 0
        : promo.kind === 'fixed_off'
        ? promo.value
        : subtotal * discount;

    toast.success(
      type === 'freeshipping'
        ? 'Free shipping applied!'
        : `Coupon applied! You saved ${formatCurrency(savings)}`
    );
    setCode('');
  }

  if (coupon) {
    return (
      <div
        className="flex items-center justify-between px-3 py-2.5 border rounded-sm"
        style={{ borderColor: 'var(--color-amoria-accent)', backgroundColor: 'rgba(201,168,76,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <Tag size={14} style={{ color: 'var(--color-amoria-accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
            {coupon.code}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {coupon.type === 'freeshipping'
              ? 'Free Shipping'
              : `${(coupon.discount * 100).toFixed(0)}% off`}
          </span>
        </div>
        <button
          onClick={() => { removeCoupon(); toast.success('Coupon removed'); }}
          className="hover:opacity-70"
        >
          <X size={14} style={{ color: 'var(--color-amoria-text-muted)' }} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1 px-3 py-2.5 text-sm border outline-none"
          style={{ borderColor: error ? '#ef4444' : 'var(--color-amoria-border)' }}
        />
        <button
          onClick={handleApply}
          className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Apply
        </button>
      </div>
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}
