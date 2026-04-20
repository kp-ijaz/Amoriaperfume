'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeMobileNav } from '@/lib/store/uiSlice';
import Link from 'next/link';
import { X, Search, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Attar & Oud', href: '/products?category=attar-oud' },
  { label: 'Bakhoor', href: '/products?category=bakhoor' },
  { label: 'Gift Sets', href: '/products?category=gift-sets' },
  { label: 'Brands', href: '/brands' },
  { label: 'Sale', href: '/products?sale=true' },
];

export function MobileNav() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.mobileNavOpen);

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
              <span
                className="text-xl font-bold tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
              >
                AMORIA
              </span>
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
                  placeholder="Search perfumes..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-none outline-none text-white placeholder:text-white/50"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => dispatch(closeMobileNav())}
                  className="flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b transition-colors hover:bg-white/5"
                  style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  {link.label}
                  <ChevronRight size={16} className="opacity-40" />
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
                  Account
                </p>
                <Link href="/login" onClick={() => dispatch(closeMobileNav())} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Login
                </Link>
                <Link href="/register" onClick={() => dispatch(closeMobileNav())} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Register
                </Link>
                <Link href="/account/orders" onClick={() => dispatch(closeMobileNav())} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  My Orders
                </Link>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
