'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getReturnDetail, RETURN_STATUS_LABELS, type ReturnRequest } from '@/lib/api/returns';
import { useReturnAuthToken } from '@/lib/hooks/useReturns';

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

function hasPickupTracking(pickup?: ReturnRequest['pickup']) {
  return Boolean(
    pickup?.courierName?.trim() ||
      pickup?.trackingId?.trim() ||
      pickup?.scheduledAt ||
      pickup?.address?.trim()
  );
}

function hasReplacementTracking(
  shipment?: ReturnRequest['replacementShipment'],
  replacementOrder?: ReturnRequest['replacementOrder']
) {
  return Boolean(
    shipment?.courierName?.trim() ||
      shipment?.trackingId?.trim() ||
      shipment?.shippedAt ||
      shipment?.deliveredAt ||
      replacementOrder?.courierName?.trim() ||
      replacementOrder?.trackingId?.trim()
  );
}

function TrackingRow({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex flex-wrap gap-x-2 text-sm" style={{ color: 'var(--color-amoria-text)' }}>
      <span className="font-medium" style={{ color: 'var(--color-amoria-text-muted)' }}>
        {label}:
      </span>
      <span>{value}</span>
    </div>
  );
}

export default function ReturnDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { token, isAuthenticated } = useReturnAuthToken();
  const [data, setData] = useState<Awaited<ReturnType<typeof getReturnDetail>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getReturnDetail(id, token)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load request'))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="mb-4">Please sign in to view this request.</p>
        <Link href="/login" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-32 bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-red-600 mb-4">{error || 'Request not found'}</p>
        <Link href="/account/returns" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
          Back to my returns
        </Link>
      </div>
    );
  }

  const color = statusColors[data.status] ?? '#6b7280';
  const pickup = data.pickup;
  const replacementShipment = data.replacementShipment;
  const replacementOrder = data.replacementOrder;
  const replacementCourier =
    replacementShipment?.courierName?.trim() ||
    replacementOrder?.courierName?.trim() ||
    '';
  const replacementTracking =
    replacementShipment?.trackingId?.trim() ||
    replacementOrder?.trackingId?.trim() ||
    '';

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <Link
        href="/account/returns"
        className="text-sm mb-4 inline-block"
        style={{ color: 'var(--color-amoria-text-muted)' }}
      >
        ← Back to my returns
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
          >
            {data.requestId}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Order {data.orderBusinessId} · Submitted {formatDate(data.createdAt)}
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {RETURN_STATUS_LABELS[data.status] ?? data.status}
        </span>
      </div>

      {data.status === 'REJECTED' && data.rejectionReason ? (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-sm text-red-800">
          <strong>Request rejected:</strong> {data.rejectionReason}
        </div>
      ) : null}

      <div className="space-y-4">
        <section className="border bg-white p-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Product
          </h2>
          <div className="flex gap-3">
            {data.lineItem.image ? (
              <div className="relative w-16 h-16 bg-gray-100 shrink-0">
                <Image src={data.lineItem.image} alt={data.lineItem.productName} fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div>
              <p className="font-medium" style={{ color: 'var(--color-amoria-text)' }}>
                {data.lineItem.productName}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                Qty: {data.lineItem.quantity}
              </p>
            </div>
          </div>
        </section>

        <section className="border bg-white p-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Issue reported
          </h2>
          <p className="font-medium" style={{ color: 'var(--color-amoria-text)' }}>
            {data.conditionSnapshot?.title ?? '—'}
          </p>
          {data.conditionSnapshot?.description ? (
            <p className="text-sm mt-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {data.conditionSnapshot.description}
            </p>
          ) : null}
          {data.description?.trim() ? (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-amoria-border)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
                Your notes
              </p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-amoria-text)' }}>
                {data.description}
              </p>
            </div>
          ) : null}
        </section>

        <section className="border bg-white p-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Proof submitted
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(data.evidence || []).map((ev, i) => (
              <div key={`${ev.url}-${i}`} className="border overflow-hidden" style={{ borderColor: 'var(--color-amoria-border)' }}>
                <p className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-50" style={{ color: 'var(--color-amoria-text-muted)' }}>
                  {ev.mediaType === 'video' ? 'Video' : 'Image'}
                </p>
                {ev.mediaType === 'video' ? (
                  <video src={ev.url} controls className="w-full aspect-square object-cover" preload="metadata" />
                ) : (
                  <div className="relative w-full aspect-square">
                    <Image src={ev.url} alt={`Return evidence ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {hasPickupTracking(pickup) || hasReplacementTracking(replacementShipment, replacementOrder) ? (
          <section className="border bg-white p-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
              Tracking
            </h2>
            <div className="space-y-4">
              {hasPickupTracking(pickup) ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
                    Return pickup
                  </p>
                  <div className="space-y-1">
                    <TrackingRow label="Courier" value={pickup?.courierName} />
                    <TrackingRow label="Tracking ID" value={pickup?.trackingId} />
                    {pickup?.scheduledAt ? (
                      <TrackingRow label="Scheduled" value={formatDate(pickup.scheduledAt)} />
                    ) : null}
                    <TrackingRow label="Pickup address" value={pickup?.address} />
                    <TrackingRow label="Instructions" value={pickup?.instructions} />
                  </div>
                </div>
              ) : null}

              {hasReplacementTracking(replacementShipment, replacementOrder) ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
                    Replacement delivery
                  </p>
                  <div className="space-y-1">
                    {replacementOrder?.orderId ? (
                      <TrackingRow label="Replacement order" value={replacementOrder.orderId} />
                    ) : null}
                    <TrackingRow label="Courier" value={replacementCourier} />
                    <TrackingRow label="Tracking ID" value={replacementTracking} />
                    {replacementShipment?.shippedAt ? (
                      <TrackingRow label="Shipped" value={formatDate(replacementShipment.shippedAt)} />
                    ) : null}
                    {replacementShipment?.deliveredAt ? (
                      <TrackingRow label="Delivered" value={formatDate(replacementShipment.deliveredAt)} />
                    ) : null}
                    {replacementOrder?.orderStatus ? (
                      <TrackingRow label="Status" value={RETURN_STATUS_LABELS[replacementOrder.orderStatus] ?? replacementOrder.orderStatus} />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {data.statusHistory?.length ? (
          <section className="border bg-white p-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
              Status updates
            </h2>
            <ul className="space-y-3">
              {[...(data.statusHistory || [])].reverse().map((entry, index) => (
                <li
                  key={`${entry.status}-${entry.updatedAt}-${index}`}
                  className="border-l-2 pl-3"
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>
                    {RETURN_STATUS_LABELS[entry.status] ?? entry.status}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                    {formatDate(entry.updatedAt)}
                  </p>
                  {entry.note?.trim() ? (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
                      {entry.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
