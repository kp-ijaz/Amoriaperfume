'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { Address } from '@/types/user';
import { CartSummary } from '@/components/cart/CartSummary';
import Image from 'next/image';

interface ReviewStepProps {
  address: Address | null;
  paymentMethod: 'card' | 'applepay' | 'cod' | null;
  onBack: () => void;
}

const methodLabels = { card: 'Credit/Debit Card', applepay: 'Apple Pay', cod: 'Cash on Delivery' };

export function ReviewStep({ address, paymentMethod, onBack }: ReviewStepProps) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handlePlaceOrder() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    router.push('/order-confirmation');
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Review Your Order
      </h2>

      {/* Delivery */}
      {address && (
        <div className="mb-5 p-4 border" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>Delivery To</h3>
          <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>{address.fullName}</p>
          <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>{address.street}, {address.area}, {address.emirate}</p>
          <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>{address.phone}</p>
        </div>
      )}

      {/* Payment */}
      {paymentMethod && (
        <div className="mb-5 p-4 border" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>Payment</h3>
          <p className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>{methodLabels[paymentMethod]}</p>
        </div>
      )}

      {/* Items */}
      <div className="mb-5 p-4 border" style={{ borderColor: 'var(--color-amoria-border)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Order Items ({items.reduce((a, i) => a + i.quantity, 0)})
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const imageUrl = item.product.images.find((i) => i.isPrimary)?.url ?? item.product.images[0]?.url;
            return (
              <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 bg-gray-50 flex-shrink-0">
                  {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="object-cover" unoptimized />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>{item.product.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>Qty: {item.quantity} · {item.variant.concentration}</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
                  AED {((item.variant.salePrice ?? item.variant.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <CartSummary showCheckoutButton={false} paymentMethod={paymentMethod ?? undefined} />

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 text-sm border font-medium"
          style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="flex-1 py-3 text-sm font-semibold transition-opacity disabled:opacity-70"
          style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
