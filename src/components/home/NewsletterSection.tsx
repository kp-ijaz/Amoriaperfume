'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function ArabicRosette() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" opacity="0.18">
      {[0, 45, 90, 135].map((angle) => (
        <ellipse
          key={angle}
          cx="45"
          cy="45"
          rx="32"
          ry="14"
          stroke="#C9A84C"
          strokeWidth="0.7"
          transform={`rotate(${angle} 45 45)`}
        />
      ))}
      <circle cx="45" cy="45" r="20" stroke="#C9A84C" strokeWidth="0.5" />
      <circle cx="45" cy="45" r="10" stroke="#C9A84C" strokeWidth="0.5" />
      <circle cx="45" cy="45" r="3" fill="#C9A84C" fillOpacity="0.6" />
    </svg>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Subscribed! Check your inbox for a welcome offer.');
  }

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: '#0D0A08' }}
    >
      {/* Grain */}
      <div className="grain-texture absolute inset-0 pointer-events-none opacity-50" />

      {/* Large gold radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 65%)' }}
      />

      {/* Decorative rosettes */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
        <ArabicRosette />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" style={{ transform: 'translateY(-50%) scaleX(-1)' }}>
        <ArabicRosette />
      </div>

      {/* Horizontal gold lines */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-4"
            style={{ color: 'rgba(201,168,76,0.65)' }}
          >
            Join the Community
          </p>

          <h2
            className="text-4xl md:text-5xl xl:text-6xl font-light leading-tight mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: '#FFFFFF', letterSpacing: '0.04em' }}
          >
            Stay in
            <br />
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>The Scent</em>
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,6 6,12 0,6" fill="rgba(201,168,76,0.7)" /></svg>
            <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>

          <p
            className="text-sm mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Be first to discover new arrivals, exclusive offers, and the stories
            behind our finest Arabian fragrances.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 text-sm outline-none border border-r-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(201,168,76,0.25)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              />
              <button
                type="submit"
                className="px-7 py-4 text-sm font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-opacity hover:opacity-90 border"
                style={{
                  backgroundColor: '#C9A84C',
                  color: '#0D0A08',
                  borderColor: '#C9A84C',
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 px-8 inline-block border"
              style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.06)' }}
            >
              <p className="text-sm font-semibold" style={{ color: '#C9A84C' }}>
                ✓ You&apos;re on the list! Watch your inbox.
              </p>
            </motion.div>
          )}

          <p
            className="text-[11px] mt-5"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            No spam. Just exclusive offers and fragrance stories.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
