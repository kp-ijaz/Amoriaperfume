/** Shown when admin has not published home_slider / hero_side_panel banners yet. */
export const FALLBACK_HERO_SLIDES = [
  {
    id: 'fallback-slide-1',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&q=85',
    title: 'Discover Luxury Fragrances',
    subtitle: 'Authentic perfumes delivered across the UAE',
    ctaLink: '/products',
    ctaText: 'Shop Now',
  },
  {
    id: 'fallback-slide-2',
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=85',
    title: 'Oud & Attar Collection',
    subtitle: 'Timeless Arabian scents',
    ctaLink: '/categories',
    ctaText: 'Explore',
  },
];

export const FALLBACK_HERO_SIDE_PANELS = [
  {
    id: 'fallback-side-1',
    image:
      'https://images.unsplash.com/photo-1616096142563-ce4f6a1a7c79?w=800&q=85',
    badge: 'LIMITED OFFER',
    badgeColor: '#E53E3E',
    title: 'Gift Sets',
    subtitle: 'Perfect for every celebration',
    code: null as string | null,
    href: '/gift-sets',
    cta: 'Shop Gifts',
  },
  {
    id: 'fallback-side-2',
    image:
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=85',
    badge: 'NEW IN',
    badgeColor: '#C9A84C',
    title: 'New Arrivals',
    subtitle: 'Fresh scents just landed',
    code: null as string | null,
    href: '/products?sort=newest',
    cta: 'Explore',
  },
];
