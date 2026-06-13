'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import {
  addItem,
  addPackageItem,
  removeItem,
  removePackageItem,
  updateQuantity,
  updatePackageQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  applyGiftCard,
  removeGiftCard,
  saveForLater,
  moveToCart,
} from '@/lib/store/cartSlice';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { computeTaxBreakdown } from '@/lib/utils/calculateVAT';
import { usePlatformTax } from '@/lib/hooks/usePlatformTax';
import { Product, ProductVariant } from '@/types/product';
import { AppliedCoupon, AppliedGiftCard, PackageCartItem } from '@/types/cart';
import { useOfferPopup } from '@/lib/context/OfferPopupContext';
import { getOfferAdjustedVariant } from '@/lib/pricing/offerPopupPricing';
import { getCartLineTotal } from '@/lib/cart/cartPricing';

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 25;
const COD_FEE = 10;

interface UseCartOptions {
  shippingChargeOverride?: number | null;
}

export function useCart(options: UseCartOptions = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, coupon, giftCard, savedItems } = useSelector((state: RootState) => state.cart);
  const taxSettings = usePlatformTax();
  const { config: offerConfig } = useOfferPopup();

  const subtotal = items.reduce((acc, item) => acc + getCartLineTotal(item), 0);

  const couponDiscount = coupon?.discountAmount ?? 0;

  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const fallbackFreeShipping =
    coupon?.freeShipping === true || afterCoupon >= FREE_SHIPPING_THRESHOLD;
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

  const taxBreakdown = computeTaxBreakdown(afterCoupon + shippingCost, taxSettings);
  const vat = taxBreakdown.tax;
  const totalBeforeGiftCard = taxBreakdown.totalAmount;
  const giftCardAppliedAmount = giftCard
    ? Math.min(giftCard.balance, Math.max(0, totalBeforeGiftCard))
    : 0;
  const total = Math.max(0, totalBeforeGiftCard - giftCardAppliedAmount);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items,
    savedItems,
    coupon,
    giftCard,
    subtotal,
    afterCoupon,
    couponDiscount,
    shippingCost,
    vat,
    taxSettings,
    taxInclusive: taxSettings.taxInclusive,
    taxPercent: taxSettings.taxPercent,
    totalBeforeGiftCard,
    giftCardAppliedAmount,
    total,
    itemCount,
    freeShipping,
    formattedSubtotal: formatCurrency(subtotal),
    formattedCouponDiscount: formatCurrency(couponDiscount),
    formattedGiftCardAmount: formatCurrency(giftCardAppliedAmount),
    formattedShipping: freeShipping ? 'Free' : formatCurrency(shippingCost),
    formattedVat: formatCurrency(vat),
    formattedTotal: formatCurrency(total),
    addItem: (product: Product, variant: ProductVariant, quantity?: number) => {
      const adjustedVariant = getOfferAdjustedVariant(variant, product.id, offerConfig);
      dispatch(addItem({ product, variant: adjustedVariant, quantity }));
    },
    addPackageItem: (item: PackageCartItem, quantity?: number) => {
      dispatch(addPackageItem({ item, quantity }));
    },
    removeItem: (productId: string, variantId: string) =>
      dispatch(removeItem({ productId, variantId })),
    removePackageItem: (packageType: PackageCartItem['packageType'], packageId: string) =>
      dispatch(removePackageItem({ packageType, packageId })),
    updateQuantity: (productId: string, variantId: string, quantity: number) =>
      dispatch(updateQuantity({ productId, variantId, quantity })),
    updatePackageQuantity: (
      packageType: PackageCartItem['packageType'],
      packageId: string,
      quantity: number
    ) => dispatch(updatePackageQuantity({ packageType, packageId, quantity })),
    clearCart: () => dispatch(clearCart()),
    applyCoupon: (c: AppliedCoupon) => dispatch(applyCoupon(c)),
    removeCoupon: () => dispatch(removeCoupon()),
    applyGiftCard: (c: AppliedGiftCard) => dispatch(applyGiftCard(c)),
    removeGiftCard: () => dispatch(removeGiftCard()),
    saveForLater: (productId: string, variantId: string) =>
      dispatch(saveForLater({ productId, variantId })),
    moveToCart: (productId: string, variantId: string) =>
      dispatch(moveToCart({ productId, variantId })),
    COD_FEE,
  };
}
