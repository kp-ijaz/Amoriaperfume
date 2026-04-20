'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const messages = [
  '🚚 Free Delivery on Orders Over AED 200',
  '✨ Use Code WELCOME10 for 10% Off Your First Order',
  '⭐ Authentic Fragrances — 100% Original Guaranteed',
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem('amoria_announcement_dismissed');
    if (val === 'true') setDismissed(true);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('amoria_announcement_dismissed', 'true');
  }

  if (dismissed) return null;

  const repeatedMessages = [...messages, ...messages];

  return (
    <div
      className="relative overflow-hidden text-xs py-2 z-50"
      style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-accent)' }}
    >
      <div className="marquee-container">
        <div className="marquee-track flex gap-16">
          {repeatedMessages.map((msg, i) => (
            <span key={i} className="flex-shrink-0 font-medium tracking-wide">
              {msg}
              {i < repeatedMessages.length - 1 && (
                <span className="mx-8 opacity-40">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
