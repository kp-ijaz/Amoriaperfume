import { Product, ProductVariant } from './product';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'freeshipping';
}

export interface CartState {
  items: CartItem[];
  coupon: CouponCode | null;
  savedItems: CartItem[];
}
