'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiValidatePromotion } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Tag, X } from 'lucide-react';
import { toast } from 'sonner';

function couponDisplayLabel(coupon: {
  label?: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  code: string;
}) {
  if (coupon.label) return coupon.label;
  if (coupon.kind === 'free_shipping') return 'Free shipping';
  if (coupon.kind === 'fixed_off') return 'Fixed discount';
  return coupon.code;
}

export function CouponInput() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const { items, coupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const { token, user, guestInfo } = useAuth();

  async function handleApply() {
    setError('');
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Enter a coupon code.');
      return;
    }
    if (!items.length) {
      setError('Add items to your cart before applying a coupon.');
      return;
    }

    const lineItems = items.map((item) => {
      const price = item.variant.salePrice ?? item.variant.price;
      return {
        productId: item.product.id,
        categoryId: item.product.categoryId ?? null,
        quantity: item.quantity,
        lineTotal: price * item.quantity,
      };
    });

    setApplying(true);
    try {
      const res = await apiValidatePromotion(
        {
          code: trimmed,
          subtotal,
          lineItems,
          customerEmail: user?.email || guestInfo?.email,
        },
        token
      );

      if (!res.success || !res.data) {
        setError(res.message || 'Invalid coupon code.');
        return;
      }

      const data = res.data;
      applyCoupon({
        code: data.code,
        kind: data.kind,
        discountAmount: data.discountAmount,
        freeShipping: data.freeShipping,
        label: data.label,
      });

      toast.success(
        data.freeShipping
          ? 'Free shipping applied!'
          : data.discountAmount > 0
            ? `Coupon applied! You saved ${formatCurrency(data.discountAmount)}`
            : 'Coupon applied!'
      );
      setCode('');
    } catch {
      setError('Unable to validate coupon. Please try again.');
    } finally {
      setApplying(false);
    }
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
            {couponDisplayLabel(coupon)}
          </span>
        </div>
        <button
          onClick={() => {
            removeCoupon();
            toast.success('Coupon removed');
          }}
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
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && !applying && handleApply()}
          className="flex-1 px-3 py-2.5 text-sm border outline-none"
          style={{ borderColor: error ? '#ef4444' : 'var(--color-amoria-border)' }}
        />
        <button
          onClick={handleApply}
          disabled={applying}
          className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {applying ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}
