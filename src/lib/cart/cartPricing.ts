import { CartItem, isPackageCartItem, isProductCartItem } from '@/types/cart';

export function getCartLineUnitPrice(item: CartItem): number {
  if (isPackageCartItem(item)) return item.price;
  return item.variant.salePrice ?? item.variant.price;
}

export function getCartLineTotal(item: CartItem): number {
  return getCartLineUnitPrice(item) * item.quantity;
}
