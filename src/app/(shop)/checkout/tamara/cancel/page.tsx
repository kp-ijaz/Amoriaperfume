'use client';

import { Suspense } from 'react';
import TamaraCancelInner from './TamaraCancelInner';

export default function TamaraCancelPage() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-sm">Loading…</p>}>
      <TamaraCancelInner />
    </Suspense>
  );
}
