import { Product } from '@/types/product';

// 20 locally-downloaded perfume images in /public/images/products/
const TOTAL_IMGS = 20;

function img(idx: number): string {
  const n = (idx % TOTAL_IMGS) + 1;
  return `/images/products/prod${n}.jpg`;
}
// Secondary: use the next image in the cycle for the hover effect
function imgSecondary(idx: number): string {
  const n = ((idx + 1) % TOTAL_IMGS) + 1;
  return `/images/products/prod${n}.jpg`;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'shaghaf-oud-aswad',
    name: 'Shaghaf Oud Aswad',
    brand: 'Swiss Arabian',
    category: 'Attar & Oud',
    gender: 'unisex',
    fragranceFamily: 'Woody Oud',
    concentration: 'EDP',
    topNotes: ['Saffron', 'Black Pepper', 'Bergamot'],
    heartNotes: ['Oud', 'Rose', 'Vetiver'],
    baseNotes: ['Amber', 'Musk', 'Sandalwood', 'Incense'],
    description:
      'Shaghaf Oud Aswad is a masterpiece of Arabian perfumery, weaving dark oud with luminous rose and velvety amber. This bold, unisex fragrance commands attention from the first spritz to the final lingering note. A true statement of Arabian luxury.',
    images: [
      { url: img(0), alt: 'Shaghaf Oud Aswad', isPrimary: true },
      { url: imgSecondary(0), alt: 'Shaghaf Oud Aswad secondary', isPrimary: false },
    ],
    variants: [
      { id: '1-50', sizeMl: 50, concentration: 'EDP', price: 390, salePrice: 390, stock: 20 },
      { id: '1-100', sizeMl: 100, concentration: 'EDP', price: 420, salePrice: 390, stock: 15 },
    ],
    rating: 4.8,
    reviewCount: 312,
    tags: ['oud', 'amber', 'dark', 'mysterious', 'evening', 'strong', 'unisex'],
    isBestseller: true,
    isOnSale: true,
  },
  {
    id: '2',
    slug: 'rose-oud',
    name: 'Rose Oud',
    brand: 'Ajmal',
    category: 'Attar & Oud',
    gender: 'women',
    fragranceFamily: 'Floral Oud',
    concentration: 'EDP',
    topNotes: ['Rose', 'Lychee', 'Raspberry'],
    heartNotes: ['Bulgarian Rose', 'Oud', 'Jasmine'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    description:
      'Rose Oud by Ajmal is a romantic symphony of Bulgarian rose and precious oud. The fragrance blooms like a garden at dusk, feminine yet grounded by earthy woods. A timeless scent for the modern Arabian woman.',
    images: [
      { url: img(1), alt: 'Rose Oud', isPrimary: true },
      { url: imgSecondary(1), alt: 'Rose Oud secondary', isPrimary: false },
    ],
    variants: [
      { id: '2-50', sizeMl: 50, concentration: 'EDP', price: 280, stock: 25 },
      { id: '2-100', sizeMl: 100, concentration: 'EDP', price: 380, stock: 18 },
    ],
    rating: 4.6,
    reviewCount: 187,
    tags: ['rose', 'floral', 'oud', 'feminine', 'romantic', 'special-occasion'],
    isNewArrival: true,
  },
  {
    id: '3',
    slug: 'amber-woods-intense',
    name: 'Amber Woods Intense',
    brand: 'Rasasi',
    category: 'Premium Signature',
    gender: 'men',
    fragranceFamily: 'Amber Woody',
    concentration: 'EDP',
    topNotes: ['Cardamom', 'Grapefruit', 'Nutmeg'],
    heartNotes: ['Cedarwood', 'Vetiver', 'Amber'],
    baseNotes: ['Musk', 'Benzoin', 'Labdanum'],
    description:
      'Amber Woods Intense is a bold declaration of masculinity from Rasasi. Rich cardamom and zesty grapefruit open the way for a deep cedar heart, all resting on a warm amber and musk base. Perfect for the confident man.',
    images: [
      { url: img(2), alt: 'Amber Woods Intense', isPrimary: true },
      { url: imgSecondary(2), alt: 'Amber Woods Intense secondary', isPrimary: false },
    ],
    variants: [
      { id: '3-50', sizeMl: 50, concentration: 'EDP', price: 159, salePrice: 159, stock: 30 },
      { id: '3-100', sizeMl: 100, concentration: 'EDP', price: 199, salePrice: 159, stock: 22 },
    ],
    rating: 4.5,
    reviewCount: 203,
    tags: ['amber', 'woody', 'masculine', 'warm', 'office', 'all-day'],
    isOnSale: true,
  },
  {
    id: '4',
    slug: 'oud-mood',
    name: 'Oud Mood',
    brand: 'Lattafa',
    category: 'Niche',
    gender: 'men',
    fragranceFamily: 'Woody Oud',
    concentration: 'EDP',
    topNotes: ['Saffron', 'Bergamot'],
    heartNotes: ['Oud', 'Leather', 'Rose'],
    baseNotes: ['Amber', 'Sandalwood', 'Musk'],
    description:
      'Oud Mood captures the essence of Arabian nights in a single bottle. Smoky oud and supple leather intertwine with saffron gold, creating an intoxicating masculine scent that lasts all day and into the evening.',
    images: [
      { url: img(3), alt: 'Oud Mood', isPrimary: true },
      { url: imgSecondary(3), alt: 'Oud Mood secondary', isPrimary: false },
    ],
    variants: [
      { id: '4-100', sizeMl: 100, concentration: 'EDP', price: 159, stock: 40 },
    ],
    rating: 4.4,
    reviewCount: 156,
    tags: ['oud', 'leather', 'masculine', 'dark', 'evening', 'strong'],
    isNewArrival: true,
  },
  {
    id: '5',
    slug: 'rose-elixir',
    name: 'Rose Elixir',
    brand: 'Armaf',
    category: 'Inspired Collections',
    gender: 'women',
    fragranceFamily: 'Floral',
    concentration: 'EDP',
    topNotes: ['Peach', 'Pink Pepper', 'Bergamot'],
    heartNotes: ['Rose', 'Peony', 'Freesia'],
    baseNotes: ['Musk', 'Sandalwood', 'Vanilla'],
    description:
      'Rose Elixir is a modern floral dream from Armaf, perfect for the contemporary woman who appreciates accessible luxury. Fresh peach and pink pepper open to a lush rose heart, softened by creamy sandalwood and vanilla.',
    images: [
      { url: img(4), alt: 'Rose Elixir', isPrimary: true },
      { url: imgSecondary(4), alt: 'Rose Elixir secondary', isPrimary: false },
    ],
    variants: [
      { id: '5-50', sizeMl: 50, concentration: 'EDP', price: 99, salePrice: 99, stock: 35 },
      { id: '5-100', sizeMl: 100, concentration: 'EDP', price: 129, salePrice: 99, stock: 28 },
    ],
    rating: 4.3,
    reviewCount: 98,
    tags: ['floral', 'rose', 'feminine', 'fresh', 'daily', 'office'],
    isOnSale: true,
  },
  {
    id: '6',
    slug: 'bakhoor-oud-al-layl',
    name: 'Bakhoor Oud Al Layl',
    brand: 'Ajmal',
    category: 'Bakhoor',
    gender: 'unisex',
    fragranceFamily: 'Oud Incense',
    concentration: 'Bakhoor',
    topNotes: ['Oud', 'Incense'],
    heartNotes: ['Amber', 'Sandalwood'],
    baseNotes: ['Musk', 'Vanilla'],
    description:
      'Bakhoor Oud Al Layl is a premium Arabian bakhoor blend by Ajmal, designed to fill your home with the rich scent of oud and incense. Light these chips on a traditional mabkhara and let the fragrant smoke transform your space.',
    images: [
      { url: img(5), alt: 'Bakhoor Oud Al Layl', isPrimary: true },
      { url: imgSecondary(5), alt: 'Bakhoor Oud Al Layl secondary', isPrimary: false },
    ],
    variants: [
      { id: '6-100g', sizeMl: 0, concentration: 'Bakhoor', price: 185, stock: 50 },
    ],
    rating: 4.7,
    reviewCount: 89,
    tags: ['bakhoor', 'oud', 'incense', 'home', 'traditional'],
  },
  {
    id: '7',
    slug: 'shumukh',
    name: 'Shumukh',
    brand: 'Swiss Arabian',
    category: 'Premium Signature',
    gender: 'unisex',
    fragranceFamily: 'Oriental Woody',
    concentration: 'EDP',
    topNotes: ['Ambrette', 'Saffron', 'Bergamot'],
    heartNotes: ['Oud', 'Bulgarian Rose', 'Violet'],
    baseNotes: ['Amber', 'Sandalwood', 'Musk', 'Vanilla'],
    description:
      'Shumukh — meaning "pride" in Arabic — is the crown jewel of Swiss Arabian. This extraordinary fragrance layers the finest oud with Bulgarian rose and violet, all wrapped in a magnificent amber and sandalwood base. The world record holder for the tallest bottle of perfume.',
    images: [
      { url: img(6), alt: 'Shumukh', isPrimary: true },
      { url: imgSecondary(6), alt: 'Shumukh secondary', isPrimary: false },
    ],
    variants: [
      { id: '7-50', sizeMl: 50, concentration: 'EDP', price: 650, stock: 10 },
      { id: '7-100', sizeMl: 100, concentration: 'EDP', price: 950, stock: 5 },
    ],
    rating: 4.9,
    reviewCount: 412,
    tags: ['oud', 'rose', 'amber', 'premium', 'special-occasion', 'commanding', 'bold'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: '8',
    slug: 'majd-al-sultan',
    name: 'Majd Al Sultan',
    brand: 'Rasasi',
    category: 'Attar & Oud',
    gender: 'men',
    fragranceFamily: 'Oriental Spicy',
    concentration: 'EDP',
    topNotes: ['Cardamom', 'Saffron', 'Grapefruit'],
    heartNotes: ['Oud', 'Leather', 'Amber'],
    baseNotes: ['Sandalwood', 'Musk', 'Labdanum'],
    description:
      'Majd Al Sultan — "Glory of the Sultan" — is a regal men\'s fragrance from Rasasi. Spiced cardamom and precious oud announce the arrival of a true leader, while warm sandalwood and musk ensure a lasting, majestic presence.',
    images: [
      { url: img(7), alt: 'Majd Al Sultan', isPrimary: true },
      { url: imgSecondary(7), alt: 'Majd Al Sultan secondary', isPrimary: false },
    ],
    variants: [
      { id: '8-50', sizeMl: 50, concentration: 'EDP', price: 299, stock: 18 },
      { id: '8-100', sizeMl: 100, concentration: 'EDP', price: 380, stock: 12 },
    ],
    rating: 4.6,
    reviewCount: 134,
    tags: ['oud', 'spicy', 'masculine', 'evening', 'commanding', 'bold'],
  },
  {
    id: '9',
    slug: 'ana-abiyedh-rouge',
    name: 'Ana Abiyedh Rouge',
    brand: 'Lattafa',
    category: 'Inspired Collections',
    gender: 'women',
    fragranceFamily: 'Floral Gourmand',
    concentration: 'EDP',
    topNotes: ['Strawberry', 'Raspberry', 'Bergamot'],
    heartNotes: ['Rose', 'Jasmine', 'Iris'],
    baseNotes: ['Vanilla', 'Musk', 'Sandalwood'],
    description:
      'Ana Abiyedh Rouge is a sweet and playful feminine fragrance from Lattafa. Bursting with ripe berries and delicate florals, it settles into a warm vanilla and musk base that\'s both comforting and alluring. Perfect for everyday wear.',
    images: [
      { url: img(8), alt: 'Ana Abiyedh Rouge', isPrimary: true },
      { url: imgSecondary(8), alt: 'Ana Abiyedh Rouge secondary', isPrimary: false },
    ],
    variants: [
      { id: '9-60', sizeMl: 60, concentration: 'EDP', price: 89, stock: 45 },
    ],
    rating: 4.2,
    reviewCount: 267,
    tags: ['floral', 'gourmand', 'sweet', 'feminine', 'daily', 'fresh'],
  },
  {
    id: '10',
    slug: 'club-de-nuit-intense',
    name: 'Club de Nuit Intense',
    brand: 'Armaf',
    category: 'Premium Signature',
    gender: 'men',
    fragranceFamily: 'Woody Aromatic',
    concentration: 'EDP',
    topNotes: ['Lemon', 'Black Currant', 'Apple', 'Pineapple'],
    heartNotes: ['Birch', 'Jasmine', 'Rose'],
    baseNotes: ['Musk', 'Ambergris', 'Patchouli', 'Vanilla'],
    description:
      'Club de Nuit Intense is Armaf\'s most iconic creation — an inspired interpretation of a classic that has captivated millions. Fresh fruit opens to a sophisticated woody-floral heart before settling into a deep, smoky ambergris base. A modern classic.',
    images: [
      { url: img(9), alt: 'Club de Nuit Intense', isPrimary: true },
      { url: imgSecondary(9), alt: 'Club de Nuit Intense secondary', isPrimary: false },
    ],
    variants: [
      { id: '10-50', sizeMl: 50, concentration: 'EDP', price: 119, salePrice: 119, stock: 32 },
      { id: '10-105', sizeMl: 105, concentration: 'EDP', price: 149, salePrice: 119, stock: 24 },
    ],
    rating: 4.7,
    reviewCount: 489,
    tags: ['woody', 'aromatic', 'masculine', 'fresh', 'all-day', 'office', 'moderate'],
    isBestseller: true,
    isOnSale: true,
  },
  {
    id: '11',
    slug: 'haneen',
    name: 'Haneen',
    brand: 'Ajmal',
    category: 'Niche',
    gender: 'women',
    fragranceFamily: 'Oriental Floral',
    concentration: 'EDP',
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'],
    heartNotes: ['Bulgarian Rose', 'Jasmine', 'Oud'],
    baseNotes: ['Amber', 'Musk', 'Sandalwood', 'Vanilla'],
    description:
      'Haneen — meaning "longing" in Arabic — is Ajmal\'s ode to nostalgia and desire. Saffron and bergamot open this deeply feminine oriental fragrance, leading to a lush rose and jasmine heart warmed by precious oud and vanilla. A fragrance you\'ll never want to wash off.',
    images: [
      { url: img(10), alt: 'Haneen', isPrimary: true },
      { url: imgSecondary(10), alt: 'Haneen secondary', isPrimary: false },
    ],
    variants: [
      { id: '11-50', sizeMl: 50, concentration: 'EDP', price: 349, stock: 15 },
      { id: '11-100', sizeMl: 100, concentration: 'EDP', price: 480, stock: 8 },
    ],
    rating: 4.8,
    reviewCount: 201,
    tags: ['oriental', 'floral', 'rose', 'saffron', 'feminine', 'evening', 'special-occasion', 'commanding'],
    isFeatured: true,
  },
  {
    id: '12',
    slug: 'oud-and-rose',
    name: 'Oud & Rose',
    brand: 'Swiss Arabian',
    category: 'Attar & Oud',
    gender: 'women',
    fragranceFamily: 'Floral Oud',
    concentration: 'EDP',
    topNotes: ['Rose', 'Bergamot'],
    heartNotes: ['Oud', 'Patchouli', 'Jasmine'],
    baseNotes: ['Amber', 'Musk', 'Sandalwood'],
    description:
      'Oud & Rose is Swiss Arabian\'s celebration of the two most iconic ingredients in Middle Eastern perfumery. The delicate bloom of rose meets the earthy depth of oud in a perfectly balanced feminine fragrance that speaks of timeless elegance.',
    images: [
      { url: img(11), alt: 'Oud & Rose', isPrimary: true },
      { url: imgSecondary(11), alt: 'Oud & Rose secondary', isPrimary: false },
    ],
    variants: [
      { id: '12-50', sizeMl: 50, concentration: 'EDP', price: 390, stock: 12 },
    ],
    rating: 4.6,
    reviewCount: 143,
    tags: ['oud', 'rose', 'floral', 'feminine', 'elegant', 'evening'],
  },
  {
    id: '13',
    slug: 'warda-al-hanane',
    name: 'Warda Al Hanane',
    brand: 'Rasasi',
    category: 'Niche',
    gender: 'women',
    fragranceFamily: 'Floral Woody',
    concentration: 'EDP',
    topNotes: ['Peach', 'Blackcurrant', 'Bergamot'],
    heartNotes: ['Rose', 'Peony', 'Freesia'],
    baseNotes: ['Cedarwood', 'Musk', 'Amber'],
    description:
      'Warda Al Hanane — "Flower of Tenderness" — is a soft feminine floral from Rasasi. Juicy peach and blackcurrant open to a beautiful bouquet of rose and peony, grounded by warm cedar and amber. A gentle, everyday fragrance.',
    images: [
      { url: img(12), alt: 'Warda Al Hanane', isPrimary: true },
      { url: imgSecondary(12), alt: 'Warda Al Hanane secondary', isPrimary: false },
    ],
    variants: [
      { id: '13-50', sizeMl: 50, concentration: 'EDP', price: 210, stock: 22 },
    ],
    rating: 4.4,
    reviewCount: 76,
    tags: ['floral', 'rose', 'feminine', 'fresh', 'daily', 'light'],
  },
  {
    id: '14',
    slug: 'musk-al-tahara',
    name: 'Musk Al Tahara',
    brand: 'Lattafa',
    category: 'Attar & Oud',
    gender: 'unisex',
    fragranceFamily: 'Musk',
    concentration: 'Attar',
    topNotes: ['White Musk'],
    heartNotes: ['Powder', 'Sandalwood'],
    baseNotes: ['Amber', 'Vanilla'],
    description:
      'Musk Al Tahara is a pure and clean musk attar from Lattafa, beloved for its simplicity and versatility. This unisex scent is whisper-soft and radiant, layering beautifully with any other fragrance or worn alone for a subtle, fresh presence.',
    images: [
      { url: img(13), alt: 'Musk Al Tahara', isPrimary: true },
      { url: imgSecondary(13), alt: 'Musk Al Tahara secondary', isPrimary: false },
    ],
    variants: [
      { id: '14-6ml', sizeMl: 6, concentration: 'Attar', price: 75, stock: 60 },
    ],
    rating: 4.5,
    reviewCount: 320,
    tags: ['musk', 'clean', 'fresh', 'light', 'unisex', 'daily', 'subtle'],
  },
  {
    id: '15',
    slug: 'tres-nuit',
    name: 'Tres Nuit',
    brand: 'Armaf',
    category: 'Inspired Collections',
    gender: 'men',
    fragranceFamily: 'Aromatic Fougere',
    concentration: 'EDP',
    topNotes: ['Lemon', 'Bergamot', 'Grapefruit'],
    heartNotes: ['Lavender', 'Jasmine', 'Geranium'],
    baseNotes: ['Vetiver', 'Musk', 'Cedarwood'],
    description:
      'Tres Nuit is a fresh and invigorating men\'s fragrance from Armaf, inspired by a legendary European classic. Citrus freshness leads to a lavender and jasmine heart, finishing with a clean vetiver and cedarwood base. An everyday essential.',
    images: [
      { url: img(14), alt: 'Tres Nuit', isPrimary: true },
      { url: imgSecondary(14), alt: 'Tres Nuit secondary', isPrimary: false },
    ],
    variants: [
      { id: '15-100', sizeMl: 100, concentration: 'EDP', price: 109, stock: 38 },
    ],
    rating: 4.3,
    reviewCount: 184,
    tags: ['fresh', 'aromatic', 'citrus', 'masculine', 'daily', 'office', 'light'],
  },
  {
    id: '16',
    slug: 'oud-bouquet',
    name: 'Oud Bouquet',
    brand: 'Ajmal',
    category: 'Gift Sets',
    gender: 'unisex',
    fragranceFamily: 'Oriental Floral',
    concentration: 'EDP',
    topNotes: ['Saffron', 'Rose', 'Bergamot'],
    heartNotes: ['Oud', 'Jasmine', 'Amber'],
    baseNotes: ['Sandalwood', 'Musk', 'Vanilla', 'Patchouli'],
    description:
      'The Oud Bouquet Gift Set from Ajmal is the ultimate luxury gift for fragrance lovers. This beautifully presented collection features three complementary oud-centered fragrances, making it ideal for Eid, weddings, or any special occasion.',
    images: [
      { url: img(15), alt: 'Oud Bouquet', isPrimary: true },
      { url: imgSecondary(15), alt: 'Oud Bouquet secondary', isPrimary: false },
    ],
    variants: [
      { id: '16-set', sizeMl: 0, concentration: 'EDP', price: 520, stock: 8 },
    ],
    rating: 4.9,
    reviewCount: 67,
    tags: ['oud', 'gift', 'set', 'special-occasion', 'luxurious', 'unisex', 'bold'],
    isFeatured: true,
  },
  {
    id: '17',
    slug: 'black-oud',
    name: 'Black Oud',
    brand: 'Swiss Arabian',
    category: 'Attar & Oud',
    gender: 'men',
    fragranceFamily: 'Woody Oud',
    concentration: 'EDP',
    topNotes: ['Black Pepper', 'Bergamot', 'Cardamom'],
    heartNotes: ['Dark Oud', 'Smoky Notes', 'Leather'],
    baseNotes: ['Labdanum', 'Amber', 'Vetiver'],
    description:
      'Black Oud is Swiss Arabian\'s darkest and most powerful oud fragrance. Intensely smoky and leathery, with a heart of the finest dark oud, this is a fragrance for those who want to make a powerful, unforgettable statement.',
    images: [
      { url: img(16), alt: 'Black Oud', isPrimary: true },
      { url: imgSecondary(16), alt: 'Black Oud secondary', isPrimary: false },
    ],
    variants: [
      { id: '17-50', sizeMl: 50, concentration: 'EDP', price: 480, stock: 14 },
    ],
    rating: 4.7,
    reviewCount: 231,
    tags: ['oud', 'dark', 'smoky', 'masculine', 'evening', 'commanding', 'strong'],
    isBestseller: true,
  },
  {
    id: '18',
    slug: 'floral-breeze',
    name: 'Floral Breeze',
    brand: 'Rasasi',
    category: 'Premium Signature',
    gender: 'women',
    fragranceFamily: 'Fresh Floral',
    concentration: 'EDT',
    topNotes: ['Bergamot', 'Lemon', 'Pink Pepper'],
    heartNotes: ['Peony', 'Rose', 'Magnolia'],
    baseNotes: ['Musk', 'Cedarwood', 'Amber'],
    description:
      'Floral Breeze is Rasasi\'s lightest and most joyful feminine creation. A burst of citrus freshness gives way to a bouquet of peony, rose, and magnolia, carried on a clean musk breeze. Perfect for warm UAE mornings and casual days.',
    images: [
      { url: img(17), alt: 'Floral Breeze', isPrimary: true },
      { url: imgSecondary(17), alt: 'Floral Breeze secondary', isPrimary: false },
    ],
    variants: [
      { id: '18-50', sizeMl: 50, concentration: 'EDT', price: 189, stock: 28 },
      { id: '18-100', sizeMl: 100, concentration: 'EDT', price: 249, stock: 20 },
    ],
    rating: 4.3,
    reviewCount: 112,
    tags: ['fresh', 'floral', 'feminine', 'light', 'daily', 'office', 'energetic'],
    isNewArrival: true,
  },
  {
    id: '19',
    slug: 'riwayat-el-oud',
    name: 'Riwayat El Oud',
    brand: 'Rasasi',
    category: 'Attar & Oud',
    gender: 'unisex',
    fragranceFamily: 'Oriental Oud',
    concentration: 'EDP',
    topNotes: ['Saffron', 'Bergamot'],
    heartNotes: ['Oud', 'Rose', 'Incense'],
    baseNotes: ['Amber', 'Sandalwood', 'Musk'],
    description:
      'Riwayat El Oud — "Story of Oud" — is a rich oriental fragrance from Rasasi that tells the ancient tale of Arabian oud perfumery. Saffron and rose frame the noble oud at its heart, while amber and sandalwood provide a warm, enduring finish.',
    images: [
      { url: img(18), alt: 'Riwayat El Oud', isPrimary: true },
      { url: imgSecondary(18), alt: 'Riwayat El Oud secondary', isPrimary: false },
    ],
    variants: [
      { id: '19-50', sizeMl: 50, concentration: 'EDP', price: 340, stock: 16 },
    ],
    rating: 4.5,
    reviewCount: 98,
    tags: ['oud', 'oriental', 'saffron', 'rose', 'unisex', 'evening'],
  },
  {
    id: '20',
    slug: 'opulent-shaik',
    name: 'Opulent Shaik',
    brand: 'Armaf',
    category: 'Niche',
    gender: 'men',
    fragranceFamily: 'Oriental Spicy',
    concentration: 'EDP',
    topNotes: ['Bergamot', 'Neroli', 'Saffron'],
    heartNotes: ['Oud', 'Amber', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Musk', 'Vanilla', 'Labdanum'],
    description:
      'Opulent Shaik is Armaf\'s most luxurious and exclusive creation. An opulent oriental with saffron and neroli opening to a commanding oud and amber heart. Rich, bold, and unmistakably regal — for those who accept nothing less than the finest.',
    images: [
      { url: img(19), alt: 'Opulent Shaik', isPrimary: true },
      { url: imgSecondary(19), alt: 'Opulent Shaik secondary', isPrimary: false },
    ],
    variants: [
      { id: '20-100', sizeMl: 100, concentration: 'EDP', price: 599, stock: 9 },
    ],
    rating: 4.8,
    reviewCount: 143,
    tags: ['oriental', 'oud', 'saffron', 'masculine', 'evening', 'commanding', 'bold', 'luxurious'],
    isFeatured: true,
  },
  {
    id: '21',
    slug: 'night-dreams',
    name: 'Night Dreams',
    brand: 'Lattafa',
    category: 'Inspired Collections',
    gender: 'women',
    fragranceFamily: 'Floral Gourmand',
    concentration: 'EDP',
    topNotes: ['Bergamot', 'Peach', 'Raspberry'],
    heartNotes: ['Rose', 'Jasmine', 'Heliotrope'],
    baseNotes: ['Vanilla', 'Sandalwood', 'Musk'],
    description:
      'Night Dreams is a dreamy, romantic feminine fragrance from Lattafa. Sweet peach and raspberry mingle with delicate florals, settling into a warm vanilla and sandalwood embrace perfect for evening occasions or romantic nights.',
    images: [
      { url: img(0), alt: 'Night Dreams', isPrimary: true },
      { url: imgSecondary(0), alt: 'Night Dreams secondary', isPrimary: false },
    ],
    variants: [
      { id: '21-100', sizeMl: 100, concentration: 'EDP', price: 99, stock: 42 },
    ],
    rating: 4.1,
    reviewCount: 178,
    tags: ['floral', 'gourmand', 'sweet', 'feminine', 'evening', 'romantic'],
  },
  {
    id: '22',
    slug: 'jannet-el-firdaus',
    name: 'Jannet El Firdaus',
    brand: 'Swiss Arabian',
    category: 'Attar & Oud',
    gender: 'unisex',
    fragranceFamily: 'Musk Floral',
    concentration: 'Attar',
    topNotes: ['White Musk', 'Rose'],
    heartNotes: ['Sandalwood', 'Amber'],
    baseNotes: ['Musk', 'Powder'],
    description:
      'Jannet El Firdaus — "Garden of Paradise" — is one of Swiss Arabian\'s most beloved attars. This pure oil fragrance is clean, powdery, and heavenly, with white musk and rose over a soft sandalwood base. A classic of Arabian perfumery tradition.',
    images: [
      { url: img(1), alt: 'Jannet El Firdaus', isPrimary: true },
      { url: imgSecondary(1), alt: 'Jannet El Firdaus secondary', isPrimary: false },
    ],
    variants: [
      { id: '22-6ml', sizeMl: 6, concentration: 'Attar', price: 65, stock: 80 },
    ],
    rating: 4.6,
    reviewCount: 445,
    tags: ['musk', 'floral', 'clean', 'light', 'unisex', 'daily', 'subtle'],
  },
  {
    id: '23',
    slug: 'ajmal-cedarwood',
    name: 'Ajmal Cedarwood',
    brand: 'Ajmal',
    category: 'Premium Signature',
    gender: 'men',
    fragranceFamily: 'Woody Fougere',
    concentration: 'EDP',
    topNotes: ['Bergamot', 'Lemon', 'Cardamom'],
    heartNotes: ['Cedarwood', 'Lavender', 'Geranium'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Musk'],
    description:
      'Ajmal Cedarwood is a refined masculine fragrance celebrating the timeless elegance of cedarwood. Bright citrus and aromatic lavender lead to a rich cedar heart, supported by deep sandalwood and vetiver. A sophisticated, all-occasion masculine.',
    images: [
      { url: img(2), alt: 'Ajmal Cedarwood', isPrimary: true },
      { url: imgSecondary(2), alt: 'Ajmal Cedarwood secondary', isPrimary: false },
    ],
    variants: [
      { id: '23-75', sizeMl: 75, concentration: 'EDP', price: 229, stock: 20 },
    ],
    rating: 4.4,
    reviewCount: 89,
    tags: ['woody', 'cedar', 'fresh', 'masculine', 'office', 'daily', 'moderate'],
    isNewArrival: true,
  },
  {
    id: '24',
    slug: 'amber-citrus',
    name: 'Amber Citrus',
    brand: 'Rasasi',
    category: 'Niche',
    gender: 'unisex',
    fragranceFamily: 'Citrus Amber',
    concentration: 'EDP',
    topNotes: ['Bergamot', 'Grapefruit', 'Orange'],
    heartNotes: ['Amber', 'Jasmine', 'Neroli'],
    baseNotes: ['Musk', 'Sandalwood', 'Benzoin'],
    description:
      'Amber Citrus is a beautifully balanced unisex fragrance from Rasasi, bridging the gap between fresh and warm. Sparkling citrus fruits transition smoothly into glowing amber, anchored by creamy sandalwood and musk. Perfect for all seasons.',
    images: [
      { url: img(3), alt: 'Amber Citrus', isPrimary: true },
      { url: imgSecondary(3), alt: 'Amber Citrus secondary', isPrimary: false },
    ],
    variants: [
      { id: '24-50', sizeMl: 50, concentration: 'EDP', price: 245, stock: 18 },
    ],
    rating: 4.5,
    reviewCount: 102,
    tags: ['citrus', 'amber', 'fresh', 'warm', 'unisex', 'all-day'],
  },
  {
    id: '25',
    slug: 'velvet-rose',
    name: 'Velvet Rose',
    brand: 'Armaf',
    category: 'Premium Signature',
    gender: 'women',
    fragranceFamily: 'Floral Woody',
    concentration: 'EDP',
    topNotes: ['Rose', 'Peach', 'Bergamot'],
    heartNotes: ['Damask Rose', 'Iris', 'Violet'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    description:
      'Velvet Rose is Armaf\'s most luxurious feminine creation, a sumptuous rose fragrance with a velvety soft character. The finest Damask rose is supported by iris and violet, resting on a bed of warm sandalwood and amber. Pure feminine elegance.',
    images: [
      { url: img(4), alt: 'Velvet Rose', isPrimary: true },
      { url: imgSecondary(4), alt: 'Velvet Rose secondary', isPrimary: false },
    ],
    variants: [
      { id: '25-50', sizeMl: 50, concentration: 'EDP', price: 149, salePrice: 149, stock: 25 },
      { id: '25-100', sizeMl: 100, concentration: 'EDP', price: 179, salePrice: 149, stock: 18 },
    ],
    rating: 4.4,
    reviewCount: 134,
    tags: ['rose', 'floral', 'feminine', 'romantic', 'elegant', 'special-occasion'],
    isOnSale: true,
  },
  {
    id: '26',
    slug: 'oud-mubakhar',
    name: 'Oud Mubakhar',
    brand: 'Lattafa',
    category: 'Bakhoor',
    gender: 'unisex',
    fragranceFamily: 'Oud Incense',
    concentration: 'Bakhoor',
    topNotes: ['Oud', 'Rose'],
    heartNotes: ['Sandalwood', 'Amber'],
    baseNotes: ['Musk', 'Incense'],
    description:
      'Oud Mubakhar by Lattafa is a premium bakhoor blend bringing the sacred smoke of Arabian incense to your home. Premium oud chips layered with rose and sandalwood create a warm, welcoming atmosphere for family and guests.',
    images: [
      { url: img(5), alt: 'Oud Mubakhar', isPrimary: true },
      { url: imgSecondary(5), alt: 'Oud Mubakhar secondary', isPrimary: false },
    ],
    variants: [
      { id: '26-100g', sizeMl: 0, concentration: 'Bakhoor', price: 195, stock: 35 },
    ],
    rating: 4.6,
    reviewCount: 78,
    tags: ['bakhoor', 'oud', 'incense', 'home', 'traditional'],
  },
  {
    id: '27',
    slug: 'cloud-9',
    name: 'Cloud 9',
    brand: 'Armaf',
    category: 'Inspired Collections',
    gender: 'unisex',
    fragranceFamily: 'Aquatic Fresh',
    concentration: 'EDT',
    topNotes: ['Bergamot', 'Lemon', 'Sea Notes'],
    heartNotes: ['Jasmine', 'Violet', 'Cyclamen'],
    baseNotes: ['Musk', 'Cedarwood', 'Amberwood'],
    description:
      'Cloud 9 is a dreamy, uplifting unisex fragrance from Armaf, as fresh and free as a clear sky. Aquatic notes and citrus create a light, airy opening, while soft florals and woody musk provide a clean, comforting base. Perfect for daily wear.',
    images: [
      { url: img(6), alt: 'Cloud 9', isPrimary: true },
      { url: imgSecondary(6), alt: 'Cloud 9 secondary', isPrimary: false },
    ],
    variants: [
      { id: '27-100', sizeMl: 100, concentration: 'EDT', price: 139, stock: 30 },
    ],
    rating: 4.2,
    reviewCount: 91,
    tags: ['fresh', 'aquatic', 'clean', 'light', 'unisex', 'daily', 'energetic'],
    isNewArrival: true,
  },
  {
    id: '28',
    slug: 'khaltat-night',
    name: 'Khaltat Night',
    brand: 'Lattafa',
    category: 'Attar & Oud',
    gender: 'men',
    fragranceFamily: 'Oriental Spicy',
    concentration: 'EDP',
    topNotes: ['Black Pepper', 'Saffron', 'Cardamom'],
    heartNotes: ['Oud', 'Amber', 'Leather'],
    baseNotes: ['Sandalwood', 'Musk', 'Labdanum'],
    description:
      'Khaltat Night is Lattafa\'s most seductive masculine creation, designed for evenings and special occasions. Dark and spicy saffron meets rich oud and leather in a composition that is both masculine and deeply sensual. A night-time essential.',
    images: [
      { url: img(7), alt: 'Khaltat Night', isPrimary: true },
      { url: imgSecondary(7), alt: 'Khaltat Night secondary', isPrimary: false },
    ],
    variants: [
      { id: '28-50', sizeMl: 50, concentration: 'EDP', price: 249, salePrice: 249, stock: 20 },
      { id: '28-100', sizeMl: 100, concentration: 'EDP', price: 299, salePrice: 249, stock: 14 },
    ],
    rating: 4.7,
    reviewCount: 267,
    tags: ['oud', 'spicy', 'dark', 'masculine', 'evening', 'mysterious', 'commanding'],
    isBestseller: true,
    isOnSale: true,
  },
  {
    id: '29',
    slug: 'dehn-el-oud',
    name: 'Dehn El Oud',
    brand: 'Swiss Arabian',
    category: 'Attar & Oud',
    gender: 'unisex',
    fragranceFamily: 'Pure Oud',
    concentration: 'Parfum',
    topNotes: ['Pure Oud'],
    heartNotes: ['Agarwood', 'Smoke'],
    baseNotes: ['Labdanum', 'Amber'],
    description:
      'Dehn El Oud represents the purest expression of Arabian oud perfumery. Sourced from the finest agarwood forests, this pure oud parfum oil is smoky, woody, and profoundly complex. A single drop on the wrist is enough to last an entire day.',
    images: [
      { url: img(8), alt: 'Dehn El Oud', isPrimary: true },
      { url: imgSecondary(8), alt: 'Dehn El Oud secondary', isPrimary: false },
    ],
    variants: [
      { id: '29-3ml', sizeMl: 3, concentration: 'Parfum', price: 750, stock: 6 },
    ],
    rating: 4.9,
    reviewCount: 89,
    tags: ['oud', 'pure', 'dark', 'smoky', 'unisex', 'commanding', 'bold', 'luxurious'],
    isFeatured: true,
  },
  {
    id: '30',
    slug: 'miris-discovery-set',
    name: 'Miris Discovery Set',
    brand: 'Ajmal',
    category: 'Gift Sets',
    gender: 'unisex',
    fragranceFamily: 'Mixed',
    concentration: 'EDP',
    topNotes: ['Various'],
    heartNotes: ['Various'],
    baseNotes: ['Various'],
    description:
      'The Miris Discovery Set by Ajmal is the perfect introduction to the world of Ajmal fragrances. Featuring six 10ml travel-size bottles of their most beloved creations, this set allows you to explore different scent families and find your perfect match.',
    images: [
      { url: img(9), alt: 'Miris Discovery Set', isPrimary: true },
      { url: imgSecondary(9), alt: 'Miris Discovery Set secondary', isPrimary: false },
    ],
    variants: [
      { id: '30-set', sizeMl: 0, concentration: 'EDP', price: 420, stock: 12 },
    ],
    rating: 4.8,
    reviewCount: 56,
    tags: ['gift', 'set', 'discovery', 'unisex', 'travel', 'mixed'],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.isOnSale);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, limit);
}
