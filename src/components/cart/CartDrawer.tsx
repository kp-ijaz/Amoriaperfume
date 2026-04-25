'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeCartDrawer } from '@/lib/store/uiSlice';
import { useBodyLock } from '@/lib/hooks/useBodyLock';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import { CartItem } from './CartItem';
import { useCart } from '@/lib/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { calculateVAT } from '@/lib/utils/calculateVAT';

export function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.cartDrawerOpen);
  useBodyLock(isOpen);
  const { items } = useCart();

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant.salePrice ?? item.variant.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = subtotal >= 200 ? 0 : 25;
  const vat = calculateVAT(subtotal);
  const total = subtotal + shipping + vat;
  const totalCount = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            onClick={() => dispatch(closeCartDrawer())}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white"
            style={{ width: 'min(420px, 100vw)' }}
          >
            {/* ── HEADER ──────────────────────────────── */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: '#E8E3DC' }}
            >
              <div className="flex items-center gap-3">
                <h2
                  className="text-xs font-semibold tracking-[0.2em] uppercase"
                  style={{ color: '#1A0A2E' }}
                >
                  Your Cart
                </h2>
                {totalCount > 0 && (
                  <span
                    className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1A0A2E', color: 'white' }}
                  >
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch(closeCartDrawer())}
                className="p-1.5 hover:opacity-50 transition-opacity"
                aria-label="Close cart"
              >
                <X size={18} style={{ color: '#1C1C1C' }} />
              </button>
            </div>

            {/* ── EMPTY STATE ──────────────────────────── */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
                <div className="text-center">
                  <p
                    className="text-3xl font-light mb-2"
                    style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
                  >
                    Your cart is empty
                  </p>
                  <p className="text-sm" style={{ color: '#A89880' }}>
                    Discover our collection of Arabian fragrances.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-opacity hover:opacity-50"
                  style={{ borderColor: '#1A0A2E', color: '#1A0A2E' }}
                >
                  Shop Collection <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <>
                {/* ── ITEMS LIST ───────────────────────── */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.variant.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* ── ORDER SUMMARY ────────────────────── */}
                <div
                  className="border-t px-6 pt-5 pb-6 space-y-4"
                  style={{ borderColor: '#E8E3DC' }}
                >
                  {/* Price rows */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#6B6B6B' }}>Subtotal</span>
                      <span className="text-xs tabular-nums" style={{ color: '#1C1C1C' }}>
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#6B6B6B' }}>
                        {shipping === 0 ? (
                          <span className="text-emerald-600">Free shipping</span>
                        ) : (
                          'Shipping'
                        )}
                      </span>
                      <span className="text-xs tabular-nums" style={{ color: '#1C1C1C' }}>
                        {shipping === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          formatCurrency(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#6B6B6B' }}>VAT (5%)</span>
                      <span className="text-xs tabular-nums" style={{ color: '#1C1C1C' }}>
                        {formatCurrency(vat)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px]" style={{ color: '#A89880' }}>
                        Free shipping on orders over AED 200
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div
                    className="flex justify-between items-center pt-3 border-t"
                    style={{ borderColor: '#E8E3DC' }}
                  >
                    <span
                      className="text-xs font-semibold tracking-[0.1em] uppercase"
                      style={{ color: '#1A0A2E' }}
                    >
                      Total
                    </span>
                    <span
                      className="text-base font-semibold tabular-nums"
                      style={{ fontFamily: 'var(--font-heading)', color: '#C9A84C' }}
                    >
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <Link
                      href="/checkout"
                      onClick={() => dispatch(closeCartDrawer())}
                      className="block w-full text-center py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                      style={{ backgroundColor: '#1A0A2E', color: 'white' }}
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => dispatch(closeCartDrawer())}
                      className="block w-full text-center py-3.5 text-xs font-medium tracking-wide transition-opacity hover:opacity-60 border"
                      style={{ borderColor: '#E8E3DC', color: '#6B6B6B' }}
                    >
                      View Cart
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    {['Secure Checkout', '100% Authentic', 'Free Returns'].map((t) => (
                      <span
                        key={t}
                        className="text-[9px] tracking-wide uppercase"
                        style={{ color: '#B8B0A5' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
