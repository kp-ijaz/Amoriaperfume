'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const messages = [
  '🚚 Free Delivery on Orders Over AED 200',
  '✨ Use Code WELCOME10 for 10% Off Your First Order',
  '⭐ Authentic Fragrances — 100% Original Guaranteed',
  '🎁 Free Gift Wrapping on Orders Above AED 300',
  '🔥 Eid Special — Use Code EID25 for 25% Off Gift Sets',
];

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'عربي', flag: '🇦🇪' },
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (localStorage.getItem('amoria_announcement_dismissed') === 'true') setDismissed(true);
    const saved = localStorage.getItem('amoria_lang');
    if (saved) setLang(saved);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('amoria_announcement_dismissed', 'true');
  }

  function switchLang(code: string) {
    setLang(code);
    localStorage.setItem('amoria_lang', code);
  }

  if (dismissed) return null;

  // Triplicate so marquee never shows a gap
  const track = [...messages, ...messages, ...messages];

  return (
    <div
      className="relative z-50 text-[11px] py-1.5"
      style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-accent)' }}
    >
      <div className="grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

        {/* LEFT — language flags */}
        <div className="flex items-center gap-0.5 pl-3 md:pl-5">
          {LANGUAGES.map((l, i) => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-sm font-medium transition-all duration-200 ${
                lang === l.code ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              style={lang === l.code ? { color: 'var(--color-amoria-accent)' } : { color: 'rgba(201,168,76,0.6)' }}
              aria-label={`Switch to ${l.label}`}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              <span className="hidden sm:inline tracking-wider">{l.label}</span>
            </button>
          ))}
          {/* thin divider */}
          <span className="hidden sm:block w-px h-3 ml-1 opacity-20" style={{ backgroundColor: 'var(--color-amoria-accent)' }} />
        </div>

        {/* CENTER — scrolling offers */}
        <div className="overflow-hidden w-[55vw] md:w-[50vw] lg:w-[44vw]">
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
            {/* Small diamond ornament */}
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
