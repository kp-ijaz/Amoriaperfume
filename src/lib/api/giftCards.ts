import { ApiResponse } from './types';
import { apiFetch } from './giftCardsFetch';

export interface GiftCardSettings {
  minGiftCardAmount: number;
}

export interface GiftCardValidateResult {
  valid: boolean;
  code?: string;
  balance?: number;
  currency?: string;
  message?: string;
}

export interface GiftCardQuoteResult {
  valid: boolean;
  code: string;
  balance: number;
  applicableAmount: number;
  balanceAfter: number;
  orderTotalBeforeGiftCard: number;
}

export interface GiftCardPurchaseResult {
  giftCard: { _id: string; code: string; balance: number; initialAmount: number };
  code: string;
  paymentRef: string;
}

export async function apiGetGiftCardSettings(): Promise<ApiResponse<GiftCardSettings>> {
  return apiFetch('/api/gift-cards/settings');
}

export async function apiValidateGiftCard(code: string): Promise<ApiResponse<GiftCardValidateResult>> {
  return apiFetch('/api/gift-cards/validate', {
    method: 'POST',
    body: JSON.stringify({ code: code.trim() }),
  });
}

export async function apiQuoteGiftCard(data: {
  code: string;
  subtotal: number;
  shippingCharge: number;
  couponCode?: string;
}): Promise<ApiResponse<GiftCardQuoteResult>> {
  return apiFetch('/api/gift-cards/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPurchaseGiftCard(data: {
  amount: number;
  customerDetails: { name: string; email: string; mobile: string };
  recipientEmail?: string;
  paymentMethod: 'ONLINE';
  stripePaymentIntentId: string;
}): Promise<ApiResponse<GiftCardPurchaseResult>> {
  return apiFetch('/api/gift-cards/purchase', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
