'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { apiGetTamaraOrderStatus } from '@/lib/api/payments';
import { useCart } from '@/lib/hooks/useCart';

export default function TamaraSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const email = searchParams.get('email') || '';
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'polling' | 'paid' | 'pending' | 'failed'>('polling');
  const [message, setMessage] = useState('Confirming your Tamara payment…');

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      setMessage('Missing order reference.');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    async function poll() {
      attempts += 1;
      try {
        const res = await apiGetTamaraOrderStatus({
          orderId,
          email: email || undefined,
        });
        if (cancelled) return;
        if (res.success && res.data?.paymentStatus === 'PAID') {
          clearCart();
          setStatus('paid');
          setMessage('Payment confirmed! Redirecting…');
          const params = new URLSearchParams({ orderId });
          router.replace(`/order-confirmation?${params.toString()}`);
          return;
        }
        if (res.data?.paymentStatus === 'FAILED') {
          setStatus('failed');
          setMessage('Tamara payment was not approved.');
          return;
        }
        if (attempts >= maxAttempts) {
          setStatus('pending');
          setMessage('Payment is still processing. You can track your order shortly.');
          return;
        }
        setTimeout(poll, 2500);
      } catch {
        if (cancelled) return;
        if (attempts >= maxAttempts) {
          setStatus('pending');
          setMessage('We could not confirm payment yet. Check your email or track your order.');
        } else {
          setTimeout(poll, 2500);
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId, email, clearCart, router]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {status === 'polling' && <Loader2 className="mx-auto mb-4 animate-spin" size={32} />}
      {status === 'paid' && <CheckCircle2 className="mx-auto mb-4 text-green-600" size={36} />}
      <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Tamara Payment
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>{message}</p>
      {status === 'pending' || status === 'failed' ? (
        <div className="flex flex-col gap-3">
          {orderId ? (
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
              className="inline-block py-3 px-6 text-sm font-semibold"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
            >
              Track order
            </Link>
          ) : null}
          <Link href="/" className="text-sm underline" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Continue shopping
          </Link>
        </div>
      ) : null}
    </div>
  );
}
