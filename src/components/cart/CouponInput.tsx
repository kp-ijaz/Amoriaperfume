'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { coupons } from '@/lib/data/coupons';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Tag, X } from 'lucide-react';
import { toast } from 'sonner';

export function CouponInput() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { coupon, applyCoupon, removeCoupon, subtotal } = useCart();

  function handleApply() {
    const upper = code.trim().toUpperCase();
    const data = coupons[upper];
    if (!data) {
      setError('Invalid coupon code. Please try again.');
      return;
    }
    applyCoupon({ code: upper, discount: data.discount, type: data.type });
    const savings = data.type === 'percentage' ? subtotal * data.discount : 0;
    toast.success(
      data.type === 'freeshipping'
        ? 'Free shipping applied!'
        : `Coupon applied! You saved ${formatCurrency(savings)}`
    );
    setCode('');
    setError('');
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
            {coupon.type === 'freeshipping' ? 'Free Shipping' : `${(coupon.discount * 100).toFixed(0)}% off`}
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
