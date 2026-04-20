'use client';

import Link from 'next/link';

export function PromoStripBanner() {
  return (
    <div
      className="relative w-full py-3 px-4"
      style={{ backgroundColor: '#1A0A2E' }}
    >
      {/* Gold top line */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
      {/* Gold bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        {/* Diamond ornament */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 hidden sm:block">
          <polygon points="4,0 8,4 4,8 0,4" fill="rgba(201,168,76,0.6)" />
        </svg>

        <p className="text-[11px] tracking-wide text-center" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Free delivery on orders over AED 200
          <span className="mx-2 opacity-30">·</span>
          Use code{' '}
          <span className="font-semibold tracking-widest" style={{ color: '#C9A84C' }}>CB30</span>
          {' '}for 30% cashback
        </p>

        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 hidden sm:block">
          <polygon points="4,0 8,4 4,8 0,4" fill="rgba(201,168,76,0.6)" />
        </svg>

        <Link
          href="/products"
          className="text-[11px] font-semibold tracking-[0.16em] uppercase flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ color: '#C9A84C' }}
        >
          Shop Now →
        </Link>
      </div>
    </div>
  );
}
