import {
  ApiGiftSetItem,
  ApiGiftSetItemProduct,
  ApiGiftSetOccasion,
} from '@/lib/api/types';
import {
  bundleItemsToCartLines,
  isBundleInStock,
  resolveBundleItemDetails,
} from '@/lib/bundle/bundleItemDetails';

const OCCASION_LABELS: Record<ApiGiftSetOccasion, string> = {
  general: 'Gift Set',
  eid: 'Eid Gifts',
  wedding: 'Weddings',
  birthday: 'Birthdays',
  corporate: 'Corporate',
};

export function giftSetOccasionLabel(occasion?: ApiGiftSetOccasion) {
  return OCCASION_LABELS[occasion ?? 'general'];
}

export function isPopulatedGiftSetProduct(
  value: string | ApiGiftSetItemProduct
): value is ApiGiftSetItemProduct {
  return typeof value === 'object' && value !== null && '_id' in value;
}

export function resolveGiftSetItemDetails(item: ApiGiftSetItem) {
  return resolveBundleItemDetails(item);
}

export function giftSetItemsToCartLines(items: ApiGiftSetItem[]) {
  return bundleItemsToCartLines(items);
}

export function isGiftSetInStock(items: ApiGiftSetItem[]) {
  return isBundleInStock(items);
}
