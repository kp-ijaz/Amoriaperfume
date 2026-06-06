'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

type PurchasePayload = {
  code: string;
  amount: number;
  email: string;
};

export default function GiftCardConfirmationPage() {
  const [data, setData] = useState<PurchasePayload | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('amoria_gift_card_purchase');
      if (!raw) return;
      setData(JSON.parse(raw) as PurchasePayload);
      sessionStorage.removeItem('amoria_gift_card_purchase');
    } catch {
      setData(null);
    }
  }, []);

  async function copyCode() {
    if (!data?.code) return;
    await navigator.clipboard.writeText(data.code);
    setCopied(true);
    toast.success('Code copied');
    setTimeout(() => setCopied(false), 2000);
  }

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
          No recent gift card purchase found.
        </p>
        <Link
          href="/gift-cards"
          className="inline-block px-6 py-3 text-sm font-semibold"
          style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
        >
          Buy a gift card
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}
      >
        <Gift size={28} style={{ color: '#C9A84C' }} />
      </div>
      <h1
        className="text-2xl font-light mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
      >
        Your gift card is ready
      </h1>
      <p className="text-sm mb-8" style={{ color: '#6B6B6B' }}>
        {formatCurrency(data.amount)} · Confirmation sent to {data.email}
      </p>

      <div
        className="border p-6 mb-6"
        style={{ borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.06)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#A89880' }}>
          Gift card code
        </p>
        <p className="text-2xl font-mono font-bold tracking-widest mb-4" style={{ color: '#1A0A2E' }}>
          {data.code}
        </p>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border"
          style={{ borderColor: '#C9A84C', color: '#6B4A1E' }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>

      <Link
        href="/products"
        className="inline-block w-full py-3.5 text-sm font-bold tracking-wider uppercase"
        style={{ backgroundColor: '#1A0A2E', color: 'white' }}
      >
        Shop now
      </Link>
    </div>
  );
}
