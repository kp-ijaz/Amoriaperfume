'use client';

import { CheckCircle2, Clock, MapPin, Package, Truck, X } from 'lucide-react';
import { ApiOrder } from '@/lib/api/types';
import { getOrderStatus } from '@/lib/returns/eligibility';

type Step = { id: string; label: string; desc: string };

const DELIVERY_STEPS: Step[] = [
  { id: 'placed', label: 'Order placed', desc: 'We received your order' },
  { id: 'confirmed', label: 'Confirmed', desc: 'Preparing your items' },
  { id: 'shipped', label: 'Out for delivery', desc: 'On the way to you' },
  { id: 'delivered', label: 'Delivered', desc: 'Order completed' },
];

const PICKUP_STEPS: Step[] = [
  { id: 'placed', label: 'Order placed', desc: 'We received your order' },
  { id: 'confirmed', label: 'Confirmed', desc: 'Preparing your order' },
  { id: 'ready', label: 'Ready for pickup', desc: 'Collect from store' },
  { id: 'delivered', label: 'Collected', desc: 'Order completed' },
];

function getActiveStep(status: string, isPickup: boolean): number {
  const s = status.toUpperCase();
  if (s === 'DELIVERED') return 3;
  if (isPickup) {
    if (s === 'READY_FOR_PICKUP') return 2;
    if (s === 'SHIPPED' || s === 'PROCESSING') return 1;
    if (s === 'CONFIRMED') return 1;
    return 0;
  }
  if (s === 'SHIPPED') return 2;
  if (s === 'CONFIRMED' || s === 'PROCESSING') return 1;
  return 0;
}

function formatTrackingDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function OrderTrackingPanel({ order }: { order: ApiOrder }) {
  const status = getOrderStatus(order);
  const paymentFailed =
    order.payment?.paymentMethod === 'ONLINE' && order.payment?.paymentStatus === 'FAILED';

  if (paymentFailed) {
    return (
      <div
        className="mb-4 p-3 flex items-start gap-2 text-sm"
        style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <X size={16} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <p style={{ color: '#6B6B6B' }}>
          Your order is saved but payment is incomplete. Complete payment above to start processing.
        </p>
      </div>
    );
  }

  const isPickup = order.fulfillmentType === 'PICKUP';
  const steps = isPickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const activeStep = getActiveStep(status, isPickup);
  const isCancelled = status === 'CANCELLED';
  const trackingId = order.logistics?.trackingId?.trim();
  const courierName = order.logistics?.courierName?.trim();
  const history = [...(order.statusHistory || [])].reverse().slice(0, 4);

  if (isCancelled) {
    return (
      <div
        className="mb-4 p-3 flex items-start gap-2 text-sm"
        style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <X size={16} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <p style={{ color: '#ef4444' }}>This order was cancelled.</p>
      </div>
    );
  }

  return (
    <div
      className="mb-4 p-4"
      style={{ backgroundColor: '#FAF8F5', border: '1px solid var(--color-amoria-border)' }}
    >
      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: '#1A0A2E' }}>
        Tracking
      </h4>

      <div className="relative mb-4">
        <div className="absolute left-4 top-4 right-4 h-0.5" style={{ backgroundColor: '#E8E3DC' }} />
        <div
          className="absolute left-4 top-4 h-0.5 transition-all"
          style={{
            backgroundColor: '#C9A84C',
            width: activeStep === 0 ? '0%' : `calc(${(activeStep / (steps.length - 1)) * 100}% - 2rem)`,
          }}
        />
        <div className="relative grid grid-cols-4 gap-1">
          {steps.map((step, idx) => {
            const done = idx <= activeStep;
            const current = idx === activeStep;
            const Icon = idx === 0 ? Package : idx === 1 ? CheckCircle2 : idx === 2 ? (isPickup ? MapPin : Truck) : MapPin;
            return (
              <div key={step.id} className="flex flex-col items-center text-center gap-1.5">
                <div
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: done ? '#C9A84C' : '#FFFFFF',
                    border: `2px solid ${done ? '#C9A84C' : '#E8E3DC'}`,
                    color: done ? '#1A0A2E' : '#A89880',
                    boxShadow: current ? '0 0 0 3px rgba(201,168,76,0.2)' : 'none',
                  }}
                >
                  <Icon size={13} />
                </div>
                <p className="text-[10px] font-semibold leading-tight" style={{ color: done ? '#1A0A2E' : '#A89880' }}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {trackingId ? (
        <div className="mb-3 text-xs" style={{ color: '#6B6B6B' }}>
          <span className="font-semibold" style={{ color: '#1A0A2E' }}>Tracking ID:</span>{' '}
          {trackingId}
          {courierName ? ` · ${courierName}` : ''}
        </div>
      ) : null}

      {status !== 'DELIVERED' && !isPickup ? (
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: '#6B6B6B' }}>
          <Clock size={12} style={{ color: '#C9A84C' }} />
          Estimated delivery: <span className="font-semibold" style={{ color: '#1A0A2E' }}>1–2 days</span>
        </div>
      ) : null}

      {history.length > 0 ? (
        <div className="pt-3 border-t space-y-2" style={{ borderColor: '#E8E3DC' }}>
          {history.map((entry, idx) => (
            <div key={`${entry.status}-${idx}`} className="flex items-center justify-between gap-2 text-xs">
              <span className="capitalize font-medium" style={{ color: '#1A0A2E' }}>
                {String(entry.status).toLowerCase().replace(/_/g, ' ')}
              </span>
              <span style={{ color: '#A89880' }}>{formatTrackingDate(entry.updatedAt)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs" style={{ color: '#A89880' }}>
          Current status: <span className="font-semibold capitalize" style={{ color: '#1A0A2E' }}>{status.toLowerCase()}</span>
        </p>
      )}
    </div>
  );
}
