'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { heroVideo } from '@/lib/data/videos';

function ArabicDivider() {
  return (
    <svg width="120" height="20" viewBox="0 0 120 20" fill="none" className="mx-auto">
      <line x1="0" y1="10" x2="42" y2="10" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.6" />
      <polygon points="52,2 60,10 52,18 44,10" fill="none" stroke="#C9A84C" strokeWidth="1" />
      <polygon points="60,5 68,10 60,15 52,10" fill="#C9A84C" fillOpacity="0.5" />
      <polygon points="68,2 76,10 68,18 60,10" fill="none" stroke="#C9A84C" strokeWidth="1" />
      <line x1="78" y1="10" x2="120" y2="10" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.6" />
    </svg>
  );
}

// Deterministic particle data — no Math.random() to prevent hydration mismatch
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.3 + 3) % 98}%`,
  size: 1.5 + (i % 3) * 0.7,
  duration: 9 + (i % 6) * 2,
  delay: (i * 0.38) % 7,
  opacity: 0.1 + (i % 5) * 0.05,
}));

export function VideoHero() {
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Smooth spring-based mouse parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 18 });
  const contentX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const contentY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const orbX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const orbY = useTransform(springY, [-0.5, 0.5], [12, -12]);

  useEffect(() => {
    // Detect desktop for heavy animations
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
    setIsDesktop(desktop);

    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setVideoError(true));
    // Delay particles so they don't block initial paint — desktop only
    if (desktop) {
      const t = setTimeout(() => setShowParticles(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '560px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* VIDEO */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop
          playsInline
          poster={heroVideo.poster}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: 'opacity 1.4s ease', opacity: videoReady ? 1 : 0 }}
        >
          {heroVideo.sources.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
      )}

      {/* POSTER / FALLBACK — fades out once video loads */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transition: 'opacity 1.4s ease',
          opacity: videoReady && !videoError ? 0 : 1,
          pointerEvents: 'none',
        }}
      >
        <Image
          src={heroVideo.poster}
          alt="Amoria — Premium Arabian Fragrances"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </div>

      {/* GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/50 to-black/80" />
      {/* Gold vignette top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 8%, rgba(201,168,76,0.11) 0%, transparent 52%)',
        }}
      />
      {/* Deep purple vignette bottom-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 88% 92%, rgba(26,10,46,0.45) 0%, transparent 48%)',
        }}
      />

      {/* GRAIN TEXTURE */}
      <div className="grain-texture absolute inset-0 pointer-events-none" />

      {/* AMBIENT PARALLAX GLOW ORBS — desktop only */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={isDesktop ? { x: orbX, y: orbY } : {}}
      >
        {/* Large gold orb — top area */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '700px',
            height: '700px',
            left: '5%',
            top: '-10%',
            background:
              'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 68%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Purple orb — bottom-right */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            right: '-5%',
            bottom: '0%',
            background:
              'radial-gradient(circle, rgba(26,10,46,0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        />
        {/* Small accent orb — center */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            left: '42%',
            top: '30%',
            background:
              'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </motion.div>

      {/* FLOATING GOLD PARTICLES */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                bottom: 0,
                width: p.size,
                height: p.size,
                backgroundColor: '#C9A84C',
              }}
              animate={{
                y: [0, -950],
                opacity: [p.opacity, p.opacity * 0.5, 0],
                scale: [1, 0.7, 0.3],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* MAIN CONTENT — parallax layer */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        style={{ x: contentX, y: contentY }}
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.08em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ duration: 1.3, delay: 0.3, ease: 'easeOut' }}
            className="text-[11px] font-semibold uppercase"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            New Collection 2025
          </motion.p>

          {/* Geometric divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArabicDivider />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light text-white leading-[1.05]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Art of
            <br />
            <em
              className="font-semibold"
              style={{ color: 'var(--color-amoria-accent)', fontStyle: 'italic' }}
            >
              Arabian Scent
            </em>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-white/70 max-w-sm mx-auto leading-relaxed"
          >
            Discover perfumes that tell your story — crafted with the finest
            ingredients from the heart of Arabia.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            {/* Primary gold button with shimmer */}
            <Link
              href="/products"
              className="group relative px-9 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase overflow-hidden transition-all duration-300 btn-shimmer"
              style={{
                backgroundColor: 'var(--color-amoria-accent)',
                color: 'var(--color-amoria-primary)',
              }}
            >
              <span className="relative z-10">Shop Collection</span>
              <span
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                style={{ backgroundColor: 'var(--color-amoria-accent-light)' }}
              />
            </Link>

            {/* Outline button */}
            <Link
              href="/products?filter=bestsellers"
              className="relative px-9 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase border backdrop-blur-sm group overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Shop Best Sellers
              </span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              />
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex items-center justify-center gap-6 sm:gap-10 pt-4"
          >
            {[
              { num: '500+', label: 'Authentic Fragrances' },
              { num: '50K+', label: 'Happy Customers' },
              { num: '100%', label: 'Original Guaranteed' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + i * 0.12 }}
              >
                <p
                  className="text-base sm:text-lg font-semibold tabular-nums"
                  style={{ color: 'var(--color-amoria-accent)', fontFamily: 'var(--font-heading)' }}
                >
                  {s.num}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-white/45 mt-0.5">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.22em] uppercase text-white/35">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-white/35" />
        </motion.div>
      </motion.div>

      {/* Mute / Unmute */}
      {!videoError && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            if (videoRef.current) videoRef.current.muted = next;
          }}
          className="absolute bottom-8 right-6 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>
      )}
    </section>
  );
}
