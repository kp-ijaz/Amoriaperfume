import type { Metadata } from 'next';
import { buildPageMetadata } from './metadata';

export const homeMetadata: Metadata = buildPageMetadata({
  title: 'Buy Perfume Online UAE — Arabian Oud, Attar & Fragrances',
  description:
    'Shop premium Arabian perfumes, oud, attars, and niche fragrances online in UAE. Authentic brands, fast delivery across Dubai and the Emirates. Free delivery on orders over AED 200.',
  path: '/',
  keywords: [
    'buy perfume online UAE',
    'Arabian perfume',
    'oud perfume',
    'attar UAE',
    'Dubai perfume shop',
  ],
});

export const productsListingMetadata: Metadata = buildPageMetadata({
  title: 'Shop Perfumes, Oud & Attars',
  description:
    'Browse our full collection of men\'s, women\'s, and unisex perfumes. Filter by brand, fragrance family, price, and concentration. Authentic Arabian fragrances delivered across UAE.',
  path: '/products',
  keywords: ['shop perfume', 'perfume collection', 'oud', 'attar', 'fragrance UAE'],
});

export const brandsListingMetadata: Metadata = buildPageMetadata({
  title: 'Perfume Brands',
  description:
    'Explore top Arabian and international perfume brands at Amoria — Swiss Arabian, Ajmal, Rasasi, Lattafa, Armaf, and more. Shop authentic fragrances in UAE.',
  path: '/brands',
});

export const categoriesListingMetadata: Metadata = buildPageMetadata({
  title: 'Fragrance Categories',
  description:
    'Shop perfumes by category — attar & oud, bakhoor, gift sets, men\'s and women\'s fragrances, niche perfumes, and more. Delivered across UAE.',
  path: '/categories',
});

export const giftSetsListingMetadata: Metadata = buildPageMetadata({
  title: 'Perfume Gift Sets',
  description:
    'Luxury perfume gift sets for Eid, weddings, birthdays, and corporate gifting. Curated Arabian fragrance collections delivered across UAE.',
  path: '/gift-sets',
});

export const bundlesListingMetadata: Metadata = buildPageMetadata({
  title: 'Perfume Bundles & Deals',
  description:
    'Save on hand-picked perfume bundles — multiple scents at special prices. Authentic Arabian fragrances with delivery across UAE.',
  path: '/bundles',
});

export const bakhoorMetadata: Metadata = buildPageMetadata({
  title: 'Bakhoor & Incense',
  description:
    'Shop premium bakhoor and Arabian incense at Amoria. Traditional oud bakhoor for home and special occasions. Delivery across UAE.',
  path: '/bakhoor',
});

export const brandInspirationMetadata: Metadata = buildPageMetadata({
  title: 'Inspired Perfume Collections',
  description:
    'Discover inspired Arabian fragrances — luxury scents inspired by iconic designer perfumes at accessible prices. Shop online in UAE.',
  path: '/brand-inspiration',
});

export const contactMetadata: Metadata = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Amoria for perfume orders, bespoke fragrance enquiries, and customer support. We serve customers across the UAE.',
  path: '/contact',
});

export const fragranceFinderMetadata: Metadata = buildPageMetadata({
  title: 'Fragrance Finder Quiz',
  description:
    'Find your perfect perfume in 5 questions. Our fragrance finder matches you with Arabian oud, attar, and niche scents based on your style.',
  path: '/fragrance-finder',
});

export const storeLocatorMetadata: Metadata = buildPageMetadata({
  title: 'Store Locator',
  description: 'Find Amoria pickup locations and stores across the UAE.',
  path: '/store-locator',
});

export const customPerfumeMetadata: Metadata = buildPageMetadata({
  title: 'Custom Perfume',
  description: 'Create your bespoke Arabian fragrance with Amoria custom perfume service.',
  path: '/custom-perfume',
});

export const giftCardsMetadata: Metadata = buildPageMetadata({
  title: 'Gift Cards',
  description: 'Give the gift of fragrance with Amoria perfume gift cards. Redeemable online across our UAE store.',
  path: '/gift-cards',
});

export const collectionsListingMetadata: Metadata = buildPageMetadata({
  title: 'Perfume Collections',
  description: 'Explore curated perfume collections — new arrivals, best sellers, and seasonal edits at Amoria UAE.',
  path: '/collections',
});
