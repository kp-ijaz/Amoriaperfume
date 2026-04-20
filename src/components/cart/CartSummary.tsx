'use client';

import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import { CouponInput } from './CouponInput';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  paymentMethod?: 'cod' | 'card' | 'applepay';
}

export function CartSummary({ showCheckoutButton = true, paymentMethod }: CartSummaryProps) {
  const {
    formattedSubtotal,
    formattedCouponDiscount,
    formattedShipping,
    formattedVat,
    formattedTotal,
    coupon,
    couponDiscount,
    freeShipping,
    total,
    COD_FEE,
  } = useCart();

  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const finalTotal = total + codFee;

  return (
    <div
      className="border p-5 space-y-4"
      style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: 'var(--color-amoria-surface-2, #F5F2EE)' }}
    >
      <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--color-amoria-primary)' }}>
        Order Summary
      </h3>

      <CouponInput />

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-amoria-text-muted)' }}>Subtotal</span>
          <span style={{ color: 'var(--color-amoria-text)' }}>{formattedSubtotal}</span>
        </div>
        {coupon && couponDiscount > 0 && (
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-amoria-text-muted)' }}>Discount ({coupon.code})</span>
            <span className="text-green-600">-{formattedCouponDiscount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-amoria-text-muted)' }}>Shipping</span>
          <span style={{ color: freeShipping ? 'green' : 'var(--color-amoria-text)' }}>
            {formattedShipping}
          </span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-amoria-text-muted)' }}>COD Fee</span>
            <span style={{ color: 'var(--color-amoria-text)' }}>AED {codFee}.00</span>
          </div>
        )}
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-amoria-text-muted)' }}>VAT (5%)</span>
          <span style={{ color: 'var(--color-amoria-text)' }}>{formattedVat}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="font-bold text-base" style={{ color: 'var(--color-amoria-primary)' }}>
          Total
        </span>
        <span className="font-bold text-lg" style={{ color: 'var(--color-amoria-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
          AED {finalTotal.toFixed(2)}
        </span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full text-center py-3.5 text-sm font-semibold tracking-wider uppercase transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Proceed to Checkout
        </Link>
      )}

      {!freeShipping && (
        <p className="text-xs text-center" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Add more items to qualify for free shipping (AED 200+)
        </p>
      )}
    </div>
  );
}
