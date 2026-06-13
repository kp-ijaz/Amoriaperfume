import { Product, ProductVariant } from '@/types/product';

export interface OfferPopupConfig {
  enabled: boolean;
  discountPercent: number;
  startsAt?: string;
  endsAt?: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  displayDelayMs?: number;
  productIds: string[];
  products?: Product[];
}

export interface EffectiveVariantPricing {
  price: number;
  salePrice?: number;
  discountPercent: number | null;
  isOfferApplied: boolean;
}

function round2(value: number): number {
  return parseFloat(Number(value).toFixed(2));
}

function reconstructMrp(variant: ProductVariant): number {
  const catalogPrice = variant.salePrice ?? variant.price;
  const original = variant.price;
  if (variant.salePrice && variant.salePrice < original) {
    return original;
  }
  return catalogPrice;
}

export function isOfferActive(config: OfferPopupConfig | null | undefined, now = new Date()): boolean {
  if (!config?.enabled) return false;
  if (!config.productIds?.length) return false;
  if (config.startsAt && new Date(config.startsAt) > now) return false;
  if (config.endsAt && new Date(config.endsAt) <= now) return false;
  return true;
}

export function isProductInOffer(productId: string, config: OfferPopupConfig | null | undefined): boolean {
  if (!config?.productIds?.length) return false;
  return config.productIds.includes(productId);
}

export function getEffectiveVariantPricing(
  variant: ProductVariant,
  productId: string,
  config: OfferPopupConfig | null | undefined
): EffectiveVariantPricing {
  const catalogPrice = variant.salePrice ?? variant.price;
  const mrp = reconstructMrp(variant);

  if (!isOfferActive(config) || !isProductInOffer(productId, config)) {
    const hasCatalogSale = variant.salePrice != null && variant.salePrice < variant.price;
    const discountPercent =
      hasCatalogSale && variant.price > 0
        ? Math.round(((variant.price - catalogPrice) / variant.price) * 100)
        : null;
    return {
      price: variant.price,
      salePrice: variant.salePrice,
      discountPercent,
      isOfferApplied: false,
    };
  }

  const popupPrice = round2(mrp * (1 - (config!.discountPercent ?? 0) / 100));
  const effectivePrice = Math.min(catalogPrice, popupPrice);

  if (effectivePrice >= mrp) {
    return {
      price: mrp,
      salePrice: undefined,
      discountPercent: null,
      isOfferApplied: false,
    };
  }

  return {
    price: mrp,
    salePrice: effectivePrice,
    discountPercent: Math.round(((mrp - effectivePrice) / mrp) * 100),
    isOfferApplied: effectivePrice === popupPrice && popupPrice < catalogPrice,
  };
}

export function getOfferAdjustedVariant(
  variant: ProductVariant,
  productId: string,
  config: OfferPopupConfig | null | undefined
): ProductVariant {
  const pricing = getEffectiveVariantPricing(variant, productId, config);
  return {
    ...variant,
    price: pricing.price,
    salePrice: pricing.salePrice,
  };
}

export function applyOfferPricingToProduct(
  product: Product,
  config: OfferPopupConfig | null | undefined
): Product {
  if (!isOfferActive(config) || !isProductInOffer(product.id, config)) {
    return product;
  }
  return {
    ...product,
    variants: product.variants.map((v) => getOfferAdjustedVariant(v, product.id, config)),
  };
}
