import { Product, ProductVariant } from './product';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
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
  savedItems: CartItem[];
}
