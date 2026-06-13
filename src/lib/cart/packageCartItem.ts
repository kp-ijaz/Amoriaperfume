import { ApiBundle, ApiGiftSet } from '@/lib/api/types';
import { PackageCartItem } from '@/types/cart';

export function bundleToPackageCartItem(bundle: ApiBundle, quantity = 1): PackageCartItem {
  const image = bundle.images?.[0] ?? bundle.coverImage ?? '';
  return {
    kind: 'package',
    packageType: 'bundle',
    packageId: bundle._id,
    slug: bundle.slug,
    name: bundle.name,
    sku: bundle.sku,
    image,
    price: bundle.bundlePrice,
    mrp: bundle.mrp,
    quantity,
    includedCount: bundle.items?.length ?? 0,
  };
}

export function giftSetToPackageCartItem(giftSet: ApiGiftSet, quantity = 1): PackageCartItem {
  const image = giftSet.images?.[0] ?? giftSet.coverImage ?? '';
  return {
    kind: 'package',
    packageType: 'gift_set',
    packageId: giftSet._id,
    slug: giftSet.slug,
    name: giftSet.name,
    sku: giftSet.sku,
    image,
    price: giftSet.giftSetPrice,
    mrp: giftSet.mrp,
    quantity,
    includedCount: giftSet.items?.length ?? 0,
  };
}

export function packageCartKey(packageType: string, packageId: string) {
  return `${packageType}:${packageId}`;
}
