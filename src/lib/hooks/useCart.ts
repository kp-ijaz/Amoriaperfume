'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  saveForLater,
  moveToCart,
} from '@/lib/store/cartSlice';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { calculateVAT } from '@/lib/utils/calculateVAT';
import { Product, ProductVariant } from '@/types/product';
import { CouponCode } from '@/types/cart';

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 25;
const COD_FEE = 10;

interface UseCartOptions {
  shippingChargeOverride?: number | null;
}

export function useCart(options: UseCartOptions = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, coupon, savedItems } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant.salePrice ?? item.variant.price;
    return acc + price * item.quantity;
  }, 0);

  const couponDiscount =
    coupon?.type === 'percentage'
      ? subtotal * coupon.discount
      : 0;

  const afterCoupon = subtotal - couponDiscount;
  const fallbackFreeShipping = coupon?.type === 'freeshipping' || afterCoupon >= FREE_SHIPPING_THRESHOLD;
  const hasExternalShipping = typeof options.shippingChargeOverride === 'number';
  const normalizedExternalShipping = hasExternalShipping
    ? Math.max(0, Number(options.shippingChargeOverride) || 0)
    : 0;
  const freeShipping = hasExternalShipping ? normalizedExternalShipping === 0 : fallbackFreeShipping;
  const shippingCost = hasExternalShipping
    ? normalizedExternalShipping
    : freeShipping
      ? 0
      : items.length > 0
        ? SHIPPING_COST
        : 0;
  const vat = calculateVAT(afterCoupon + shippingCost);
  const total = afterCoupon + shippingCost + vat;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items,
    savedItems,
    coupon,
    subtotal,
    afterCoupon,
    couponDiscount,
    shippingCost,
    vat,
    total,
    itemCount,
    freeShipping,
    formattedSubtotal: formatCurrency(subtotal),
    formattedCouponDiscount: formatCurrency(couponDiscount),
    formattedShipping: freeShipping ? 'Free' : formatCurrency(shippingCost),
    formattedVat: formatCurrency(vat),
    formattedTotal: formatCurrency(total),
    addItem: (product: Product, variant: ProductVariant, quantity?: number) =>
      dispatch(addItem({ product, variant, quantity })),
    removeItem: (productId: string, variantId: string) =>
      dispatch(removeItem({ productId, variantId })),
    updateQuantity: (productId: string, variantId: string, quantity: number) =>
      dispatch(updateQuantity({ productId, variantId, quantity })),
    clearCart: () => dispatch(clearCart()),
    applyCoupon: (c: CouponCode) => dispatch(applyCoupon(c)),
    removeCoupon: () => dispatch(removeCoupon()),
    saveForLater: (productId: string, variantId: string) =>
      dispatch(saveForLater({ productId, variantId })),
    moveToCart: (productId: string, variantId: string) =>
      dispatch(moveToCart({ productId, variantId })),
    COD_FEE,
  };
}
