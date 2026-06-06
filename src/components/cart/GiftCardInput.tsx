'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { apiValidateGiftCard } from '@/lib/api/giftCards';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Gift, X } from 'lucide-react';
import { toast } from 'sonner';

export function GiftCardInput() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { giftCard, applyGiftCard, removeGiftCard } = useCart();

  async function handleApply() {
    setError('');
    const trimmed = code.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await apiValidateGiftCard(trimmed);
      if (!res.success || !res.data?.valid || !res.data.code || res.data.balance == null) {
        setError(res.data?.message || res.message || 'Invalid gift card');
        return;
      }
      applyGiftCard({
        code: res.data.code,
        balance: res.data.balance,
      });
      toast.success(`Gift card applied · Balance ${formatCurrency(res.data.balance)}`);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not validate gift card');
    } finally {
      setLoading(false);
    }
  }

  if (giftCard) {
    return (
      <div
        className="flex items-center justify-between px-3 py-2.5 border rounded-sm"
        style={{ borderColor: 'var(--color-amoria-accent)', backgroundColor: 'rgba(201,168,76,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <Gift size={14} style={{ color: 'var(--color-amoria-accent)' }} />
          <span className="text-sm font-semibold font-mono" style={{ color: 'var(--color-amoria-accent)' }}>
            {giftCard.code}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Balance {formatCurrency(giftCard.balance)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            removeGiftCard();
            toast.success('Gift card removed');
          }}
          className="hover:opacity-70"
        >
          <X size={14} style={{ color: 'var(--color-amoria-text-muted)' }} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Gift card code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1 px-3 py-2.5 text-sm border outline-none font-mono"
          style={{ borderColor: error ? '#ef4444' : 'var(--color-amoria-border)' }}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {loading ? '…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}
