'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { apiGetGiftCardSettings, apiPurchaseGiftCard } from '@/lib/api/giftCards';
import { apiCreateStripeIntent, apiGetStripeConfig } from '@/lib/api/payments';
import { amoriaStripeElementsOptions } from '@/lib/stripe/amoriaStripeAppearance';
import { buildStripeConfirmParams } from '@/lib/stripe/stripeConfirmParams';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function GiftCardStripePay({
  amount,
  name,
  email,
  mobile,
  recipientEmail,
  paymentIntentId,
  onBack,
}: {
  amount: number;
  name: string;
  email: string;
  mobile: string;
  recipientEmail: string;
  paymentIntentId: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) {
      toast.error('Payment form is not ready');
      return;
    }
    setLoading(true);
    try {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message ?? 'Payment validation failed');
      }
      const confirmResult = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: buildStripeConfirmParams(email, { name, email, phone: mobile }),
      });
      if (confirmResult.error) {
        throw new Error(confirmResult.error.message ?? 'Payment failed');
      }

      const intentId =
        paymentIntentId ||
        (typeof confirmResult.paymentIntent?.id === 'string' ? confirmResult.paymentIntent.id : '');

      if (!intentId) throw new Error('Missing payment reference');

      const res = await apiPurchaseGiftCard({
        amount,
        customerDetails: { name, email, mobile },
        recipientEmail: recipientEmail || undefined,
        paymentMethod: 'ONLINE',
        stripePaymentIntentId: intentId,
      });

      if (!res.success || !res.data?.code) {
        throw new Error(res.message ?? 'Purchase failed');
      }

      sessionStorage.setItem(
        'amoria_gift_card_purchase',
        JSON.stringify({ code: res.data.code, amount, email })
      );
      router.push('/gift-cards/confirmation');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not purchase gift card');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border p-6" style={{ borderColor: '#E8E3DC', backgroundColor: 'white' }}>
      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1A0A2E' }}>
        <CreditCard size={18} style={{ color: '#C9A84C' }} />
        Pay online — {formatCurrency(amount)}
      </div>
      <p className="text-xs" style={{ color: '#A89880' }}>
        Card, Apple Pay, or Google Pay via Stripe
      </p>
      <StripePaymentForm disabled={loading} />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 text-sm border"
          style={{ borderColor: '#E8E3DC' }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="flex-1 py-3.5 text-sm font-bold tracking-wider uppercase disabled:opacity-70"
          style={{ backgroundColor: '#1A0A2E', color: 'white' }}
        >
          {loading ? 'Processing…' : 'Pay & get code'}
        </button>
      </div>
    </div>
  );
}

export default function GiftCardsPage() {
  const [amount, setAmount] = useState('200');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [stripeSession, setStripeSession] = useState<{ publishableKey: string; clientSecret: string; paymentIntentId: string } | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  const settingsQ = useQuery({
    queryKey: ['gift-card-settings'],
    queryFn: async () => {
      const res = await apiGetGiftCardSettings();
      if (!res.success) throw new Error(res.message ?? 'Failed to load settings');
      return res.data;
    },
  });

  const minAmount = settingsQ.data?.minGiftCardAmount ?? 100;
  const parsedAmount = Number(amount) || 0;
  const amountValid = parsedAmount >= minAmount;

  const stripePromise = useMemo(
    () => (stripeSession ? loadStripe(stripeSession.publishableKey) : null),
    [stripeSession]
  );

  async function goToPayment() {
    if (!amountValid) {
      toast.error(`Minimum gift card amount is ${formatCurrency(minAmount)}`);
      return;
    }
    if (!name.trim() || !email.trim() || mobile.trim().length < 10) {
      toast.error('Please fill in your name, email, and phone');
      return;
    }

    setLoadingIntent(true);
    try {
      const [configRes, intentRes] = await Promise.all([
        apiGetStripeConfig(),
        apiCreateStripeIntent({
          kind: 'gift_card',
          amount: parsedAmount,
          customerDetails: { name: name.trim(), email: email.trim(), mobile: mobile.trim() },
        }),
      ]);
      if (!configRes.success || !configRes.data?.publishableKey) {
        throw new Error(configRes.message ?? 'Stripe is not configured');
      }
      if (!intentRes.success || !intentRes.data?.clientSecret) {
        throw new Error(intentRes.message ?? 'Could not start payment');
      }
      setStripeSession({
        publishableKey: configRes.data.publishableKey,
        clientSecret: intentRes.data.clientSecret,
        paymentIntentId: intentRes.data.paymentIntentId,
      });
      setStep('payment');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load payment');
    } finally {
      setLoadingIntent(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Gift size={32} className="mx-auto mb-4" style={{ color: '#C9A84C' }} />
        <h1 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
          Gift <em style={{ color: '#C9A84C' }}>Cards</em>
        </h1>
        <p className="text-sm" style={{ color: '#6B6B6B' }}>
          Give the gift of fragrance. Digital codes delivered instantly after payment.
        </p>
        <p className="text-xs mt-2" style={{ color: '#A89880' }}>
          Minimum purchase: {formatCurrency(minAmount)}
        </p>
      </div>

      {step === 'details' ? (
        <div className="space-y-4 border p-6" style={{ borderColor: '#E8E3DC', backgroundColor: 'white' }}>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A89880' }}>
              Gift card amount (AED)
            </label>
            <input
              type="number"
              min={minAmount}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full border px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: amountValid ? '#E8E3DC' : '#ef4444' }}
            />
            {!amountValid && (
              <p className="text-xs text-red-500 mt-1">Minimum amount is {formatCurrency(minAmount)}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A89880' }}>Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: '#E8E3DC' }} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A89880' }}>Your email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: '#E8E3DC' }} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A89880' }}>Mobile</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1 w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: '#E8E3DC' }} placeholder="+971…" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A89880' }}>Send to (optional)</label>
            <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="mt-1 w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: '#E8E3DC' }} placeholder="Recipient email" />
          </div>

          <button
            type="button"
            onClick={goToPayment}
            disabled={!amountValid || loadingIntent}
            className="w-full py-3.5 text-sm font-bold tracking-wider uppercase disabled:opacity-50"
            style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
          >
            {loadingIntent ? 'Loading payment…' : 'Continue to payment'}
          </button>
        </div>
      ) : stripeSession && stripePromise ? (
        <Elements stripe={stripePromise} options={amoriaStripeElementsOptions(stripeSession.clientSecret)}>
          <GiftCardStripePay
            amount={parsedAmount}
            name={name.trim()}
            email={email.trim()}
            mobile={mobile.trim()}
            recipientEmail={recipientEmail.trim()}
            paymentIntentId={stripeSession.paymentIntentId}
            onBack={() => setStep('details')}
          />
        </Elements>
      ) : null}

      <p className="text-center text-xs mt-8" style={{ color: '#A89880' }}>
        Redeem at checkout or in any Amoria store.{' '}
        <Link href="/products" className="underline" style={{ color: '#C9A84C' }}>Shop now</Link>
      </p>
    </div>
  );
}
