'use client';

import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ahmed Al Rashid',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'Amoria is my go-to for all fragrance purchases. The authenticity is guaranteed and delivery is always on time. Highly recommend!',
    initials: 'AR',
  },
  {
    id: 2,
    name: 'Fatima Hassan',
    location: 'Abu Dhabi, UAE',
    rating: 5,
    text: 'I ordered the Shumukh as a birthday gift and my husband was absolutely blown away. The packaging is gorgeous and the scent is divine.',
    initials: 'FH',
  },
  {
    id: 3,
    name: 'Mohammed Al Zaabi',
    location: 'Sharjah, UAE',
    rating: 5,
    text: 'Best online perfume store in the UAE. Wide selection, competitive prices, and fast delivery. The fragrance finder quiz helped me discover my new signature scent.',
    initials: 'MZ',
  },
  {
    id: 4,
    name: 'Layla Bin Hamad',
    location: 'Dubai, UAE',
    rating: 4,
    text: 'Love the curated collection here. Found fragrances I could not find anywhere else. Customer service was very helpful too.',
    initials: 'LH',
  },
  {
    id: 5,
    name: 'Omar Al Shamsi',
    location: 'Ajman, UAE',
    rating: 5,
    text: 'The oud selection is incredible. Every bottle I have ordered has been authentic and exactly as described. Will continue to be a loyal customer.',
    initials: 'OS',
  },
  {
    id: 6,
    name: 'Sara Al Blooshi',
    location: 'Ras Al Khaimah, UAE',
    rating: 5,
    text: 'Amazingly fast shipping and the products are 100% original. The prices are great and the website is so easy to use. Very happy customer!',
    initials: 'SB',
  },
];

const stats = [
  { num: '4.9', label: 'Average Rating', sub: '12,400+ reviews' },
  { num: '100%', label: 'Authentic', sub: 'Certified original' },
  { num: '50K+', label: 'Customers', sub: 'Across the UAE' },
  { num: '1 Day', label: 'Delivery', sub: 'Same-day Dubai' },
];

export function TestimonialsSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4500 })]);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#0D0A08' }}>
      {/* Background geometric pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testi-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#C9A84C" strokeWidth="0.6" />
              <polygon points="50,22 78,36 78,64 50,78 22,64 22,36" fill="none" stroke="#C9A84C" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testi-pattern)" />
        </svg>
      </div>

      {/* Gold ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)' }}
      />

      {/* Gold top/bottom borders */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

      {/* ── STATS BAR ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-b"
        style={{ borderColor: 'rgba(201,168,76,0.12)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="py-7 px-6 text-center border-r last:border-r-0"
                style={{ borderColor: 'rgba(201,168,76,0.1)' }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-3xl md:text-4xl font-light mb-1"
                  style={{ fontFamily: 'var(--font-heading)', color: '#C9A84C' }}
                >
                  {s.num}
                </motion.p>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/70 mb-0.5">{s.label}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-3" style={{ color: 'rgba(201,168,76,0.6)' }}>
              Customer Stories
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}
            >
              What Our{' '}
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
                Customers Say
              </em>
            </h2>
          </div>

          {/* Large decorative quote mark */}
          <div
            className="text-[120px] leading-none font-light hidden md:block"
            style={{ fontFamily: 'var(--font-heading)', color: 'rgba(201,168,76,0.08)', lineHeight: 0.8 }}
            aria-hidden
          >
            &ldquo;
          </div>
        </motion.div>

        {/* Embla carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex-[0_0_calc(100%-2rem)] sm:flex-[0_0_calc(50%-1.25rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] flex flex-col p-7 relative group"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'; }}
              >
                {/* Gold top accent on hover */}
                <div
                  className="absolute top-0 left-4 right-4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#C9A84C' }}
                />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={12}
                      fill={si < t.rating ? '#C9A84C' : 'transparent'}
                      style={{ color: si < t.rating ? '#C9A84C' : 'rgba(201,168,76,0.3)' }}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))',
                      color: '#C9A84C',
                      border: '1px solid rgba(201,168,76,0.3)',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(201,168,76,0.45)' }}>{t.location}</p>
                  </div>
                  {/* Verified badge */}
                  <div className="ml-auto flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polygon points="6,0.5 7.8,4.2 11.9,4.8 8.9,7.7 9.7,11.8 6,9.9 2.3,11.8 3.1,7.7 0.1,4.8 4.2,4.2" fill="rgba(201,168,76,0.6)" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(201,168,76,0.45)' }}>Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
