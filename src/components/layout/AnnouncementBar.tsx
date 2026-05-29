'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { tArr } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem('amoria_announcement_dismissed') === 'true') setDismissed(true);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('amoria_announcement_dismissed', 'true');
  }

  if (dismissed) return null;

  const messages = tArr('announcementMessages');
  // Triplicate so marquee never shows a gap
  const track = [...messages, ...messages, ...messages];

  return (
    <div
      className="relative z-50 text-[11px] py-1.5"
      style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-accent)' }}
    >
      <div className="grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

        {/* LEFT — empty (language switcher moved to header) */}
        <div />

        {/* CENTER — scrolling offers */}
        <div className="overflow-hidden w-[70vw] md:w-[60vw] lg:w-[54vw]">
          <div
            className="inline-flex gap-10 whitespace-nowrap font-medium tracking-wide"
            style={{ animation: 'marquee 35s linear infinite' }}
          >
            {track.map((msg, idx) => (
              <span key={idx} className="flex-shrink-0">
                {msg}
                <span className="mx-6 opacity-25">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — logo + dismiss */}
        <div className="flex items-center justify-end gap-2 pr-3 md:pr-5">
          <span
            className="hidden sm:flex items-center gap-1 font-semibold tracking-[0.22em] uppercase text-[10px] select-none"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polygon points="5,0 10,5 5,10 0,5" fill="currentColor" opacity="0.7" />
            </svg>
            AMORIA
          </span>
          <button
            onClick={dismiss}
            className="opacity-40 hover:opacity-90 transition-opacity p-0.5"
            aria-label="Dismiss announcement"
          >
            <X size={12} />
          </button>
        </div>

      </div>
    </div>
  );
}
