import { CartItem, isPackageCartItem } from '@/types/cart';
import { PromotionValidateLineItem } from '@/lib/api/types';
import { getCartLineTotal } from '@/lib/cart/cartPricing';

export function mapCartItemsToPromoLineItems(items: CartItem[]): PromotionValidateLineItem[] {
  return items.map((item) => {
    if (isPackageCartItem(item)) {
      return {
        quantity: item.quantity,
        lineTotal: getCartLineTotal(item),
      };
    }

    const price = item.variant.salePrice ?? item.variant.price;
    return {
      productId: item.product.id,
      categoryId: item.product.categoryId ?? null,
      quantity: item.quantity,
      lineTotal: price * item.quantity,
    };
  });
}
