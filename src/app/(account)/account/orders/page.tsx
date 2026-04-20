'use client';

import { useState } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Processing: '#f97316',
  Shipped: '#8b5cf6',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
};

const dummyOrders = [
  {
    id: 'AMR-123456',
    date: '2024-11-15',
    status: 'Delivered',
    items: [
      { name: 'Shaghaf Oud Aswad', brand: 'Swiss Arabian', price: 390, qty: 1, image: '/images/products/prod10.jpg' },
    ],
    total: 429.5,
  },
  {
    id: 'AMR-234567',
    date: '2024-10-28',
    status: 'Shipped',
    items: [
      { name: 'Club de Nuit Intense', brand: 'Armaf', price: 119, qty: 2, image: '/images/products/prod5.jpg' },
      { name: 'Musk Al Tahara', brand: 'Lattafa', price: 75, qty: 1, image: '/images/products/prod8.jpg' },
    ],
    total: 330.75,
  },
  {
    id: 'AMR-345678',
    date: '2024-09-05',
    status: 'Delivered',
    items: [
      { name: 'Shumukh', brand: 'Swiss Arabian', price: 650, qty: 1, image: '/images/products/prod7.jpg' },
    ],
    total: 694.75,
  },
];

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        My Orders
      </h1>

      {dummyOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-border)' }} />
          <p style={{ color: 'var(--color-amoria-text-muted)' }}>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="border bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
              {/* Order header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Order</p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-amoria-primary)' }}>{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Date</p>
                    <p className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Total</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>AED {order.total.toFixed(2)}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
                  >
                    {order.status}
                  </span>
                </div>
                {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {/* Expanded */}
              {expandedOrder === order.id && (
                <div className="border-t px-4 pb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
                  <div className="pt-4 space-y-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>{item.brand} · Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
                          AED {(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 text-xs font-medium border" style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}>
                      Track Order
                    </button>
                    <button className="px-4 py-2 text-xs font-medium" style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}>
                      Re-order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
