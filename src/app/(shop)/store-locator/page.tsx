'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { usePublicBootstrap, useUtilityBarConfig } from '@/lib/hooks/usePublicCms';
import { resolveStoreMapEmbedUrl, buildGoogleMapsDirectionsUrl } from '@/lib/utils/googleMapsEmbed';
import type { PublicPickupStore } from '@/lib/api/public';

function StoreCard({
  store,
  selected,
  onSelect,
}: {
  store: PublicPickupStore;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useLanguage();
  const directionsUrl = buildGoogleMapsDirectionsUrl(store.address);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left rounded-xl border p-5 transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: selected ? 'var(--color-amoria-accent)' : 'var(--color-amoria-border)',
        backgroundColor: selected ? 'rgba(201, 168, 76, 0.06)' : '#fff',
        boxShadow: selected ? '0 4px 20px rgba(201, 168, 76, 0.15)' : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(26,10,46,0.08)' }}
        >
          <MapPin size={18} style={{ color: 'var(--color-amoria-accent)' }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-base font-medium mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
          >
            {store.name}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {store.address}
          </p>
          {store.hours ? (
            <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: 'var(--color-amoria-text)' }}>
              <Clock size={12} style={{ color: 'var(--color-amoria-accent)' }} />
              <span>
                <span className="font-medium">{t('storeHours')}: </span>
                {store.hours}
              </span>
            </p>
          ) : null}
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold uppercase tracking-wider hover:opacity-80"
              style={{ color: 'var(--color-amoria-accent)' }}
            >
              {t('getDirections')}
              <ExternalLink size={12} />
            </a>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default function StoreLocatorPage() {
  const { t } = useLanguage();
  const { data: bootstrap, isLoading } = usePublicBootstrap();
  const utilityBar = useUtilityBarConfig();
  const stores = bootstrap?.pickupStores ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (stores.length > 0 && !selectedId) {
      setSelectedId(stores[0].id);
    }
  }, [stores, selectedId]);

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedId) ?? stores[0] ?? null,
    [stores, selectedId]
  );

  const mapSrc = useMemo(
    () =>
      utilityBar.showStoreLocatorMap
        ? resolveStoreMapEmbedUrl(null, selectedStore?.mapEmbedSrc, selectedStore?.address)
        : null,
    [utilityBar.showStoreLocatorMap, selectedStore]
  );

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('storeLocatorTitle')}
        </h1>
        <p className="text-white/60 text-sm mt-2">{t('storeLocatorSubtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {mapSrc ? (
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-amoria-border)' }}>
            <iframe
              title={t('storeLocatorTitle')}
              src={mapSrc}
              className="w-full border-0"
              style={{ height: 400 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl animate-pulse"
                style={{ backgroundColor: 'var(--color-amoria-border)' }}
              />
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                selected={store.id === selectedId}
                onSelect={() => setSelectedId(store.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-xl border" style={{ borderColor: 'var(--color-amoria-border)' }}>
            <MapPin size={32} className="mx-auto mb-4 opacity-40" style={{ color: 'var(--color-amoria-accent)' }} />
            <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {t('storeLocatorEmpty')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: 'var(--color-amoria-primary)' }}
            >
              {t('storeLocatorShopOnline')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
