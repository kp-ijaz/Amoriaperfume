import { Product, ProductVariant } from './product';

export type PackageType = 'bundle' | 'gift_set';

export interface ProductCartItem {
  kind: 'product';
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface PackageCartItem {
  kind: 'package';
  packageType: PackageType;
  packageId: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  mrp?: number;
  quantity: number;
  includedCount: number;
}

export type CartItem = ProductCartItem | PackageCartItem;

/** @deprecated Use ProductCartItem */
export type LegacyCartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export function isProductCartItem(item: CartItem): item is ProductCartItem {
  return item.kind === 'product';
}

export function isPackageCartItem(item: CartItem): item is PackageCartItem {
  return item.kind === 'package';
}

export interface AppliedCoupon {
  code: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  discountAmount: number;
  freeShipping: boolean;
  label?: string;
}

/** @deprecated Use AppliedCoupon */
export type CouponCode = AppliedCoupon;

export interface AppliedGiftCard {
  code: string;
  balance: number;
}

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  giftCard: AppliedGiftCard | null;
  savedItems: ProductCartItem[];
}
