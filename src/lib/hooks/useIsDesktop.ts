'use client';

import { useSyncExternalStore } from 'react';
import { DESKTOP_MEDIA_QUERY } from '@/lib/utils/coverImageDevice';

function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

/** True when viewport is md (768px) or wider — matches hero side-panel layout. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getDesktopServerSnapshot);
}
