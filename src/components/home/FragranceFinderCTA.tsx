'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

function ArabicPattern({ size = 200, opacity = 0.15 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ opacity }}>
      <path d="M100 10L190 55V145L100 190L10 145V55Z" stroke="#C9A84C" strokeWidth="0.8" />
      <path d="M100 28L172 67V133L100 172L28 133V67Z" stroke="#C9A84C" strokeWidth="0.6" />
      <path d="M100 46L154 79V121L100 154L46 121V79Z" stroke="#C9A84C" strokeWidth="0.5" />
      <path d="M100 64L136 82V118L100 136L64 118V82Z" stroke="#C9A84C" strokeWidth="0.4" />
      <circle cx="100" cy="100" r="14" stroke="#C9A84C" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="5" fill="#C9A84C" fillOpacity="0.6" />
      {/* Cardinal lines */}
      <line x1="100" y1="10" x2="100" y2="46" stroke="#C9A84C" strokeWidth="0.4" />
      <line x1="100" y1="154" x2="100" y2="190" stroke="#C9A84C" strokeWidth="0.4" />
      <line x1="10" y1="100" x2="46" y2="100" stroke="#C9A84C" strokeWidth="0.4" />
      <line x1="154" y1="100" x2="190" y2="100" stroke="#C9A84C" strokeWidth="0.4" />
      {/* Diagonal accents */}
      <line x1="46" y1="46" x2="64" y2="64" stroke="#C9A84C" strokeWidth="0.3" />
      <line x1="154" y1="46" x2="136" y2="64" stroke="#C9A84C" strokeWidth="0.3" />
      <line x1="46" y1="154" x2="64" y2="136" stroke="#C9A84C" strokeWidth="0.3" />
      <line x1="154" y1="154" x2="136" y2="136" stroke="#C9A84C" strokeWidth="0.3" />
    </svg>
  );
}

const steps = [
  { num: '01', text: 'Choose your mood & occasion' },
  { num: '02', text: 'Pick your preferred scent family' },
  { num: '03', text: 'Set your budget' },
  { num: '04', text: 'Get your perfect matches' },
];

export function FragranceFinderCTA() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: 'var(--color-amoria-primary)' }}
    >
      {/* Large background pattern - left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 hidden lg:block">
        <ArabicPattern size={420} opacity={0.07} />
      </div>

      {/* Small pattern - right */}
      <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 hidden lg:block">
        <ArabicPattern size={280} opacity={0.05} />
      </div>

      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-4"
              style={{ color: 'var(--color-amoria-accent)' }}
            >
              Fragrance Finder
            </p>
            <h2
              className="text-4xl md:text-5xl xl:text-6xl font-light text-white leading-tight mb-5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Discover Your
              <br />
              <em style={{ color: 'var(--color-amoria-accent)', fontStyle: 'italic' }}>
                Perfect Scent
              </em>
            </h2>
            <p className="text-white/65 text-base mb-8 max-w-md leading-relaxed">
              Answer 5 quick questions and we&apos;ll match you with your ideal fragrance
              from our curated collection of authentic Arabian perfumes.
            </p>
            <Link
              href="/fragrance-finder"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-300 group"
              style={{
                backgroundColor: 'var(--color-amoria-accent)',
                color: 'var(--color-amoria-primary)',
              }}
            >
              Take the Quiz
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* Right — steps */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                className="flex items-center gap-5 p-4 rounded-sm border transition-all hover:border-[#C9A84C40] group"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              >
                <span
                  className="text-3xl font-light flex-shrink-0 w-10 transition-colors duration-200 group-hover:text-[#C9A84C]"
                  style={{ fontFamily: 'var(--font-heading)', color: 'rgba(201,168,76,0.35)' }}
                >
                  {step.num}
                </span>
                <p className="text-white/70 text-sm leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gold bottom line */}
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)' }}
      />
    </section>
  );
}
