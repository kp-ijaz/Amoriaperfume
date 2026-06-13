import { CartItem, isPackageCartItem, isProductCartItem } from '@/types/cart';

export type OrderLineItemPayload =
  | {
      productId: string;
      variantId?: string;
      sizeVariantId?: string;
      quantity: number;
    }
  | {
      packageType: 'bundle' | 'gift_set';
      packageId: string;
      quantity: number;
    };

function pickObjectId(...candidates: (string | undefined)[]) {
  for (const value of candidates) {
    const id = String(value ?? '').trim();
    if (/^[a-f0-9]{24}$/i.test(id)) return id;
  }
  return undefined;
}

export function mapCartItemsToOrderPayload(items: CartItem[]): OrderLineItemPayload[] {
  return items.map((item) => {
    if (isPackageCartItem(item)) {
      return {
        packageType: item.packageType,
        packageId: item.packageId,
        quantity: item.quantity,
      };
    }

    const row: Extract<OrderLineItemPayload, { productId: string }> = {
      productId: item.product.id,
      quantity: item.quantity,
    };
    const variantId = pickObjectId(item.variant.variantId, item.variant.id);
    const sizeVariantId = pickObjectId(item.variant.sizeVariantId, item.variant.id);
    if (variantId) row.variantId = variantId;
    if (sizeVariantId) row.sizeVariantId = sizeVariantId;
    return row;
  });
}

export function cartItemReactKey(item: CartItem): string {
  if (isPackageCartItem(item)) {
    return `package:${item.packageType}:${item.packageId}`;
  }
  return `product:${item.product.id}:${item.variant.id}`;
}
