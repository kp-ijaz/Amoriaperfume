'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { quizQuestions } from '@/lib/data/quiz';
import { products } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export function FragranceFinderWidget() {
  const [open, setOpen]       = useState(false);
  const cartDrawerOpen = useSelector((s: RootState) => s.ui.cartDrawerOpen);
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [started, setStarted] = useState(false);

  const current    = quizQuestions[step];
  const totalSteps = quizQuestions.length;
  const progress   = started ? Math.round((step / totalSteps) * 100) : 0;
  const isDone     = started && step >= totalSteps;

  function pickAnswer(optionId: string) {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    if (step + 1 >= totalSteps) {
      setStep(totalSteps);
    } else {
      setStep((s) => s + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setStarted(false);
  }

  // Score products against selected tags and return top 3
  const matches = useMemo(() => {
    if (!isDone) return [];
    const selectedTags = quizQuestions.flatMap((q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return opt?.tags ?? [];
    });
    return products
      .map((p) => ({
        product: p,
        score: p.tags.filter((t) => selectedTags.includes(t)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.product);
  }, [isDone, answers]);

  return (
    <>
      {/* Floating trigger — hidden when cart drawer is open */}
      <AnimatePresence>
        {!open && !cartDrawerOpen && (
          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-0 z-[150] flex items-center gap-2 py-3 pl-4 pr-5 shadow-xl"
            style={{
              backgroundColor: '#1A0A2E',
              borderLeft: '3px solid #C9A84C',
              borderTop: '1px solid rgba(201,168,76,0.25)',
              borderBottom: '1px solid rgba(201,168,76,0.25)',
              borderRight: 'none',
              borderRadius: '6px 0 0 6px',
            }}
            aria-label="Find Your Scent"
          >
            <Sparkles size={15} style={{ color: '#C9A84C' }} />
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: '#C9A84C' }}>
              Find Your Scent
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              className="fixed inset-0 z-[148] sm:hidden bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed bottom-0 right-0 z-[149] w-full sm:w-[340px] flex flex-col"
              style={{
                maxHeight: '88vh',
                backgroundColor: '#0D0A08',
                border: '1px solid rgba(201,168,76,0.22)',
                borderRight: 'none',
                borderRadius: '12px 0 0 0',
                boxShadow: '-8px 0 48px rgba(0,0,0,0.6)',
              }}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gold top line */}
              <div className="h-[2px] flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C 60%, transparent)' }} />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  {started && !isDone && step > 0 && (
                    <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="p-1 -ml-1 transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }} aria-label="Back">
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <Sparkles size={13} style={{ color: '#C9A84C' }} />
                  <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#C9A84C' }}>
                    {isDone ? 'Your Matches' : 'Find Your Scent'}
                  </span>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-full transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }} aria-label="Close">
                  <X size={15} />
                </button>
              </div>

              {/* Progress bar */}
              {started && (
                <div className="h-[2px] flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <motion.div className="h-full" style={{ backgroundColor: '#C9A84C' }} animate={{ width: `${isDone ? 100 : progress}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto fragrance-widget-body">
                <AnimatePresence mode="wait">

                  {/* ── Welcome ── */}
                  {!started && (
                    <motion.div key="welcome" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }} className="px-5 py-8 text-center">
                      <div className="text-4xl mb-4" style={{ filter: 'drop-shadow(0 0 14px rgba(201,168,76,0.5))' }}>✨</div>
                      <h3 className="text-xl font-light text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Discover Your<br /><em style={{ color: '#C9A84C' }}>Perfect Scent</em>
                      </h3>
                      <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Answer 5 quick questions and we&apos;ll find fragrances tailored just for you.
                      </p>
                      <button
                        onClick={() => setStarted(true)}
                        className="w-full py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:brightness-110"
                        style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
                      >
                        Start →
                      </button>
                    </motion.div>
                  )}

                  {/* ── Question ── */}
                  {started && !isDone && current && (
                    <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.26 }} className="px-5 py-5">
                      <p className="text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {step + 1} / {totalSteps}
                      </p>
                      <p className="text-base font-light text-white mb-4 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                        {current.question}
                      </p>
                      <div className="space-y-2">
                        {current.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => pickAnswer(opt.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                            style={{ border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'; e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                          >
                            <span className="text-base leading-none">{opt.icon}</span>
                            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Results ── */}
                  {isDone && (
                    <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                      {/* Result header */}
                      <div className="px-5 pt-5 pb-4 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Based on your answers, we recommend:
                        </p>
                      </div>

                      {/* Matched products */}
                      {matches.length > 0 ? (
                        <div>
                          {matches.map((product, i) => {
                            const primary  = product.images.find((img) => img.isPrimary) ?? product.images[0];
                            const variant  = product.variants[0];
                            const price    = variant?.salePrice ?? variant?.price ?? 0;
                            const original = variant?.price ?? 0;
                            const onSale   = original > price;

                            return (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.32 }}
                                className="flex items-center gap-3.5 px-5 py-3.5 transition-colors duration-150"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.05)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {/* Image */}
                                <div className="relative flex-shrink-0 w-[60px] h-[60px] overflow-hidden" style={{ borderRadius: '3px' }}>
                                  <Image src={primary.url} alt={primary.alt} fill className="object-cover" unoptimized />
                                  {/* Match badge */}
                                  <div className="absolute top-0 left-0 px-1 py-0.5 text-[8px] font-black" style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}>
                                    ✓
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(201,168,76,0.55)' }}>
                                    {product.brand}
                                  </p>
                                  <p className="text-sm font-semibold leading-snug truncate" style={{ color: '#F5EDD6' }}>
                                    {product.name}
                                  </p>
                                  <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className="text-sm font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>
                                      {formatCurrency(price)}
                                    </span>
                                    {onSale && (
                                      <span className="text-[10px] line-through" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                        {formatCurrency(original)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* View button */}
                                <Link
                                  href={`/products/${product.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="flex-shrink-0 px-3 py-2 text-[9px] font-black tracking-[0.15em] uppercase transition-all hover:brightness-110 active:scale-95"
                                  style={{ backgroundColor: '#C9A84C', color: '#1A0A2E', borderRadius: '3px' }}
                                >
                                  View
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Fallback if no tag matches */
                        <div className="px-5 py-6 text-center">
                          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Browse our full collection to find your match.
                          </p>
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="px-5 py-4 space-y-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <Link
                          href="/products"
                          onClick={() => setOpen(false)}
                          className="block w-full text-center py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:brightness-110"
                          style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
                        >
                          See All Perfumes →
                        </Link>
                        <button
                          onClick={reset}
                          className="w-full text-center text-[10px] tracking-wide transition-colors py-1"
                          style={{ color: 'rgba(255,255,255,0.28)' }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
                          onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.28)')}
                        >
                          Retake Quiz
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Open full quiz link */}
              {started && !isDone && (
                <div className="flex-shrink-0 px-5 py-3 flex justify-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <Link href="/fragrance-finder" onClick={() => setOpen(false)} className="text-[10px] tracking-wide transition-colors hover:underline underline-offset-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Open full quiz
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
