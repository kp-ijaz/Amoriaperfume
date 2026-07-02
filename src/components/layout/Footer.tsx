'use client';

import Link from 'next/link';
import { Camera, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { labelKey: 'footerLinkHome' as const,             href: '/' },
    { labelKey: 'footerLinkAllProducts' as const,      href: '/products' },
    { labelKey: 'footerLinkBrands' as const,           href: '/brands' },
    { labelKey: 'footerLinkFragranceGuide' as const,   href: '/fragrance-guide' },
    { labelKey: 'footerLinkAboutUs' as const,          href: '/about' },
    { labelKey: 'footerLinkFragranceFinder' as const,  href: '/fragrance-finder' },
  ];

  const serviceLinks = [
    { labelKey: 'footerLinkFAQs' as const,      href: '/faqs' },
    { labelKey: 'footerLinkTrackOrder' as const, href: '/track-order' },
    { labelKey: 'footerLinkGiftCards' as const, href: '/gift-cards' },
    { labelKey: 'footerLinkCustomPerfume' as const, href: '/custom-perfume' },
    { labelKey: 'footerLinkReturns' as const,    href: '/returns' },
    { labelKey: 'footerLinkContact' as const,    href: '/contact' },
    { labelKey: 'footerLinkPrivacy' as const,    href: '/privacy' },
    { labelKey: 'footerLinkTerms' as const,      href: '/terms' },
  ];

  return (
    <footer
      className="pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0"
      style={{ backgroundColor: 'var(--color-amoria-dark)' }}
    >
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span
                className="text-2xl font-bold tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
              >
                AMORIA
              </span>
              <span className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: 'var(--color-amoria-accent)' }} />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {t('footerAbout')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/amoria.ae"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Amoria on Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                <Camera size={16} />
              </a>
              <a
                href="https://tiktok.com/@amoria.ae"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Amoria on TikTok"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                TK
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              {t('footerCustomerService')}
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              {t('footerContactUs')}
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="tel:+971501234567" className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <Phone size={14} className="mt-0.5 flex-shrink-0" />
                  +971 50 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:hello@amoria.ae" className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  hello@amoria.ae
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  Dubai, United Arab Emirates
                </span>
              </li>
            </ul>

            {/* Payment badges */}
            <div>
              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('footerWeAccept')}</p>
              <div className="flex gap-2 flex-wrap">
                {['VISA', 'MC', 'APPAY', 'COD'].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="h-px mb-6" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('footerCopyright')}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('footerLinkPrivacy')}
            </Link>
            <Link href="/terms" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('footerLinkTerms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
