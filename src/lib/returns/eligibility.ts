import { ApiOrder } from '@/lib/api/types';
import { ReturnRequest, isOpenReturnStatus } from '@/lib/api/returns';

export function getOrderStatus(order: ApiOrder): string {
  const raw = order.orderStatus || order.status || '';
  return String(raw).toUpperCase();
}

export function getOrderDeliveryDate(order: ApiOrder): Date | null {
  const history = order.statusHistory || [];
  let latest: Date | null = null;
  for (const entry of history) {
    if (entry.status !== 'DELIVERED') continue;
    const at = entry.updatedAt ? new Date(entry.updatedAt) : null;
    if (!at || Number.isNaN(at.getTime())) continue;
    if (!latest || at > latest) latest = at;
  }
  if (latest) return latest;
  if (getOrderStatus(order) === 'DELIVERED' && order.updatedAt) {
    const fallback = new Date(order.updatedAt);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  return null;
}

export function isWithinReturnWindow(order: ApiOrder, windowDays: number): boolean {
  if (windowDays <= 0) return false;
  if (getOrderStatus(order) !== 'DELIVERED') return false;
  const deliveredAt = getOrderDeliveryDate(order);
  if (!deliveredAt) return true;
  const deadline = new Date(deliveredAt);
  deadline.setDate(deadline.getDate() + windowDays);
  return new Date() <= deadline;
}

export function hasOpenReturnForItem(
  returns: ReturnRequest[],
  orderId: string,
  itemIndex: number
): boolean {
  return returns.some(
    (r) =>
      r.orderId === orderId &&
      r.orderItemIndex === itemIndex &&
      isOpenReturnStatus(r.status)
  );
}

export function isProductEligibleForReturn(
  returnable?: boolean,
  refundable?: boolean
): boolean {
  if (returnable === false && refundable !== true) return false;
  if (refundable === false && returnable !== true) return false;
  return returnable !== false || refundable === true;
}

export function canShowReplacementCta(
  order: ApiOrder,
  itemIndex: number,
  opts: {
    returnPeriodDays: number;
    returns: ReturnRequest[];
    productReturnable?: boolean;
    productRefundable?: boolean;
  }
): boolean {
  if (getOrderStatus(order) !== 'DELIVERED') return false;
  if (!isWithinReturnWindow(order, opts.returnPeriodDays)) return false;
  if (!isProductEligibleForReturn(opts.productReturnable, opts.productRefundable)) return false;
  if (hasOpenReturnForItem(opts.returns, order._id, itemIndex)) return false;
  return true;
}

export function getOpenReturnForItem(
  returns: ReturnRequest[],
  orderId: string,
  itemIndex: number
): ReturnRequest | undefined {
  return returns.find(
    (r) =>
      r.orderId === orderId &&
      r.orderItemIndex === itemIndex &&
      isOpenReturnStatus(r.status)
  );
}

export function canTrackOrder(order: ApiOrder): boolean {
  const status = getOrderStatus(order);
  return !['DELIVERED', 'CANCELLED'].includes(status);
}
