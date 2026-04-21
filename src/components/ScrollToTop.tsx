'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-4 md:right-6 md:bottom-6 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 scroll-to-top-btn"
      style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
