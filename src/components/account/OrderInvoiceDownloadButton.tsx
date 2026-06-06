'use client';

import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { apiDownloadOrderInvoice } from '@/lib/api/client';

type Props = {
  orderId: string;
  invoiceNumber?: string;
  authToken?: string | null;
  guestEmail?: string;
  className?: string;
};

export function OrderInvoiceDownloadButton({
  orderId,
  invoiceNumber,
  authToken,
  guestEmail,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);
    setError('');
    try {
      await apiDownloadOrderInvoice(orderId, {
        token: authToken,
        email: guestEmail,
        filename: invoiceNumber ? `Invoice-${invoiceNumber}.pdf` : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border transition-colors hover:bg-[#1A0A2E] hover:text-[#C9A84C] hover:border-[#1A0A2E] disabled:opacity-60"
        style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
      >
        <FileDown size={14} />
        {loading ? 'Downloading…' : 'Download invoice'}
      </button>
      {error ? (
        <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
