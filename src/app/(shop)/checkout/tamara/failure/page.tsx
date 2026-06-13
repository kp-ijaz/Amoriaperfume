'use client';

import { Suspense } from 'react';
import TamaraFailureInner from './TamaraFailureInner';

export default function TamaraFailurePage() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-sm">Loading…</p>}>
      <TamaraFailureInner />
    </Suspense>
  );
}
