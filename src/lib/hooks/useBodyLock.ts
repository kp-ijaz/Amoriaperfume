'use client';

import { useEffect } from 'react';

/**
 * Locks body scroll while `active` is true.
 *
 * Uses the `body-lock` CSS class with `position:fixed` + `top:var(--scroll-y)`
 * so the page doesn't jump to the top while locked, and restores the exact
 * scroll position when unlocked.
 */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', `-${scrollY}px`);
    document.body.classList.add('body-lock');

    return () => {
      document.body.classList.remove('body-lock');
      document.documentElement.style.removeProperty('--scroll-y');
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [active]);
}
