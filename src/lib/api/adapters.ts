/**
 * Adapters: transform raw API responses into the internal types
 * used throughout the Amoria frontend.
 *
 * API prices are treated as AED values.
 */

import { Product, ProductVariant, ProductImage, Category, Brand, Review } from '@/types/product';
import {
  ApiProduct,
  ApiCategory,
  ApiBrand,
  ApiReview,
  ApiSizeVariant,
  ApiProductVariant,
} from './types';

// ─── Price ────────────────────────────────────────────────────────────────────

export function toAed(value: number): number {
  return parseFloat(Number(value ?? 0).toFixed(2));
}

// ─── Product Variant ──────────────────────────────────────────────────────────

function adaptSizeVariant(
  size: ApiSizeVariant,
  apiVariant: ApiProductVariant,
  concentration: string
): ProductVariant {
  // Parse size: "50 ml" → 50
  const sizeMl = parseInt(size.size, 10) || 0;
  const price = toAed(size.finalPrice);

  // Treat products with discount > 0 as on sale
  const hasDiscount = size.discount > 0;
  const mrpPrice = hasDiscount
    ? parseFloat((price / (1 - size.discount / 100)).toFixed(2))
    : price;

  return {
    id: size._id,
    variantId: apiVariant._id,
    sizeVariantId: size._id,
    sizeMl,
    concentration,
    price: hasDiscount ? mrpPrice : price,
    salePrice: hasDiscount ? price : undefined,
    stock: size.stock,
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function adaptProduct(api: ApiProduct): Product {
  // Flatten all size variants into ProductVariant[]
  const variants: ProductVariant[] = api.variants.flatMap((v) =>
    v.sizeArray.map((size) => adaptSizeVariant(size, v, api.concentration))
  );

  // Images: use variant images if no product-level images
  const productImages = api.images.length > 0 ? api.images : api.thumbnail;
  const images: ProductImage[] = productImages.map((url, i) => ({
    url,
    alt: `${api.name} ${i + 1}`,
    isPrimary: i === 0,
  }));

  // Determine sale/new status
  const lowestPrice = variants.reduce(
    (min, v) => Math.min(min, v.salePrice ?? v.price),
    Infinity
  );
  const highestPrice = variants.reduce(
    (max, v) => Math.max(max, v.price),
    0
  );
  const isOnSale = highestPrice > lowestPrice;

  return {
    id: api._id,
    slug: api.slug || api._id,
    name: api.name,
    brand: api.brand?.name ?? '',
    category: api.category?.name ?? '',
    gender: api.gender,
    fragranceFamily: api.fragranceFamily,
    concentration: api.concentration,
    topNotes: api.fragranceNotes?.topNotes ?? [],
    heartNotes: api.fragranceNotes?.middleNotes ?? [],
    baseNotes: api.fragranceNotes?.baseNotes ?? [],
    description: api.description,
    images,
    variants,
    rating: api.ratings?.avg ?? 0,
    reviewCount: api.ratings?.count ?? 0,
    tags: api.tags ?? [],
    isFeatured: api.featured,
    isNewArrival: false,
    isBestseller: false,
    isOnSale,
  };
}

export function adaptProducts(items: ApiProduct[]): Product[] {
  return items.map(adaptProduct);
}

// ─── Category ────────────────────────────────────────────────────────────────

export function adaptCategory(api: ApiCategory): Category {
  return {
    id: api._id,
    slug: api.slug,
    name: api.name,
    image: api.image,
    description: api.description,
  };
}

export function adaptCategories(items: ApiCategory[]): Category[] {
  return items.map(adaptCategory);
}

// ─── Brand ───────────────────────────────────────────────────────────────────

export function adaptBrand(api: ApiBrand): Brand {
  return {
    id: api._id,
    slug: api.slug,
    name: api.name,
    logo: api.logo,
    description: api.description ?? '',
  };
}

export function adaptBrands(items: ApiBrand[]): Brand[] {
  return items.map(adaptBrand);
}

// ─── Review ──────────────────────────────────────────────────────────────────

export function adaptReview(api: ApiReview): Review {
  return {
    id: api._id,
    productId: api.product?._id ?? '',
    reviewerName: api.user?.name ?? 'Anonymous',
    location: 'UAE',
    rating: api.rating,
    comment: api.comment,
    date: api.createdAt,
    isVerified: api.status === 'approved',
  };
}

export function adaptReviews(items: ApiReview[]): Review[] {
  return items.map(adaptReview);
}
