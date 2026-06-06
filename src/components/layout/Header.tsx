'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { openCartDrawer, openMobileNav } from '@/lib/store/uiSlice';
import { Heart, ShoppingBag, User, Search, Menu, ChevronDown, X, LogOut, Package, Settings, Truck, Pencil, Check, MapPin, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useSearchProducts } from '@/lib/hooks/useApiProducts';
import Image from 'next/image';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/context/LanguageContext';

const OFFER_COLORS = ['#dc2626', '#16a34a', 'var(--color-amoria-accent)', '#7c3aed', '#ea580c'];

function LiveOffersTicker() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { tArr } = useLanguage();
  const offers = tArr('liveOffers');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % offers.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [offers.length]);

  const text = offers[activeIdx] ?? '';
  const color = OFFER_COLORS[activeIdx % OFFER_COLORS.length];

  return (
    <div className="flex items-center justify-center overflow-hidden w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="text-[13px] font-medium truncate text-center"
          style={{ color }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const currentLabel = lang === 'ar' ? 'العربية' : 'English';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-black/5 transition-colors"
        style={{ color: 'var(--color-amoria-text-muted)' }}
        aria-label="Select language"
      >
        <span className="text-[13px] font-semibold tracking-wide">{currentLabel}</span>
        <ChevronDown
          size={10}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-1 bg-white border shadow-lg z-50 min-w-[140px] overflow-hidden rounded-sm"
            style={{ borderColor: 'var(--color-amoria-border)' }}
          >
            {(['en', 'ar'] as const).map((code) => {
              const label = code === 'ar' ? 'العربية' : 'English';
              return (
                <button
                  key={code}
                  onClick={() => { setLang(code); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  style={{ color: 'var(--color-amoria-text)' }}
                  dir={code === 'ar' ? 'rtl' : 'ltr'}
                >
                  <span className="text-[13px] font-medium">{label}</span>
                  {lang === code && (
                    <Check size={11} className="ml-auto" style={{ color: 'var(--color-amoria-accent)' }} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NAV_LINK_KEYS: { key: string; href: string; isRed?: boolean }[] = [
  { key: 'navHome',              href: '/' },
  { key: 'navCollections',       href: '/collections' },
  { key: 'navBrandInspiration',  href: '/brand-inspiration' },
  { key: 'navGiftSets',          href: '/gift-sets' },
  { key: 'navGiftCards',         href: '/gift-cards' },
  { key: 'navBakhoor',           href: '/bakhoor' },
  { key: 'navSale',              href: '/products?sale=true', isRed: true },
];

export function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { t } = useLanguage();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query by 300 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: searchResults = [] } = useSearchProducts(debouncedQuery);
  const showSearch = debouncedQuery.length >= 2;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { isLoggedIn, isGuest, guestInfo, user, signOut, clearGuest } = useAuth();

  const isActive = useCallback(
    (href: string) => {
      const base = href.split('?')[0];
      if (base === '/') return pathname === '/';
      return pathname === base || pathname.startsWith(base + '/');
    },
    [pathname],
  );

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full" style={{ backgroundColor: '#FAF8F5' }}>

        {/* ── TOP UTILITY BAR — live offers + language ── */}
        <div
          className="border-b hidden sm:block"
          style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: '#FAF8F5' }}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-8 grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

            {/* LEFT — empty placeholder to keep ticker centered */}
            <div />

            {/* CENTER — offers ticker (truly centered) */}
            <LiveOffersTicker />

            {/* RIGHT — store locator + language */}
            <div className="flex items-center justify-end gap-3">
              <a
                href="/contact"
                className="hidden sm:flex items-center gap-1.5 flex-shrink-0 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-amoria-text-muted)' }}
              >
                <MapPin size={13} />
                <span className="text-[13px] font-medium">{t('storeLocator')}</span>
              </a>
              <span className="hidden sm:block w-px h-3 opacity-25" style={{ backgroundColor: 'var(--color-amoria-text-muted)' }} />
              <LanguageDropdown />
            </div>

          </div>
        </div>

        {/* Main header row */}
        <div
          className="transition-all duration-300"
          style={{
            boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-[68px] flex items-center">

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 mr-1"
              onClick={() => dispatch(openMobileNav())}
              aria-label="Open menu"
            >
              <Menu size={22} style={{ color: 'var(--color-amoria-primary)' }} />
            </button>

            {/* Logo — left */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 transition-transform duration-300"
              style={{ transform: scrolled ? 'scale(0.92)' : 'scale(1)', transformOrigin: 'left center' }}
            >
              <Image
                src="/brand-icon.png"
                alt="Amoria"
                width={40}
                height={40}
                className="transition-all duration-300 object-contain"
                style={{ width: scrolled ? 32 : 40, height: scrolled ? 32 : 40 }}
                priority
              />
              <span
                className="text-2xl font-bold tracking-[0.18em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
              >
                AMORIA
              </span>
            </Link>

            {/* Center nav — desktop only */}
            <nav className="hidden md:flex items-center justify-center flex-1 gap-0.5 px-4">
              {NAV_LINK_KEYS.map((link) => {
                const active = !link.isRed && isActive(link.href);
                const label = t(link.key as Parameters<typeof t>[0]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide group transition-colors duration-200 ${
                      link.isRed
                        ? 'text-red-500'
                        : active
                          ? 'text-[#1A0A2E]'
                          : 'text-[#4A4A4A] hover:text-[#1A0A2E]'
                    }`}
                  >
                    {label}
                    {link.isRed && (
                      <span
                        className="ml-1 text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-sm"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      >
                        HOT
                      </span>
                    )}
                    {/* Hover / active underline */}
                    {!link.isRed && (
                      <span
                        className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full transition-transform duration-250 origin-center"
                        style={{
                          backgroundColor: 'var(--color-amoria-accent)',
                          transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    )}
                    {!link.isRed && !active && (
                      <span
                        className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-center"
                        style={{ backgroundColor: 'var(--color-amoria-accent)' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 ml-auto md:ml-0">

              {/* Search — expandable on desktop */}
              <div ref={searchRef} className="relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden md:flex items-center border rounded-none overflow-hidden"
                      style={{ borderColor: 'var(--color-amoria-accent)' }}
                    >
                      <Search
                        size={14}
                        className="ml-2.5 flex-shrink-0"
                        style={{ color: 'var(--color-amoria-text-muted)' }}
                      />
                      <input
                        ref={searchInputRef}
                        type="search"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }
                        }}
                        className="flex-1 pl-2 pr-2 py-1.5 text-xs outline-none bg-transparent"
                        style={{ color: 'var(--color-amoria-text)' }}
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="p-1.5 hover:opacity-60 transition-opacity"
                      >
                        <X size={12} style={{ color: 'var(--color-amoria-text-muted)' }} />
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={openSearch}
                      className="hidden md:flex p-2.5 hover:opacity-70 transition-opacity"
                      aria-label="Search"
                    >
                      <Search size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                    </button>
                  )}
                </AnimatePresence>

                {/* Mobile search icon (doesn't expand) */}
                <button
                  className="md:hidden p-2.5 hover:opacity-70 transition-opacity"
                  aria-label="Search"
                >
                  <Search size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                </button>

                {/* Search dropdown */}
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full right-0 bg-white border shadow-xl z-50 mt-1 overflow-hidden"
                      style={{ borderColor: 'var(--color-amoria-border)', width: '280px' }}
                    >
                      {searchResults.length > 0 ? (
                        <>
                          {searchResults.map((product, idx) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.15, delay: idx * 0.04 }}
                            >
                              <Link
                                href={`/products/${product.slug}`}
                                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                              >
                                <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 overflow-hidden">
                                  <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-amoria-text)' }}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                                    {product.brand}
                                  </p>
                                </div>
                                <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--color-amoria-accent)' }}>
                                  {formatCurrency(product.variants[0]?.salePrice ?? product.variants[0]?.price ?? 0)}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                          <Link
                            href={`/products?q=${searchQuery}`}
                            onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                            className="block px-4 py-2.5 text-xs text-center border-t transition-colors hover:bg-gray-50"
                            style={{ color: 'var(--color-amoria-accent)', borderColor: 'var(--color-amoria-border)' }}
                          >
                            {t('searchViewAll')} &quot;{searchQuery}&quot; →
                          </Link>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                          {t('searchNoResults')} &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative p-2.5 hover:opacity-70 transition-opacity hidden md:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                {wishlistItems.length > 0 && (
                  <span
                    className="absolute top-1 right-1 w-[16px] h-[16px] rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--color-amoria-accent)' }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCartDrawer())}
                className="relative p-2.5 hover:opacity-70 transition-opacity"
                aria-label="Cart"
              >
                <ShoppingBag size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-[16px] h-[16px] rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--color-amoria-accent)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <div className="relative group hidden md:block">
                <button className="p-2.5 hover:opacity-70 transition-opacity flex items-center gap-1">
                  {isLoggedIn ? (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
                    >
                      {user!.firstName[0]}{user!.lastName[0]}
                    </div>
                  ) : (
                    <>
                      <User size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                      <ChevronDown size={12} style={{ color: 'var(--color-amoria-primary)' }} />
                    </>
                  )}
                </button>
                <div
                  className="absolute right-0 top-full hidden group-hover:block bg-white border shadow-xl min-w-[200px] z-50"
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                >
                  {isLoggedIn ? (
                    <>
                      {/* User info */}
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: '#FAF8F5' }}>
                        <p className="text-sm font-semibold" style={{ color: '#1A0A2E' }}>{user!.firstName} {user!.lastName}</p>
                        <p className="text-[11px] truncate" style={{ color: '#A89880' }}>{user!.email}</p>
                      </div>
                      <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <Package size={14} style={{ color: '#A89880' }} /> {t('myOrders')}
                      </Link>
                      <Link href="/account/returns" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <RotateCcw size={14} style={{ color: '#A89880' }} /> My Returns
                      </Link>
                      <Link href="/track-order" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <Truck size={14} style={{ color: '#A89880' }} /> {t('trackOrder')}
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <Heart size={14} style={{ color: '#A89880' }} /> {t('myWishlist')}
                      </Link>
                      <Link href="/account/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <Settings size={14} style={{ color: '#A89880' }} /> {t('profileSettings')}
                      </Link>
                      <div className="border-t" style={{ borderColor: 'var(--color-amoria-border)' }} />
                      <button
                        onClick={signOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-red-50 transition-colors text-left"
                        style={{ color: '#dc2626' }}
                      >
                        <LogOut size={14} /> {t('signOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest profile card — shown when they've checked out as guest before */}
                      {isGuest && guestInfo ? (
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: '#FAF8F5' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                              style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                              {guestInfo.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold truncate" style={{ color: '#1A0A2E' }}>{guestInfo.name}</p>
                          </div>
                          <p className="text-[11px] truncate mb-2" style={{ color: '#A89880' }}>{guestInfo.email}</p>
                          <div className="flex gap-2">
                            <Link href="/checkout?editGuest=1" className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 transition-colors hover:bg-gray-100"
                              style={{ color: '#1A0A2E', border: '1px solid #E8E3DC' }}>
                              <Pencil size={10} /> {t('editDetails')}
                            </Link>
                            <button onClick={clearGuest}
                              className="text-[11px] font-semibold px-2 py-1 transition-colors hover:bg-red-50"
                              style={{ color: '#ef4444', border: '1px solid #fecaca' }}>
                              {t('clear')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Link href="/login" className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors border-b" style={{ color: '#1A0A2E', borderColor: 'var(--color-amoria-border)' }}>
                            {t('signIn')}
                          </Link>
                          <Link href="/register" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b" style={{ color: 'var(--color-amoria-text)', borderColor: 'var(--color-amoria-border)' }}>
                            {t('createAccount')}
                          </Link>
                        </>
                      )}
                      <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                        <Package size={14} style={{ color: '#A89880' }} /> {t('myOrders')}
                      </Link>
                      <Link href="/track-order" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b" style={{ color: 'var(--color-amoria-text)', borderColor: 'var(--color-amoria-border)' }}>
                        <Truck size={14} style={{ color: '#C9A84C' }} />
                        <span>{t('trackOrder')}</span>
                      </Link>
                      {!isGuest && (
                        <div className="px-4 py-2.5">
                          <Link href="/checkout" className="block text-xs font-semibold" style={{ color: '#C9A84C' }}>
                            {t('guestCheckout')}
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
      <MobileNav />
    </>
  );
}
