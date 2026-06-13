import { ApiBundleItem, ApiGiftSetItemProduct } from '@/lib/api/types';
import { Product, ProductVariant } from '@/types/product';

export function isPopulatedBundleProduct(
  value: string | ApiGiftSetItemProduct
): value is ApiGiftSetItemProduct {
  return typeof value === 'object' && value !== null && '_id' in value;
}

export function resolveBundleItemDetails(item: ApiBundleItem) {
  const product = isPopulatedBundleProduct(item.productId) ? item.productId : null;
  const variant = product?.variants?.find((v) => String(v._id) === String(item.variantId));
  const size = variant?.sizeArray?.find((s) => String(s._id) === String(item.sizeVariantId));
  const image = variant?.images?.[0] ?? product?.images?.[0] ?? '';

  return {
    productId: product?._id ?? (typeof item.productId === 'string' ? item.productId : ''),
    name: product?.name ?? 'Included fragrance',
    slug: product?.slug,
    brand: product?.brand?.name,
    variantName: variant?.colorName,
    size: size?.size,
    unitPrice: size?.finalPrice ?? 0,
    lineTotal: (size?.finalPrice ?? 0) * (item.quantity || 1),
    quantity: item.quantity || 1,
    image,
    inStock: Boolean(size && !size.outOfStock && size.stock >= (item.quantity || 1)),
  };
}

export function bundleItemToCartLine(
  item: ApiBundleItem
): { product: Product; variant: ProductVariant; quantity: number } | null {
  const product = isPopulatedBundleProduct(item.productId) ? item.productId : null;
  if (!product) return null;

  const apiVariant = product.variants?.find((v) => String(v._id) === String(item.variantId));
  const size = apiVariant?.sizeArray?.find((s) => String(s._id) === String(item.sizeVariantId));
  if (!apiVariant || !size) return null;

  const sizeMl = parseInt(size.size, 10) || 0;
  const price = Number(size.finalPrice) || 0;
  const hasDiscount = size.discount > 0;
  const mrpPrice = hasDiscount
    ? parseFloat((price / (1 - size.discount / 100)).toFixed(2))
    : price;

  const variant: ProductVariant = {
    id: size._id,
    variantId: apiVariant._id,
    sizeVariantId: size._id,
    sizeMl,
    concentration: '',
    price: hasDiscount ? mrpPrice : price,
    salePrice: hasDiscount ? price : undefined,
    stock: size.stock,
  };

  const images = (product.images ?? []).map((url, i) => ({
    url,
    alt: product.name ?? 'Product',
    isPrimary: i === 0,
  }));

  const cartProduct: Product = {
    id: product._id,
    slug: product.slug ?? product._id,
    name: product.name,
    brand: product.brand?.name ?? '',
    brandSlug: product.brand?.slug,
    category: product.category?.name ?? '',
    categorySlug: product.category?.slug,
    gender: 'unisex',
    concentration: '',
    seasons: [],
    dayNight: 'both',
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    description: '',
    images: images.length ? images : [{ url: '', alt: product.name, isPrimary: true }],
    variants: [variant],
    rating: 0,
    reviewCount: 0,
    tags: [],
  };

  return {
    product: cartProduct,
    variant,
    quantity: Math.max(1, item.quantity || 1),
  };
}

export function bundleItemsToCartLines(items: ApiBundleItem[]) {
  return items
    .map(bundleItemToCartLine)
    .filter((line): line is { product: Product; variant: ProductVariant; quantity: number } => line !== null);
}

export function isBundleInStock(items: ApiBundleItem[]) {
  if (!items.length) return false;
  return items.every((item) => resolveBundleItemDetails(item).inStock);
}
