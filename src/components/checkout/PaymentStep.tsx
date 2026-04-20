'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentStepProps {
  onNext: (method: 'card' | 'applepay' | 'cod') => void;
  onBack: () => void;
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const [method, setMethod] = useState<'card' | 'applepay' | 'cod'>('card');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Payment Method
      </h2>

      <div className="space-y-3 mb-6">
        {/* Card */}
        <div
          className="border p-4 cursor-pointer transition-colors"
          style={{
            borderColor: method === 'card' ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
            backgroundColor: method === 'card' ? 'rgba(26,10,46,0.03)' : 'white',
          }}
          onClick={() => setMethod('card')}
        >
          <div className="flex items-center gap-3 mb-3">
            <input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} />
            <CreditCard size={20} style={{ color: 'var(--color-amoria-primary)' }} />
            <span className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>Credit / Debit Card</span>
          </div>
          {method === 'card' && (
            <div className="space-y-3 ml-6">
              <input
                type="text"
                placeholder="Card Number"
                maxLength={19}
                className="w-full border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  className="w-full border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                />
              </div>
              <input
                type="text"
                placeholder="Name on Card"
                className="w-full border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>
          )}
        </div>

        {/* Apple Pay */}
        <div
          className="border p-4 cursor-pointer transition-colors flex items-center gap-3"
          style={{
            borderColor: method === 'applepay' ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
            backgroundColor: method === 'applepay' ? 'rgba(26,10,46,0.03)' : 'white',
          }}
          onClick={() => setMethod('applepay')}
        >
          <input type="radio" checked={method === 'applepay'} onChange={() => setMethod('applepay')} />
          <Smartphone size={20} style={{ color: 'var(--color-amoria-primary)' }} />
          <div>
            <span className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>Apple Pay</span>
            <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>Touch ID / Face ID required at checkout</p>
          </div>
        </div>

        {/* COD */}
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
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 text-sm border font-medium"
          style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
        >
          Back
        </button>
        <button
          onClick={() => onNext(method)}
          className="flex-1 py-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
