'use client';

import { useEffect, useState } from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import { apiCreateStripeIntent, apiGetStripeConfig, OrderStripeIntentPayload } from '@/lib/api/payments';

export interface StripeCheckoutState {
  publishableKey: string;
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentStepProps {
  intentPayload: OrderStripeIntentPayload | null;
  stripeSession: StripeCheckoutState | null;
  onStripeSession: (session: StripeCheckoutState | null) => void;
  onNext: (method: 'stripe' | 'cod') => void;
  onBack: () => void;
  onlineEnabled: boolean;
  codEnabled: boolean;
}

export function PaymentStep({
  intentPayload,
  stripeSession,
  onStripeSession,
  onNext,
  onBack,
  onlineEnabled,
  codEnabled,
}: PaymentStepProps) {
  const [method, setMethod] = useState<'stripe' | 'cod'>(onlineEnabled ? 'stripe' : 'cod');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  useEffect(() => {
    if (method !== 'stripe' || !intentPayload || !onlineEnabled) {
      onStripeSession(null);
      return;
    }

    let cancelled = false;
    setLoadingIntent(true);
    setIntentError('');

    (async () => {
      try {
        const [configRes, intentRes] = await Promise.all([
          apiGetStripeConfig(),
          apiCreateStripeIntent(intentPayload),
        ]);
        if (cancelled) return;
        if (!configRes.success || !configRes.data?.publishableKey) {
          throw new Error(configRes.message ?? 'Stripe is not configured');
        }
        if (!intentRes.success || !intentRes.data?.clientSecret) {
          throw new Error(intentRes.message ?? 'Could not start payment');
        }
        onStripeSession({
          publishableKey: configRes.data.publishableKey,
          clientSecret: intentRes.data.clientSecret,
          paymentIntentId: intentRes.data.paymentIntentId,
        });
      } catch (err) {
        if (!cancelled) {
          onStripeSession(null);
          setIntentError(err instanceof Error ? err.message : 'Could not load payment form');
        }
      } finally {
        if (!cancelled) setLoadingIntent(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [method, intentPayload, onlineEnabled, onStripeSession]);

  function handleContinue() {
    if (method === 'cod') {
      onStripeSession(null);
      onNext('cod');
      return;
    }
    if (!stripeSession) {
      setIntentError('Payment form is not ready yet');
      return;
    }
    onNext('stripe');
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Payment Method
      </h2>

      <div className="space-y-3 mb-6">
        {onlineEnabled && (
          <div
            className="border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: method === 'stripe' ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
              backgroundColor: method === 'stripe' ? 'rgba(26,10,46,0.03)' : 'white',
            }}
            onClick={() => setMethod('stripe')}
          >
            <div className="flex items-center gap-3 mb-3">
              <input type="radio" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
              <CreditCard size={20} style={{ color: 'var(--color-amoria-primary)' }} />
              <div>
                <span className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>
                  Pay online
                </span>
                <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                  Card, Apple Pay, or Google Pay
                </p>
              </div>
            </div>
            {method === 'stripe' && (
              <div className="ml-6 space-y-2">
                {loadingIntent && (
                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                    Preparing secure checkout…
                  </p>
                )}
                {intentError && <p className="text-xs text-red-500">{intentError}</p>}
                {stripeSession && !loadingIntent && !intentError && (
                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                    Enter your card details on the review step.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {codEnabled && (
          <div
            className="border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: method === 'cod' ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
              backgroundColor: method === 'cod' ? 'rgba(26,10,46,0.03)' : 'white',
            }}
            onClick={() => setMethod('cod')}
          >
            <div className="flex items-center gap-3 mb-2">
              <input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} />
              <Banknote size={20} style={{ color: 'var(--color-amoria-primary)' }} />
              <div>
                <span className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>Cash on Delivery</span>
                <span className="ml-2 text-xs text-orange-600">+AED 10 fee</span>
              </div>
            </div>
            {method === 'cod' && (
              <div className="ml-6">
                <p className="text-xs mb-3" style={{ color: 'var(--color-amoria-text-muted)' }}>
                  We&apos;ll send a WhatsApp OTP to confirm your order
                </p>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setOtpSent(true); }}
                    className="text-sm font-medium px-4 py-2 border"
                    style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-accent)' }}
                  >
                    Send OTP via WhatsApp
                  </button>
                ) : (
                  <div>
                    <p className="text-xs mb-2 text-green-600">OTP sent to your registered number</p>
                    <div className="flex gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[i] = e.target.value;
                            setOtp(newOtp);
                          }}
                          className="w-10 h-10 border text-center text-sm outline-none font-bold"
                          style={{ borderColor: 'var(--color-amoria-border)' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 text-sm border font-medium"
          style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={method === 'stripe' && (loadingIntent || !stripeSession)}
          className="flex-1 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
