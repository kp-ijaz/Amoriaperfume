'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeMobileNav } from '@/lib/store/uiSlice';
import { useBodyLock } from '@/lib/hooks/useBodyLock';
import Link from 'next/link';
import { X, Search, ChevronRight, Package, Truck, MapPin, Globe, Check, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useState } from 'react';

const NAV_LINK_KEYS: { key: string; href: string; isRed?: boolean }[] = [
  { key: 'navHome',             href: '/' },
  { key: 'navCollections',      href: '/collections' },
  { key: 'navBrandInspiration', href: '/brand-inspiration' },
  { key: 'navGiftSets',         href: '/gift-sets' },
  { key: 'navGiftCards',        href: '/gift-cards' },
  { key: 'navBakhoor',          href: '/bakhoor' },
  { key: 'navSale',             href: '/products?sale=true', isRed: true },
];

export function MobileNav() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.mobileNavOpen);
  const { t, lang, setLang, tArr } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  useBodyLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={() => dispatch(closeMobileNav())}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-50 flex flex-col md:hidden"
            style={{ backgroundColor: 'var(--color-amoria-primary)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <Image
                  src="/brand-icon.png"
                  alt="Amoria"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span
                  className="text-xl font-bold tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
                >
                  AMORIA
                </span>
              </div>
              <button
                onClick={() => dispatch(closeMobileNav())}
                className="p-2 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="search"
                  placeholder={t('mobileSearchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-none outline-none text-white placeholder:text-white/50"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>

            {/* Nav links — bottom padding so content clears the tab bar */}
            <nav
              className="flex-1 overflow-y-auto py-2"
              style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}
            >
              {NAV_LINK_KEYS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => dispatch(closeMobileNav())}
                  className="flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b transition-colors hover:bg-white/5"
                  style={{ color: link.isRed ? '#f87171' : 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="flex items-center gap-2">
                    {t(link.key as Parameters<typeof t>[0])}
                    {link.isRed && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        HOT
                      </span>
                    )}
                  </span>
                  <ChevronRight size={16} className="opacity-40" />
                </Link>
              ))}

              {/* Orders & Tracking */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
                  {t('mobileOrders')}
                </p>
                <Link href="/account/orders" onClick={() => dispatch(closeMobileNav())} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <Package size={15} style={{ color: 'rgba(201,168,76,0.7)' }} />
                  {t('myOrders')}
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </Link>
                <Link href="/account/returns" onClick={() => dispatch(closeMobileNav())} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <RotateCcw size={15} style={{ color: 'rgba(201,168,76,0.7)' }} />
                  My Returns
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </Link>
                <Link href="/track-order" onClick={() => dispatch(closeMobileNav())} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <Truck size={15} style={{ color: 'rgba(201,168,76,0.7)' }} />
                  {t('trackOrder')}
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </Link>
              </div>

              {/* Account */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
                  {t('mobileAccount')}
                </p>
                <Link href="/login" onClick={() => dispatch(closeMobileNav())} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('mobileLogin')}
                </Link>
                <Link href="/register" onClick={() => dispatch(closeMobileNav())} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('mobileRegister')}
                </Link>
              </div>

              {/* Store & Settings */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
                  SETTINGS
                </p>

                {/* Store Locator */}
                <Link
                  href="/contact"
                  onClick={() => dispatch(closeMobileNav())}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b"
                  style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <MapPin size={15} style={{ color: 'rgba(201,168,76,0.7)' }} />
                  {t('storeLocator')}
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </Link>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b"
                    style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <Globe size={15} style={{ color: 'rgba(201,168,76,0.7)' }} />
                    <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto opacity-40 transition-transform"
                      style={{ transform: langOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {/* Language options */}
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        {(['en', 'ar'] as const).map((code) => {
                          const label = code === 'ar' ? 'العربية' : 'English';
                          const isActive = lang === code;
                          return (
                            <button
                              key={code}
                              onClick={() => {
                                setLang(code);
                                setLangOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-8 py-2.5 text-sm transition-colors hover:bg-white/10"
                              style={{ color: isActive ? 'var(--color-amoria-accent)' : 'rgba(255,255,255,0.7)' }}
                              dir={code === 'ar' ? 'rtl' : 'ltr'}
                            >
                              {label}
                              {isActive && (
                                <Check size={14} className="ml-auto" style={{ color: 'var(--color-amoria-accent)' }} />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
