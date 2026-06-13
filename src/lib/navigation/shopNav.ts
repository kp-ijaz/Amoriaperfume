export type ShopNavChild = {
  key: string;
  href: string;
};

export type ShopNavItem =
  | { type: 'link'; key: string; href: string; isRed?: boolean }
  | { type: 'dropdown'; key: string; href: string; children: ShopNavChild[] };

export const SHOP_NAV: ShopNavItem[] = [
  { type: 'link', key: 'navHome', href: '/' },
  { type: 'link', key: 'navCollections', href: '/collections' },
  { type: 'link', key: 'navBrandInspiration', href: '/brand-inspiration' },
  {
    type: 'dropdown',
    key: 'navGiftSets',
    href: '/gift-sets',
    children: [
      { key: 'navGiftSets', href: '/gift-sets' },
      { key: 'navGiftCards', href: '/gift-cards' },
    ],
  },
  { type: 'link', key: 'navBundles', href: '/bundles' },
  { type: 'link', key: 'navCustomPerfume', href: '/custom-perfume' },
  { type: 'link', key: 'navBakhoor', href: '/bakhoor' },
  { type: 'link', key: 'navSale', href: '/products?sale=true', isRed: true },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  const base = href.split('?')[0];
  if (base === '/') return pathname === '/';
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function isDropdownNavActive(pathname: string, item: Extract<ShopNavItem, { type: 'dropdown' }>): boolean {
  return (
    isNavItemActive(pathname, item.href) ||
    item.children.some((child) => isNavItemActive(pathname, child.href))
  );
}
