'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/account/orders', label: 'My Orders' },
  { href: '/account/returns', label: 'My Returns' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/profile', label: 'Profile' },
];

export function AccountSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-2 border-b pb-4 mb-8"
      style={{ borderColor: 'var(--color-amoria-border)' }}
      aria-label="Account navigation"
    >
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? 'var(--color-amoria-primary)' : 'transparent',
              color: active ? '#fff' : 'var(--color-amoria-text)',
              border: active ? 'none' : '1px solid var(--color-amoria-border)',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
