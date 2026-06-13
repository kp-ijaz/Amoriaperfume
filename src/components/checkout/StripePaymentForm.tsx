'use client';

import { PaymentElement } from '@stripe/react-stripe-js';
import { Lock, ShieldCheck } from 'lucide-react';

interface StripePaymentFormProps {
  disabled?: boolean;
  onReady?: () => void;
  /** Pre-fill billing country for UAE storefront checkout. */
  defaultCountry?: string;
}

export function StripePaymentForm({
  disabled,
  onReady,
  defaultCountry = 'AE',
}: StripePaymentFormProps) {
  return (
    <div
      className={`rounded-sm overflow-hidden ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      style={{
        border: '1px solid #E8E3DC',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b"
        style={{ borderColor: '#E8E3DC', backgroundColor: 'rgba(201,168,76,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(26,10,46,0.08)' }}
          >
            <Lock size={14} style={{ color: '#1A0A2E' }} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1A0A2E' }}>
              Secure card payment
            </p>
            <p className="text-[11px]" style={{ color: '#A89880' }}>
              Encrypted by Stripe · Apple Pay & Google Pay supported
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase" style={{ color: '#A89880' }}>
          <ShieldCheck size={12} style={{ color: '#C9A84C' }} />
          SSL
        </div>
      </div>

      <div className="px-4 py-4">
        <PaymentElement
          onReady={onReady}
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
            defaultValues: {
              billingDetails: {
                address: {
                  country: defaultCountry,
                },
              },
            },
            fields: {
              billingDetails: {
                address: {
                  country: 'never',
                },
              },
            },
          }}
        />
      </div>

      <div
        className="px-4 py-2.5 border-t text-[10px] text-center tracking-wide"
        style={{ borderColor: '#E8E3DC', color: '#A89880', backgroundColor: '#FFFFFF' }}
      >
        Your payment details are never stored on Amoria servers.
      </div>
    </div>
  );
}
