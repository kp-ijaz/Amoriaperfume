'use client';

import Link from 'next/link';
import { usePromoStripConfig } from '@/lib/hooks/usePublicCms';
import { useLanguage } from '@/lib/context/LanguageContext';

export function PromoStripBanner() {
  const { t } = useLanguage();
  const strip = usePromoStripConfig();

  if (!strip) return null;

  const { message, code, ctaHref } = strip;

  return (
    <div
      style={{
        backgroundColor: '#C9A84C',
        width: '100%',
        padding: '14px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(26,10,46,0.04) 4px, rgba(26,10,46,0.04) 8px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="22" height="2" viewBox="0 0 22 2" fill="none">
            <line x1="0" y1="1" x2="22" y2="1" stroke="#1A0A2E" strokeOpacity="0.4" strokeWidth="1.5" />
          </svg>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <polygon points="3,0 6,3 3,6 0,3" fill="#1A0A2E" fillOpacity="0.5" />
          </svg>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 'clamp(14px, 2.2vw, 20px)',
              fontWeight: 600,
              color: '#1A0A2E',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}
          >
            {message}
          </span>
          {code ? (
            <>
              <span style={{ color: '#1A0A2E', opacity: 0.4, fontSize: 16 }}>|</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                  fontSize: 'clamp(14px, 2.2vw, 20px)',
                  fontWeight: 400,
                  color: '#1A0A2E',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                }}
              >
                {t('useCode')}&nbsp;
                <strong
                  style={{
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    fontSize: 'clamp(15px, 2.4vw, 22px)',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(26,10,46,0.1)',
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}
                >
                  {code}
                </strong>
              </span>
            </>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <polygon points="3,0 6,3 3,6 0,3" fill="#1A0A2E" fillOpacity="0.5" />
          </svg>
          <svg width="22" height="2" viewBox="0 0 22 2" fill="none">
            <line x1="0" y1="1" x2="22" y2="1" stroke="#1A0A2E" strokeOpacity="0.4" strokeWidth="1.5" />
          </svg>

          <Link
            href={ctaHref}
            style={{
              color: '#1A0A2E',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              borderBottom: '1.5px solid rgba(26,10,46,0.5)',
              paddingBottom: 1,
              transition: 'opacity 0.2s',
              flexShrink: 0,
            }}
            className="promo-shop-link"
          >
            {t('shopNow')}
          </Link>
        </div>
      </div>

      <style>{`
        .promo-shop-link:hover { opacity: 0.65; }
      `}</style>
    </div>
  );
}
