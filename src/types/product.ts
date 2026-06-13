export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  variantId?: string;
  sizeVariantId?: string;
  sizeMl: number;
  concentration: string;
  price: number;
  salePrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug?: string;
  category: string;
  categoryId?: string;
  categorySlug?: string;
  gender: 'men' | 'women' | 'unisex';
  concentration: string;
  seasons: ('summer' | 'winter' | 'autumn' | 'spring')[];
  dayNight: 'day' | 'night' | 'both';
  sillage?: string;
  longevity?: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  freeShipping?: boolean;
  cashOnDelivery?: boolean;
  returnable?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isLimitedOffer?: boolean;
  isBrandInspiration?: boolean;
  inspiredBrand?: string;
  isOnSale?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  productCoverImage?: string | null;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}
