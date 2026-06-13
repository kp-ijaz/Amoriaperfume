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
  items: (
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
      }
  )[];
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

export interface TamaraConfig {
  enabled: boolean;
  configured: boolean;
}

export interface TamaraCheckoutResult {
  checkoutUrl: string;
  orderId: string;
  tamaraOrderId?: string;
}

export async function apiGetTamaraConfig(): Promise<ApiResponse<TamaraConfig>> {
  return paymentFetch('/api/payments/tamara/config');
}

export async function apiCreateTamaraCheckout(
  payload: { orderId: string; email?: string; locale?: 'en_US' | 'ar_AE' },
  token?: string | null
): Promise<ApiResponse<TamaraCheckoutResult>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return paymentFetch('/api/payments/tamara/create-checkout', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export interface TamaraOrderStatus {
  orderId: string;
  paymentStatus: string;
  orderStatus: string;
  tamaraStatus?: string;
}

export async function apiGetTamaraOrderStatus(params: {
  orderId: string;
  email?: string;
}): Promise<ApiResponse<TamaraOrderStatus>> {
  const q = new URLSearchParams({ orderId: params.orderId });
  if (params.email) q.set('email', params.email);
  return paymentFetch(`/api/orders/tamara/status?${q.toString()}`);
}
