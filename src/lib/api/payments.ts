import { ApiResponse } from './types';
import { paymentFetch } from './paymentsFetch';

export interface StripeConfig {
  publishableKey: string;
}

export interface StripeIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  amountAed: number;
  pricing?: {
    totalAmount: number;
    tax: number;
    shippingCharge: number;
    discount: number;
  };
}

export interface OrderStripeIntentPayload {
  kind: 'order';
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  customerDetails: { name: string; email: string; mobile?: string };
  shippingAddress?: {
    fullAddress: string;
    city: string;
    state: string;
    pincode?: string;
    country: string;
  };
  pickupDetails?: {
    storeName?: string;
    storeAddress?: string;
    pickupSlot?: string;
  };
  couponCode?: string;
  giftCardCode?: string;
  items: {
    productId: string;
    variantId?: string;
    sizeVariantId?: string;
    quantity: number;
  }[];
}

export interface GiftCardStripeIntentPayload {
  kind: 'gift_card';
  amount: number;
  customerDetails: { name: string; email: string; mobile: string };
}

export async function apiGetStripeConfig(): Promise<ApiResponse<StripeConfig>> {
  return paymentFetch('/api/payments/stripe/config');
}

export async function apiCreateStripeIntent(
  payload: OrderStripeIntentPayload | GiftCardStripeIntentPayload
): Promise<ApiResponse<StripeIntentResult>> {
  return paymentFetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
