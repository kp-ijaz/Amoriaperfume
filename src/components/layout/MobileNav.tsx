'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeMobileNav } from '@/lib/store/uiSlice';
import { useBodyLock } from '@/lib/hooks/useBodyLock';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, Search, ChevronRight, Package, Truck, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  SHOP_NAV,
  isDropdownNavActive,
  isNavItemActive,
} from '@/lib/navigation/shopNav';
import type { TranslationKey } from '@/lib/i18n/translations';

export function MobileNav() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.ui.mobileNavOpen);
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  useBodyLock(isOpen);

  function submitSearch() {
    const q = searchQuery.trim();
    if (!q) return;
    dispatch(closeMobileNav());
    setSearchQuery('');
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={() => dispatch(closeMobileNav())}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-50 flex flex-col md:hidden"
            style={{ backgroundColor: 'var(--color-amoria-primary)' }}
          >
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

            <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="relative">
                <button
                  type="button"
                  onClick={submitSearch}
                  aria-label="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <Search size={16} />
                </button>
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder={t('mobileSearchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submitSearch();
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-none outline-none text-white placeholder:text-white/50"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>

            <nav
              className="flex-1 overflow-y-auto py-2"
              style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}
            >
              {SHOP_NAV.map((link) => {
                if (link.type === 'dropdown') {
                  const groupActive = isDropdownNavActive(pathname, link);
                  return (
                    <div key={link.key}>
                      <Link
                        href={link.href}
                        onClick={() => dispatch(closeMobileNav())}
                        className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold border-b transition-colors hover:bg-white/5"
                        style={{
                          color: groupActive ? 'var(--color-amoria-accent)' : 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {t(link.key as TranslationKey)}
                        <ChevronRight size={16} className="opacity-40" />
                      </Link>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => dispatch(closeMobileNav())}
                          className="flex items-center justify-between pl-8 pr-4 py-3 text-sm font-medium border-b transition-colors hover:bg-white/5"
                          style={{
                            color: isNavItemActive(pathname, child.href)
                              ? 'var(--color-amoria-accent)'
                              : 'rgba(255,255,255,0.75)',
                            borderColor: 'rgba(255,255,255,0.06)',
                          }}
                        >
                          {t(child.key as TranslationKey)}
                          <ChevronRight size={14} className="opacity-40" />
                        </Link>
                      ))}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => dispatch(closeMobileNav())}
                    className="flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b transition-colors hover:bg-white/5"
                    style={{
                      color: link.isRed ? '#f87171' : 'rgba(255,255,255,0.85)',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {t(link.key as TranslationKey)}
                      {link.isRed && (
                        <span
                          className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                        >
                          HOT
                        </span>
                      )}
                    </span>
                    <ChevronRight size={16} className="opacity-40" />
                  </Link>
                );
              })}

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
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
