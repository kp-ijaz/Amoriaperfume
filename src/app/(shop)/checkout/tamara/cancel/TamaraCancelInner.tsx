'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function TamaraCancelInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Payment cancelled
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        You cancelled Tamara checkout. Your cart items are still available if you&apos;d like to try again.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/checkout"
          className="inline-block py-3 px-6 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Back to checkout
        </Link>
        {orderId ? (
          <Link href={`/track-order?orderId=${encodeURIComponent(orderId)}`} className="text-sm underline" style={{ color: 'var(--color-amoria-text-muted)' }}>
            View order status
          </Link>
        ) : null}
      </div>
    </div>
  );
}
