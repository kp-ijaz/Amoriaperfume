'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';

export function CartPageClient() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-border)' }} />
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
          Your cart is empty
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Discover our collection of authentic Arabian fragrances
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Shopping Cart ({items.reduce((a, i) => a + i.quantity, 0)} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Cart items */}
        <div>
          {items.map((item) => (
            <CartItem key={`${item.product.id}-${item.variant.id}`} item={item} />
          ))}
          <div className="mt-4">
            <Link
              href="/products"
              className="text-sm hover:opacity-80"
              style={{ color: 'var(--color-amoria-accent)' }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <CartSummary country="UAE" />
        </div>
      </div>
    </div>
  );
}
