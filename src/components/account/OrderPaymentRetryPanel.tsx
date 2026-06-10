'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ApiOrder } from '@/lib/api/types';
import {
  apiCompleteOrderPayment,
  apiCreateOrderPaymentIntent,
  getGuestOrdersToken,
} from '@/lib/api/client';
import { apiGetStripeConfig } from '@/lib/api/payments';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { amoriaStripeElementsOptions } from '@/lib/stripe/amoriaStripeAppearance';
import { buildStripeConfirmParams } from '@/lib/stripe/stripeConfirmParams';
import { resolveCheckoutPhone } from '@/lib/utils/checkoutPayload';

export function orderNeedsPaymentRetry(order: ApiOrder) {
  const orderStatus = (order.orderStatus ?? order.status ?? 'PENDING').toUpperCase();
  return (
    order.payment?.paymentMethod === 'ONLINE' &&
    order.payment?.paymentStatus === 'FAILED' &&
    orderStatus === 'PENDING'
  );
}

function authRequiredMessage(message: string) {
  const lower = message.toLowerCase();
  return lower.includes('authorization') || lower.includes('not authorized');
}

type RetryFormProps = {
  order: ApiOrder;
  clientSecret: string;
  paymentIntentId: string;
  authToken?: string | null;
  onSuccess: () => void;
};

function OrderPaymentRetryForm({
  order,
  clientSecret,
  paymentIntentId,
  authToken,
  onSuccess,
}: RetryFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);

  async function handlePayNow() {
    if (!stripe || !elements) {
      toast.error('Payment system is not ready. Please try again.');
      return;
    }
    if (!authToken) {
      toast.error('Sign in or verify your email on My Orders to complete payment.');
      return;
    }

    setLoading(true);
    try {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message ?? 'Payment validation failed');
      }

      const customerEmail = order.customerDetails?.email || '';
      const confirmResult = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
        confirmParams: buildStripeConfirmParams(customerEmail, {
          name: order.customerDetails?.name,
          email: customerEmail,
          phone: resolveCheckoutPhone(
            order.customerDetails?.mobile,
            order.customerDetails?.phone
          ) || undefined,
        }),
      });

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message ?? 'Payment failed');
      }

      const res = await apiCompleteOrderPayment(
        order._id,
        { stripePaymentIntentId: paymentIntentId },
        authToken
      );

      if (!res.success) {
        throw new Error(res.message ?? 'Could not complete payment');
      }

      toast.success('Payment successful — your order is confirmed.');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <StripePaymentForm disabled={loading} onReady={() => setFormReady(true)} />
      <button
        type="button"
        onClick={handlePayNow}
        disabled={loading || !formReady || !stripe || !elements || !authToken}
        className="w-full py-3 text-sm font-bold tracking-wider uppercase transition-all disabled:opacity-60"
        style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
    </div>
  );
}

type PanelProps = {
  order: ApiOrder;
  authToken?: string | null;
  onSuccess: () => void;
};

export function OrderPaymentRetryPanel({ order, authToken, onSuccess }: PanelProps) {
  const [storedGuestToken, setStoredGuestToken] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  useEffect(() => {
    setStoredGuestToken(getGuestOrdersToken());
  }, []);

  const effectiveToken = authToken || storedGuestToken;

  useEffect(() => {
    if (!orderNeedsPaymentRetry(order)) return;

    if (!effectiveToken) {
      setIntentError('');
      setPublishableKey(null);
      setClientSecret(null);
      setPaymentIntentId(null);
      setLoadingIntent(false);
      return;
    }

    let cancelled = false;
    setLoadingIntent(true);
    setIntentError('');

    (async () => {
      try {
        const [configRes, intentRes] = await Promise.all([
          apiGetStripeConfig(),
          apiCreateOrderPaymentIntent(order._id, effectiveToken),
        ]);
        if (cancelled) return;
        if (!configRes.success || !configRes.data?.publishableKey) {
          throw new Error(configRes.message ?? 'Stripe is not configured');
        }
        if (!intentRes.success || !intentRes.data?.clientSecret || !intentRes.data?.paymentIntentId) {
          throw new Error(intentRes.message ?? 'Could not start payment');
        }
        setPublishableKey(configRes.data.publishableKey);
        setClientSecret(intentRes.data.clientSecret);
        setPaymentIntentId(intentRes.data.paymentIntentId);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Could not load payment form';
          setIntentError(
            authRequiredMessage(message)
              ? 'Sign in or verify your email on My Orders to complete payment.'
              : message
          );
        }
      } finally {
        if (!cancelled) setLoadingIntent(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [order._id, effectiveToken, order.payment?.paymentStatus, order.orderStatus]);

  if (!orderNeedsPaymentRetry(order)) return null;

  return (
    <div
      className="mb-4 p-4 space-y-3"
      style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}
    >
      <div className="flex items-start gap-2">
        <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
            Payment failed
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
            Complete payment to confirm your order. Total: AED {Number(order.pricing?.totalAmount ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      {!effectiveToken ? (
        <p className="text-xs" style={{ color: '#6B6B6B' }}>
          <Link href="/account/orders" className="underline" style={{ color: '#C9A84C' }}>
            Sign in or verify your email on My Orders
          </Link>{' '}
          to complete payment securely.
        </p>
      ) : loadingIntent ? (
        <p className="text-xs" style={{ color: '#A89880' }}>
          Loading secure payment form…
        </p>
      ) : intentError ? (
        <div className="space-y-2">
          <p className="text-xs text-red-600">{intentError}</p>
          {authRequiredMessage(intentError) ? (
            <Link href="/account/orders" className="text-xs underline" style={{ color: '#C9A84C' }}>
              Go to My Orders
            </Link>
          ) : null}
        </div>
      ) : stripePromise && clientSecret && paymentIntentId ? (
        <Elements stripe={stripePromise} options={amoriaStripeElementsOptions(clientSecret)}>
          <OrderPaymentRetryForm
            order={order}
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            authToken={effectiveToken}
            onSuccess={onSuccess}
          />
        </Elements>
      ) : null}
    </div>
  );
}
