'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { useMyReturns, useReturnAuthToken } from '@/lib/hooks/useReturns';
import { RETURN_STATUS_LABELS } from '@/lib/api/returns';
import { getGuestOrdersToken } from '@/lib/api/client';
import { useAuth } from '@/lib/hooks/useAuth';

const statusColors: Record<string, string> = {
  SUBMITTED: '#3b82f6',
  UNDER_REVIEW: '#f59e0b',
  ACCEPTED: '#22c55e',
  REJECTED: '#ef4444',
  PICKUP_SCHEDULED: '#8b5cf6',
  REPLACEMENT_SHIPPED: '#0ea5e9',
  REPLACEMENT_DELIVERED: '#22c55e',
  CLOSED: '#6b7280',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function MyReturnsPage() {
  const { isLoggedIn } = useAuth();
  const { isAuthenticated } = useReturnAuthToken();
  const { data, isLoading } = useMyReturns();
  const [guestToken, setGuestToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) setGuestToken(getGuestOrdersToken());
  }, [isLoggedIn]);

  const items = data?.items ?? [];

  if (!isLoggedIn && !guestToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Sign in or verify your email on{' '}
          <Link href="/account/orders" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
            My Orders
          </Link>{' '}
          to view replacement requests.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: '#fff' }}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
        >
          My Returns
        </h1>
        <Link
          href="/account/orders"
          className="px-4 py-2 text-xs font-medium border transition-colors hover:bg-[#1A0A2E] hover:text-[#C9A84C]"
          style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
        >
          Request from an order
        </Link>
      </div>

      {!isAuthenticated ? (
        <p style={{ color: 'var(--color-amoria-text-muted)' }}>Please verify your email to continue.</p>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-24 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: '#fff' }}>
          <RotateCcw size={48} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-border)' }} />
          <p className="mb-2" style={{ color: 'var(--color-amoria-text)' }}>No replacement requests yet</p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Request a replacement from a delivered order when an item arrives damaged.
          </p>
          <Link
            href="/account/orders"
            className="inline-block px-6 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-amoria-accent)', color: '#1A0A2E' }}
          >
            View my orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((req) => {
            const color = statusColors[req.status] ?? '#6b7280';
            return (
              <Link
                key={req._id}
                href={`/account/returns/${req._id}`}
                className="block border bg-white p-4 transition-shadow hover:shadow-md"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>
                      Request
                    </p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-amoria-primary)' }}>
                      {req.requestId}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-amoria-text)' }}>
                      {req.lineItem.productName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>
                      Order {req.orderBusinessId} · {req.conditionSnapshot?.title ?? 'Replacement'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full inline-block"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {RETURN_STATUS_LABELS[req.status] ?? req.status}
                    </span>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
                      {formatDate(req.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
