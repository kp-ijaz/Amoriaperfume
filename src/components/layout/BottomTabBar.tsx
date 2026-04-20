'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Home, Search, Grid2x2, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Home',       href: '/',                  icon: Home      },
  { label: 'Search',     href: '/products',           icon: Search    },
  { label: 'Categories', href: '/categories',         icon: Grid2x2   },
  { label: 'Wishlist',   href: '/account/wishlist',   icon: Heart     },
  { label: 'Account',   href: '/account/profile',    icon: User      },
];

export function BottomTabBar() {
  const pathname      = usePathname();
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const cartCount     = useSelector((state: RootState) =>
    state.cart.items.reduce((a, i) => a + i.quantity, 0)
  );

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] flex items-center"
      style={{
        backgroundColor: '#0D0A08',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(60px + env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map((tab) => {
        const active  = isActive(tab.href);
        const Icon    = tab.icon;
        const badge   = tab.label === 'Wishlist' ? wishlistCount : 0;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative"
            style={{ minHeight: 60 }}
          >
            <div className="relative">
              <Icon
                size={20}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: active ? '#C9A84C' : 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
              />
              {badge > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ backgroundColor: '#C9A84C', color: '#1A0A2E', padding: '0 3px' }}
                >
                  {badge}
                </span>
              )}
            </div>

            <span
              className="text-[9px] font-medium tracking-wide"
              style={{ color: active ? '#C9A84C' : 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: 28, height: 2, backgroundColor: '#C9A84C' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
