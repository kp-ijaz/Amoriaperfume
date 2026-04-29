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
  category: string;
  gender: 'men' | 'women' | 'unisex';
  fragranceFamily: string;
  concentration: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
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
