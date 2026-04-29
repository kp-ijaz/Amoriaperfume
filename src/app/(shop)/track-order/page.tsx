'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Package, CheckCircle2, Truck, MapPin,
  Clock, ArrowRight, X, Mail, Hash,
} from 'lucide-react';
import { useOrderById, useOrdersByEmail } from '@/lib/hooks/useApiOrders';
import { ApiOrder } from '@/lib/api/types';
import { formatCurrency } from '@/lib/utils/formatCurrency';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toAed(value: number) { return value; }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─── Status / timeline ────────────────────────────────────────────────────────

type StepDef = { id: string; label: string; desc: string; icon: React.ReactNode };

const TRACK_STEPS: StepDef[] = [
  { id: 'placed',    label: 'Order Placed',     desc: 'Your order has been received',  icon: <Package size={16} /> },
  { id: 'confirmed', label: 'Order Confirmed',  desc: 'Order is being prepared',       icon: <CheckCircle2 size={16} /> },
  { id: 'shipped',   label: 'Out for Delivery', desc: 'Your order is on its way',      icon: <Truck size={16} /> },
  { id: 'delivered', label: 'Delivered',        desc: 'Order has been delivered',      icon: <MapPin size={16} /> },
];

function getActiveStep(status: string): number {
  const s = status?.toUpperCase();
  if (s === 'DELIVERED')                       return 3;
  if (s === 'SHIPPED')                         return 2;
  if (s === 'CONFIRMED' || s === 'PROCESSING') return 1;
  return 0;
}

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  CONFIRMED:  { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  PROCESSING: { bg: 'rgba(249,115,22,0.12)',  color: '#f97316' },
  SHIPPED:    { bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
  DELIVERED:  { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
  CANCELLED:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
};

// ─── Single order timeline ────────────────────────────────────────────────────

function OrderTimeline({ order }: { order: ApiOrder }) {
  const status     = order.status?.toUpperCase() ?? 'PENDING';
  const activeStep = getActiveStep(status);
  const badge      = STATUS_BADGE[status] ?? STATUS_BADGE.PENDING;
  const isCancelled = status === 'CANCELLED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header card */}
      <div className="p-5" style={{ backgroundColor: '#1A0A2E', borderRadius: '4px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(201,168,76,0.6)' }}>Order ID</p>
            <p className="text-lg font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>
              {order.orderId}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Placed on {formatDate(order.createdAt)}
            </p>
            {order.customerDetails?.name && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {order.customerDetails.name}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}
            >
              {status.toLowerCase()}
            </span>
            <p className="text-sm font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(toAed(order.pricing?.totalAmount ?? 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Cancelled notice */}
      {isCancelled ? (
        <div className="p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px' }}>
          <X size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: '#ef4444' }}>This order has been cancelled.</p>
        </div>
      ) : (
        /* Progress timeline */
        <div className="p-6" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] mb-6" style={{ color: '#1A0A2E' }}>
            Tracking Progress
          </h3>

          {/* Steps */}
          <div className="relative">
            {/* Background rail */}
            <div className="absolute left-5 top-5 h-0.5 right-5" style={{ backgroundColor: '#E8E3DC', transform: 'translateY(-50%)' }} />
            {/* Gold fill */}
            <motion.div
              className="absolute left-5 top-5 h-0.5"
              style={{ backgroundColor: '#C9A84C', transform: 'translateY(-50%)' }}
              initial={{ width: '0%' }}
              animate={{ width: activeStep === 0 ? '0%' : `${(activeStep / (TRACK_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <div className="relative grid grid-cols-4 gap-1">
              {TRACK_STEPS.map((step, idx) => {
                const done    = idx <= activeStep;
                const current = idx === activeStep;
                return (
                  <div key={step.id} className="flex flex-col items-center text-center gap-2">
                    <motion.div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      style={{
                        backgroundColor: done ? '#C9A84C' : 'white',
                        border: `2px solid ${done ? '#C9A84C' : '#E8E3DC'}`,
                        color: done ? '#1A0A2E' : '#A89880',
                        boxShadow: current ? '0 0 0 4px rgba(201,168,76,0.18)' : 'none',
                      }}
                    >
                      {done && idx < activeStep ? <CheckCircle2 size={15} /> : step.icon}
                    </motion.div>
                    <div>
                      <p className="text-[11px] font-semibold leading-tight" style={{ color: done ? '#1A0A2E' : '#A89880' }}>
                        {step.label}
                      </p>
                      <p className="text-[10px] mt-0.5 hidden sm:block" style={{ color: '#A89880' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {status !== 'DELIVERED' && (
            <div className="mt-6 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid #E8E3DC' }}>
              <Clock size={13} style={{ color: '#C9A84C' }} />
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                Estimated delivery: <span className="font-semibold" style={{ color: '#1A0A2E' }}>3–5 business days</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Items + details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Items */}
        <div className="p-5" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] mb-4" style={{ color: '#1A0A2E' }}>
            Items ({order.items?.length ?? 0})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ border: '1px solid #E8E3DC' }}>
                  {item.image
                    ? <Image src={item.image} alt={item.productName} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                    : <div className="w-full h-full bg-gray-50 flex items-center justify-center"><Package size={18} style={{ color: '#E8E3DC' }} /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#A89880' }}>{item.brand}</p>
                  <p className="text-sm font-medium truncate" style={{ color: '#1C1C1C' }}>{item.productName}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: '#C9A84C' }}>
                  {formatCurrency(toAed(item.totalPrice))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery + pricing */}
        <div className="space-y-4">
          {order.shippingAddress && (
            <div className="p-5" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#1A0A2E' }}>Delivery Address</h3>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p className="text-sm" style={{ color: '#1C1C1C' }}>{order.shippingAddress.fullAddress}</p>
                  {order.shippingAddress.city && (
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>
                      {order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-5" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#1A0A2E' }}>Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Subtotal</span>
                <span>{formatCurrency(toAed(order.pricing?.subtotal ?? 0))}</span>
              </div>
              {(order.pricing?.discount ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: '#6B6B6B' }}>Discount</span>
                  <span style={{ color: '#22c55e' }}>−{formatCurrency(toAed(order.pricing.discount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Shipping</span>
                <span style={{ color: (order.pricing?.shippingCharge ?? 0) === 0 ? '#22c55e' : undefined }}>
                  {(order.pricing?.shippingCharge ?? 0) === 0 ? 'Free' : formatCurrency(toAed(order.pricing.shippingCharge))}
                </span>
              </div>
              {(order.pricing?.tax ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: '#6B6B6B' }}>VAT (5%)</span>
                  <span>{formatCurrency(toAed(order.pricing.tax))}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-semibold" style={{ borderTop: '1px solid #E8E3DC' }}>
                <span style={{ color: '#1A0A2E' }}>Total</span>
                <span style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(toAed(order.pricing?.totalAmount ?? 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Order list row (for email lookup) ───────────────────────────────────────

function OrderRow({ order, onSelect }: { order: ApiOrder; onSelect: (o: ApiOrder) => void }) {
  const status = order.status?.toUpperCase() ?? 'PENDING';
  const badge  = STATUS_BADGE[status] ?? STATUS_BADGE.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between gap-4 p-4 cursor-pointer transition-colors"
      style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E3DC')}
      onClick={() => onSelect(order)}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Package size={16} style={{ color: '#C9A84C' }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: '#1A0A2E' }}>{order.orderId}</p>
          <p className="text-xs" style={{ color: '#A89880' }}>
            {formatDate(order.createdAt)} · {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block"
          style={{ backgroundColor: badge.bg, color: badge.color }}>
          {status.toLowerCase()}
        </span>
        <p className="text-sm font-bold" style={{ color: '#C9A84C' }}>
          {formatCurrency(toAed(order.pricing?.totalAmount ?? 0))}
        </p>
        <ArrowRight size={14} style={{ color: '#A89880' }} />
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type SearchMode = 'orderId' | 'email';

function TrackOrderContent() {
  const searchParams  = useSearchParams();
  const paramOrderId  = searchParams.get('orderId') ?? '';

  const [mode, setMode]               = useState<SearchMode>('orderId');
  const [inputValue, setInputValue]   = useState(paramOrderId);
  const [emailValue, setEmailValue]   = useState('');
  const [orderIdTerm, setOrderIdTerm] = useState(paramOrderId);
  const [emailTerm, setEmailTerm]     = useState('');
  const [phoneTerm, setPhoneTerm]     = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  const { data: singleOrder, isLoading: loadingById, isFetched: fetchedById } =
    useOrderById(orderIdTerm, emailTerm);

  const { data: emailOrders = [], isLoading: loadingByEmail, isFetched: fetchedByEmail } =
    useOrdersByEmail(emailTerm, phoneTerm);

  // Sync from URL on mount
  useEffect(() => {
    if (paramOrderId) {
      setInputValue(paramOrderId);
      setOrderIdTerm(paramOrderId);
      setMode('orderId');
    }
  }, [paramOrderId]);

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    setSelectedOrder(null);
    if (mode === 'orderId') {
      setOrderIdTerm(inputValue.trim());
      setEmailTerm(emailValue.trim());
    } else {
      setEmailTerm(inputValue.trim());
      setPhoneTerm(emailValue.trim());
    }
  }

  function handleModeSwitch(m: SearchMode) {
    setMode(m);
    setInputValue('');
    setEmailValue('');
    setOrderIdTerm('');
    setEmailTerm('');
    setPhoneTerm('');
    setSelectedOrder(null);
  }

  const isLoading   = mode === 'orderId' ? loadingById   : loadingByEmail;
  const hasSearched = mode === 'orderId' ? (fetchedById && orderIdTerm.length >= 3) : (fetchedByEmail && !!emailTerm);
  const notFound    = hasSearched && !isLoading && (mode === 'orderId' ? !singleOrder : emailOrders.length === 0);

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="relative py-14 px-4 text-center overflow-hidden" style={{ backgroundColor: '#1A0A2E' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
          <Truck size={28} className="mx-auto mb-3" style={{ color: '#C9A84C' }} />
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: 'rgba(201,168,76,0.7)' }}>Amoria</p>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Track Your <em style={{ color: '#C9A84C' }}>Order</em>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Enter your order ID or email address to view your orders
          </p>
        </motion.div>
      </div>

      {/* Search box */}
      <div className="max-w-xl mx-auto px-4 -mt-6 relative z-10">
        <div className="shadow-lg overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC', borderRadius: '4px' }}>

          {/* Mode tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #E8E3DC' }}>
            <button
              onClick={() => handleModeSwitch('orderId')}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: mode === 'orderId' ? '#1A0A2E' : 'transparent',
                color: mode === 'orderId' ? '#C9A84C' : '#A89880',
              }}
            >
              <Hash size={13} /> Order ID
            </button>
            <button
              onClick={() => handleModeSwitch('email')}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: mode === 'email' ? '#1A0A2E' : 'transparent',
                color: mode === 'email' ? '#C9A84C' : '#A89880',
                borderLeft: '1px solid #E8E3DC',
              }}
            >
              <Mail size={13} /> Email Address
            </button>
          </div>

          {/* Input row */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="flex items-center pl-4 pr-2 flex-shrink-0">
              {mode === 'orderId' ? <Hash size={16} style={{ color: '#A89880' }} /> : <Mail size={16} style={{ color: '#A89880' }} />}
            </div>
            <input
              key={mode}
              type={mode === 'email' ? 'email' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === 'orderId' ? 'Enter order ID (e.g. AMR-123456)' : 'Enter your email address'}
              className="flex-1 py-4 px-2 text-sm outline-none bg-transparent"
              style={{ color: '#1C1C1C' }}
              autoComplete={mode === 'email' ? 'email' : 'off'}
            />
            {mode === 'orderId' && (
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Email used at checkout"
                className="w-64 py-4 px-2 text-sm outline-none bg-transparent border-l"
                style={{ color: '#1C1C1C', borderColor: '#E8E3DC' }}
                autoComplete="email"
              />
            )}
            {mode === 'email' && (
              <input
                type="tel"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Phone used at checkout"
                className="w-56 py-4 px-2 text-sm outline-none bg-transparent border-l"
                style={{ color: '#1C1C1C', borderColor: '#E8E3DC' }}
                autoComplete="tel"
              />
            )}
            {inputValue && (
              <button type="button" onClick={() => setInputValue('')} className="px-2" style={{ color: '#A89880' }}>
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#1A0A2E', flexShrink: 0 }}
            >
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Helper hint */}
        <p className="text-center text-xs mt-3" style={{ color: '#A89880' }}>
          {mode === 'orderId'
            ? 'Enter your order ID and checkout email.'
            : 'Enter your checkout email and phone to see your guest orders.'}
        </p>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">

          {/* Loading */}
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 animate-spin"
                style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: '#6B6B6B' }}>Looking up your order…</p>
            </motion.div>
          )}

          {/* Single order detail (from order ID search OR email list click) */}
          {!isLoading && (selectedOrder || (mode === 'orderId' && singleOrder)) && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedOrder && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-1.5 text-xs font-medium mb-5 transition-colors hover:underline"
                  style={{ color: '#A89880' }}
                >
                  ← Back to orders
                </button>
              )}
              <OrderTimeline order={selectedOrder ?? singleOrder!} />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}>
                  Continue Shopping <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Email results list */}
          {!isLoading && !selectedOrder && mode === 'email' && fetchedByEmail && emailOrders.length > 0 && (
            <motion.div key="email-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: '#1A0A2E' }}>
                  {emailOrders.length} order{emailOrders.length !== 1 ? 's' : ''} found for <span style={{ color: '#C9A84C' }}>{emailTerm}</span>
                </p>
              </div>
              <div className="space-y-3">
                {emailOrders.map((o) => (
                  <OrderRow key={o._id} order={o} onSelect={setSelectedOrder} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Not found */}
          {!isLoading && notFound && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Package size={28} style={{ color: '#ef4444' }} />
              </div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#1A0A2E' }}>No orders found</h2>
              <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
                {mode === 'orderId'
                  ? <>We couldn&apos;t find order <strong>&quot;{orderIdTerm}&quot;</strong>. Please check and try again.</>
                  : <>No orders were found for <strong>{emailTerm}</strong>. Try the email you used at checkout.</>}
              </p>
              {mode === 'orderId' && (
                <p className="text-xs" style={{ color: '#A89880' }}>
                  Don&apos;t have your order ID?{' '}
                  <button className="underline underline-offset-2 cursor-pointer" style={{ color: '#C9A84C' }}
                    onClick={() => handleModeSwitch('email')}>
                    Search by email instead
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {/* Empty / initial state */}
          {!isLoading && !hasSearched && !selectedOrder && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-14">
              <div className="flex justify-center gap-6 mb-5">
                {TRACK_STEPS.map((step, i) => (
                  <div key={step.id}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: i === 0 ? 'rgba(201,168,76,0.12)' : '#F5F2EE',
                      border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.4)' : '#E8E3DC'}`,
                      color: i === 0 ? '#C9A84C' : '#A89880',
                    }}
                  >
                    {step.icon}
                  </div>
                ))}
              </div>
              <p className="text-sm mb-1" style={{ color: '#6B6B6B' }}>
                {mode === 'orderId'
                  ? 'Enter your order ID above to see real-time status.'
                  : 'Enter your email to see all orders placed with that address.'}
              </p>
              <p className="text-xs" style={{ color: '#A89880' }}>
                Guest? Use the <button className="underline underline-offset-2 cursor-pointer" style={{ color: '#C9A84C' }}
                  onClick={() => handleModeSwitch('email')}>email lookup</button> to find your orders.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}
