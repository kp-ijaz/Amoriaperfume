'use client';

import { Suspense } from 'react';
import TamaraSuccessInner from './TamaraSuccessInner';

export default function TamaraSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-sm">Loading…</p>}>
      <TamaraSuccessInner />
    </Suspense>
  );
}
