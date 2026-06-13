/** True when an API/checkout message is about coupon or promotion validity. */
export function isPromotionError(message: string | null | undefined): boolean {
  const m = String(message || '').trim().toLowerCase();
  if (!m) return false;
  return (
    m.includes('coupon') ||
    m.includes('promotion') ||
    m.includes('promo code') ||
    m.includes('first order')
  );
}
