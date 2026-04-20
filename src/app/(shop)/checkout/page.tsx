'use client';

import { useState } from 'react';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { AddressStep } from '@/components/checkout/AddressStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { Address } from '@/types/user';

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'cod' | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1
        className="text-2xl font-semibold text-center mb-8"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Checkout
      </h1>

      <CheckoutStepper currentStep={step} />

      {step === 1 && (
        <AddressStep
          onNext={(addr) => {
            setAddress(addr);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <PaymentStep
          onNext={(method) => {
            setPaymentMethod(method);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ReviewStep
          address={address}
          paymentMethod={paymentMethod}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
