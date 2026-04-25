'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useOrders } from '@/lib/hooks/useApiOrders';
import { ApiOrder } from '@/lib/api/types';

const statusColors: Record<string, string> = {
  PENDING:    '#f59e0b',
  CONFIRMED:  '#3b82f6',
  PROCESSING: '#f97316',
  SHIPPED:    '#8b5cf6',
  DELIVERED:  '#22c55e',
  CANCELLED:  '#ef4444',
  // lowercase fallbacks
  pending:    '#f59e0b',
  confirmed:  '#3b82f6',
  processing: '#f97316',
  shipped:    '#8b5cf6',
  delivered:  '#22c55e',
  cancelled:  '#ef4444',
};

function filsToAed(fils: number) {
  return (fils / 100).toFixed(2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' });
}

function OrderCard({ order }: { order: ApiOrder }) {
  const [expanded, setExpanded] = useState(false);
  const status = order.status ?? order.payment?.paymentStatus ?? 'PENDING';
  const statusColor = statusColors[status] ?? '#6b7280';
  const totalAed = filsToAed(order.pricing?.totalAmount ?? 0);

  return (
    <div className="border bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Order</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-amoria-primary)' }}>{order.orderId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Date</p>
            <p className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Total</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>AED {totalAed}</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          >
            {status.toLowerCase()}
          </span>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <div className="pt-4 space-y-3 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>{item.productName}</p>
                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>{item.brand} · Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
                  AED {filsToAed(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* Address */}
          {order.shippingAddress && (
            <p className="text-xs mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
              Deliver to: {order.shippingAddress.fullAddress}, {order.shippingAddress.city}
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/track-order?orderId=${encodeURIComponent(order.orderId)}`}
              className="px-4 py-2 text-xs font-medium border transition-colors hover:bg-[#1A0A2E] hover:text-[#C9A84C] hover:border-[#1A0A2E]"
              style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
            >
              Track Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        My Orders
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-border)' }} />
          <p style={{ color: 'var(--color-amoria-text-muted)' }}>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
