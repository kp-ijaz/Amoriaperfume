'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { openCartDrawer, openMobileNav } from '@/lib/store/uiSlice';
import { Heart, ShoppingBag, User, Search, Menu, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import Image from 'next/image';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileNav } from './MobileNav';

const navLinks = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Attar & Oud', href: '/products?category=attar-oud' },
  { label: 'Bakhoor', href: '/products?category=bakhoor' },
  { label: 'Gift Sets', href: '/products?category=gift-sets' },
  { label: 'Brands', href: '/brands' },
  { label: 'Sale', href: '/products?sale=true', isRed: true },
];

export function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
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
      <header className="sticky top-0 z-40 w-full bg-white">
        {/* Main header row */}
        <div
          className="border-b transition-all duration-300"
          style={{
            borderColor: 'var(--color-amoria-border)',
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
              className="flex items-center gap-1 flex-shrink-0 transition-transform duration-300"
              style={{ transform: scrolled ? 'scale(0.92)' : 'scale(1)', transformOrigin: 'left center' }}
            >
              <span
                className="text-2xl font-bold tracking-[0.18em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
              >
                AMORIA
              </span>
              <span
                className="w-[5px] h-[5px] rounded-full mb-3"
                style={{ backgroundColor: 'var(--color-amoria-accent)' }}
              />
            </Link>

            {/* Center nav — desktop only */}
            <nav className="hidden md:flex items-center justify-center flex-1 gap-0.5 px-4">
              {navLinks.map((link) => {
                const active = !link.isRed && isActive(link.href);
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
                    {link.label}
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
                        placeholder="Search perfumes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setShowSearch(false);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }
                        }}
                        className="flex-1 pl-2 pr-2 py-1.5 text-xs outline-none bg-transparent"
                        style={{ color: 'var(--color-amoria-text)' }}
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowSearch(false); }}
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
                                onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchOpen(false); }}
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
                            onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchOpen(false); }}
                            className="block px-4 py-2.5 text-xs text-center border-t transition-colors hover:bg-gray-50"
                            style={{ color: 'var(--color-amoria-accent)', borderColor: 'var(--color-amoria-border)' }}
                          >
                            View all results for &quot;{searchQuery}&quot; →
                          </Link>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                          No results for &quot;{searchQuery}&quot;
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
                <button className="p-2.5 hover:opacity-70 transition-opacity flex items-center gap-0.5">
                  <User size={20} style={{ color: 'var(--color-amoria-primary)' }} />
                  <ChevronDown size={12} style={{ color: 'var(--color-amoria-primary)' }} />
                </button>
                <div
                  className="absolute right-0 top-full hidden group-hover:block bg-white border shadow-lg min-w-[160px] z-50"
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                >
                  <Link href="/login" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                    Register
                  </Link>
                  <div className="border-t" style={{ borderColor: 'var(--color-amoria-border)' }} />
                  <Link href="/account/orders" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                    My Orders
                  </Link>
                  <Link href="/account/profile" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: 'var(--color-amoria-text)' }}>
                    Profile
                  </Link>
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
