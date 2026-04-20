export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export const banners: Banner[] = [
  {
    id: 'b1',
    image: '/images/collections/hero-dark.jpg',
    title: 'The Art of Arabian Scent',
    subtitle: 'Discover perfumes that tell your story — crafted with the finest ingredients from the heart of Arabia.',
    ctaText: 'Shop Collection',
    ctaLink: '/products',
  },
  {
    id: 'b2',
    image: '/images/products/prod1.jpg',
    title: 'New Arrivals 2025',
    subtitle: 'Be the first to discover our latest collection — fresh interpretations of timeless Arabian elegance.',
    ctaText: 'Explore Now',
    ctaLink: '/products?filter=new',
  },
  {
    id: 'b3',
    image: '/images/products/prod2.jpg',
    title: 'Eid Collection',
    subtitle: 'Celebrate with the gift of luxury fragrance. Use code EID25 for 25% off all gift sets.',
    ctaText: 'Shop Gifts',
    ctaLink: '/products?category=gift-sets',
  },
];
