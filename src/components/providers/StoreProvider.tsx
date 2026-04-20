'use client';

import { useRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/lib/store';
import dynamic from 'next/dynamic';

const PersistGate = dynamic(
  () => import('redux-persist/integration/react').then((m) => ({ default: m.PersistGate })),
  { ssr: false }
);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
