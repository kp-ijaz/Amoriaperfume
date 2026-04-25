'use client';

import { useState, useEffect, useRef } from 'react';
import { useBodyLock } from '@/lib/hooks/useBodyLock';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Product } from '@/types/product';

const POPUP_DELAY_MS = 5000;
const SESSION_KEY = 'amoria_popup_seen';

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-11 h-11 flex items-center justify-center text-lg font-bold tabular-nums"
        style={{
          backgroundColor: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.4)',
          color: '#C9A84C',
          fontFamily: 'var(--font-heading)',
          borderRadius: '3px',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[8px] uppercase tracking-[0.18em]" style={{ color: 'rgba(201,168,76,0.5)' }}>
        {label}
      </span>
    </div>
  );
}

export function LimitedOfferPopup() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useBodyLock(visible);
  const { hours, minutes, seconds } = useCountdown();

  // Use featured products as "sale picks" — filter those with a salePrice
  const { data: allFeatured = [] } = useProductsByLimit(10, { featured: true });
  const deals = allFeatured
    .filter((p: Product) => p.variants.some((v) => v.salePrice != null))
    .slice(0, 3);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    timerRef.current = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, POPUP_DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const dismiss = () => setVisible(false);

  // Don't render if no deal products loaded yet
  if (!deals.length) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(13,10,8,0.78)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-[201]"
            style={{
              top: '50%',
              left: '50%',
              width: 'min(580px, calc(100vw - 24px))',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,76,0.2)',
            }}
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: 'calc(-50% + 24px)' }}
            animate={{ opacity: 1, scale: 1,  x: '-50%', y: '-50%' }}
            exit={{   opacity: 0, scale: 0.9, x: '-50%', y: 'calc(-50% + 24px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col sm:flex-row" style={{ minHeight: 0 }}>

              {/* LEFT — dark offer panel */}
              <div
                className="relative flex flex-col items-center justify-center text-center px-8 py-10 sm:w-[220px] sm:flex-shrink-0"
                style={{
                  background: 'linear-gradient(175deg, #1A0A2E 0%, #0D0A08 100%)',
                  borderRight: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <span className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l" style={{ borderColor: 'rgba(201,168,76,0.5)' }} />
                <span className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r" style={{ borderColor: 'rgba(201,168,76,0.5)' }} />
                <span className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l" style={{ borderColor: 'rgba(201,168,76,0.5)' }} />
                <span className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r" style={{ borderColor: 'rgba(201,168,76,0.5)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.1) 0%, transparent 65%)' }} />

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <p className="text-[9px] tracking-[0.38em] uppercase font-bold" style={{ color: 'rgba(201,168,76,0.7)' }}>Today Only</p>
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <polygon points="5,0 10,5 5,10 0,5" fill="#C9A84C" fillOpacity="0.7" />
                  </svg>
                  <div>
                    <p className="text-[72px] font-black leading-none" style={{ fontFamily: 'var(--font-heading)', color: '#FAF6EE', letterSpacing: '-0.04em' }}>30</p>
                    <div className="flex items-center justify-center gap-1 -mt-1">
                      <div className="h-px flex-1" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
                      <p className="text-sm font-black tracking-widest uppercase" style={{ color: '#C9A84C' }}>% OFF</p>
                      <div className="h-px flex-1" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(245,237,214,0.45)' }}>On select<br />fragrances</p>
                  <div className="pt-2">
                    <p className="text-[8px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(201,168,76,0.4)' }}>Ends in</p>
                    <div className="flex items-end gap-1.5">
                      <TimeBox value={hours}   label="hrs" />
                      <span className="text-sm font-light mb-4" style={{ color: 'rgba(201,168,76,0.4)' }}>:</span>
                      <TimeBox value={minutes} label="min" />
                      <span className="text-sm font-light mb-4" style={{ color: 'rgba(201,168,76,0.4)' }}>:</span>
                      <TimeBox value={seconds} label="sec" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — products + CTA */}
              <div className="flex flex-col flex-1" style={{ backgroundColor: '#FAF6EE' }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(26,10,46,0.08)' }}>
                  <div>
                    <p className="text-base font-semibold leading-none" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E', letterSpacing: '0.06em' }}>AMORIA</p>
                    <p className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: '#A89880' }}>Flash Sale Picks</p>
                  </div>
                  <button
                    onClick={dismiss}
                    className="w-7 h-7 flex items-center justify-center rounded-full transition-all hover:bg-black/8 hover:scale-110"
                    style={{ color: 'rgba(26,10,46,0.4)', border: '1px solid rgba(26,10,46,0.12)' }}
                    aria-label="Close"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex-1">
                  {deals.map((product, i) => {
                    const imageUrl = product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url;
                    const variant  = product.variants[0];
                    const price    = variant?.salePrice ?? variant?.price ?? 0;
                    const original = variant?.price ?? 0;
                    const hasDiscount = original > price;
                    const discount = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.28 + i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3.5 px-5 py-3 transition-colors duration-150"
                        style={{ borderBottom: i < deals.length - 1 ? '1px solid rgba(26,10,46,0.07)' : 'none', cursor: 'default' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.07)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div className="relative flex-shrink-0 w-[58px] h-[58px] overflow-hidden rounded-sm">
                          {imageUrl && (
                            <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                          )}
                          {hasDiscount && (
                            <div className="absolute top-0 right-0 text-[8px] font-black px-1 py-0.5" style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}>
                              -{discount}%
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-0.5" style={{ color: '#A89880' }}>{product.brand}</p>
                          <p className="text-sm font-semibold leading-snug truncate" style={{ color: '#1A0A2E' }}>{product.name}</p>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-sm font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>{formatCurrency(price)}</span>
                            {hasDiscount && <span className="text-[11px] line-through" style={{ color: 'rgba(26,10,46,0.3)' }}>{formatCurrency(original)}</span>}
                          </div>
                        </div>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={dismiss}
                          className="flex-shrink-0 px-3.5 py-2 text-[9px] font-black tracking-[0.18em] uppercase transition-all duration-200 hover:brightness-105 active:scale-95 rounded-sm"
                          style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
                        >
                          Shop
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="px-5 py-4 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(26,10,46,0.08)' }}>
                  <Link
                    href="/products?sale=true"
                    onClick={dismiss}
                    className="block w-full text-center py-3 text-[10px] font-black tracking-[0.22em] uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.98] rounded-sm"
                    style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
                  >
                    View All Deals →
                  </Link>
                  <button
                    onClick={dismiss}
                    className="text-[10px] tracking-wide text-center transition-colors duration-200 w-full"
                    style={{ color: 'rgba(26,10,46,0.3)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(26,10,46,0.6)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(26,10,46,0.3)')}
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
