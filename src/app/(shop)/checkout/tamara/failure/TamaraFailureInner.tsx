'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function TamaraFailureInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <XCircle className="mx-auto mb-4 text-red-500" size={36} />
      <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Payment not completed
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Tamara could not approve this payment. Your order was not charged.
      </p>
      <div className="flex flex-col gap-3">
        {orderId ? (
          <Link
            href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
            className="inline-block py-3 px-6 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
          >
            View order
          </Link>
        ) : null}
        <Link href="/checkout" className="text-sm underline" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Return to checkout
        </Link>
      </div>
    </div>
  );
}
