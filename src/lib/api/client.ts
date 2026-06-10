import {
  ApiResponse,
  PaginatedData,
  ApiProduct,
  ApiCategory,
  ApiBrand,
  ApiCollection,
  ApiReview,
  ApiOrder,
  ApiPromotion,
  PromotionValidateRequest,
  PromotionValidateResult,
  ApiLoginResponse,
  CreateOrderRequest,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from './types';
import { Address } from '@/types/user';
import { getApiBase } from './resolveApiBase';

export { getApiBase } from './resolveApiBase';

const TOKEN_KEY = 'amoria_access_token';
const GUEST_ORDERS_TOKEN_KEY = 'amoria_guest_orders_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getGuestOrdersToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(GUEST_ORDERS_TOKEN_KEY) || localStorage.getItem(GUEST_ORDERS_TOKEN_KEY);
}

export function setGuestOrdersToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(GUEST_ORDERS_TOKEN_KEY, token);
}

export function clearGuestOrdersToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(GUEST_ORDERS_TOKEN_KEY);
  localStorage.removeItem(GUEST_ORDERS_TOKEN_KEY);
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error(
      'API base URL is not set. Add NEXT_PUBLIC_API_BASE_URL or API_PROXY_TARGET to .env.local'
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const authToken = token ?? getStoredToken();
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  const json = await res.json();
  return json as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(
  email: string,
  password: string
): Promise<ApiResponse<ApiLoginResponse>> {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<ApiResponse<ApiLoginResponse>> {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categorySlug?: string;
  brand?: string;
  brandSlug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  availability?: 'online' | 'offline' | 'both';
  trending?: boolean;
  newArrival?: boolean;
  limitedOffer?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'most_viewed';
  gender?: string;
  concentration?: string;
  collection?: string; // collection slug or _id
}

export async function apiGetProducts(
  params: ProductsParams = {}
): Promise<ApiResponse<PaginatedData<ApiProduct>>> {
  const qs = new URLSearchParams();
  if (params.page)            qs.set('page', String(params.page));
  if (params.limit)           qs.set('limit', String(params.limit));
  if (params.search)          qs.set('search', params.search);
  if (params.category)        qs.set('category', params.category);
  if (params.categorySlug)    qs.set('categorySlug', params.categorySlug);
  if (params.brand)           qs.set('brand', params.brand);
  if (params.brandSlug)       qs.set('brandSlug', params.brandSlug);
  if (params.featured != null) qs.set('featured', String(params.featured));
  if (params.bestSeller != null) qs.set('bestSeller', String(params.bestSeller));
  if (params.availability) qs.set('availability', params.availability);
  if (params.trending != null) qs.set('trending', String(params.trending));
  if (params.newArrival != null) qs.set('newArrival', String(params.newArrival));
  if (params.limitedOffer != null) qs.set('limitedOffer', String(params.limitedOffer));
  if (params.sort)            qs.set('sort', params.sort);
  if (params.gender)          qs.set('gender', params.gender);
  if (params.concentration)   qs.set('concentration', params.concentration);
  if (params.collection)      qs.set('collection', params.collection);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/products${query}`);
}

export async function apiRecordProductView(productId: string): Promise<ApiResponse<{ viewCount: number }>> {
  return apiFetch(`/api/public/products/${productId}/view`, { method: 'POST' });
}

export async function apiGetProduct(id: string): Promise<ApiResponse<ApiProduct>> {
  return apiFetch(`/api/products/${id}`);
}

export async function apiGetProductBySlug(slug: string): Promise<ApiResponse<ApiProduct>> {
  return apiFetch(`/api/products/slug/${encodeURIComponent(slug)}`);
}

export async function apiGetProductReviews(
  productId: string
): Promise<ApiResponse<ApiReview[]>> {
  return apiFetch(`/api/products/${productId}/reviews`);
}

export async function apiCreateProductReview(
  productId: string,
  data: { rating: number; comment: string },
  token?: string | null
): Promise<ApiResponse<ApiReview>> {
  return apiFetch(`/api/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }, token);
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function apiGetCategories(slug?: string): Promise<ApiResponse<PaginatedData<ApiCategory>>> {
  const query = slug ? `?slug=${encodeURIComponent(slug)}` : '';
  return apiFetch(`/api/categories${query}`);
}

export async function apiGetCategoryBySlug(slug: string): Promise<ApiResponse<ApiCategory>> {
  return apiFetch(`/api/categories/slug/${encodeURIComponent(slug)}`);
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export async function apiGetBrands(): Promise<ApiResponse<ApiBrand[]>> {
  return apiFetch('/api/brands');
}

export async function apiGetBrand(id: string): Promise<ApiResponse<ApiBrand>> {
  return apiFetch(`/api/brands/${id}`);
}

export async function apiGetBrandBySlug(slug: string): Promise<ApiResponse<ApiBrand>> {
  return apiFetch(`/api/brands/slug/${encodeURIComponent(slug)}`);
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function apiGetCollections(slug?: string): Promise<ApiResponse<ApiCollection[]>> {
  const res = await apiFetch<ApiResponse<ApiCollection[]>>('/api/collections/public');
  if (!slug || !Array.isArray(res.data)) return res;
  return {
    ...res,
    data: res.data.filter((collection) => collection.slug === slug),
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function apiGetOrders(token?: string | null): Promise<ApiResponse<ApiOrder[]>> {
  return apiFetch('/api/orders', {}, token);
}

export async function apiCreateOrder(
  data: CreateOrderRequest,
  token?: string | null
): Promise<ApiResponse<ApiOrder>> {
  const path = token ? '/api/orders' : '/api/orders/guest';
  return apiFetch(path, { method: 'POST', body: JSON.stringify(data) }, token);
}

export async function apiCreateFailedPaymentOrder(
  data: CreateOrderRequest & { paymentError?: string },
  token?: string | null
): Promise<ApiResponse<ApiOrder>> {
  const path = token ? '/api/orders/payment-failed' : '/api/orders/payment-failed/guest';
  return apiFetch(
    path,
    {
      method: 'POST',
      body: JSON.stringify({ ...data, paymentMethod: 'ONLINE' }),
    },
    token
  );
}

export interface OrderPaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  amountAed: number;
}

export async function apiCreateOrderPaymentIntent(
  orderId: string,
  token?: string | null
): Promise<ApiResponse<OrderPaymentIntentResult>> {
  return apiFetch(
    `/api/orders/${encodeURIComponent(orderId)}/payment-intent`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
    token
  );
}

export async function apiCompleteOrderPayment(
  orderId: string,
  data: { stripePaymentIntentId: string },
  token?: string | null
): Promise<ApiResponse<ApiOrder>> {
  return apiFetch(
    `/api/orders/${encodeURIComponent(orderId)}/complete-payment`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function apiDownloadOrderInvoice(
  orderId: string,
  options?: { token?: string | null; filename?: string }
): Promise<void> {
  const apiBase = getApiBase();
  const path = `/api/orders/${encodeURIComponent(orderId)}/invoice`;

  const authToken = options?.token ?? getStoredToken();
  if (!authToken) {
    throw new Error('Sign in or verify your email on My Orders to download the invoice.');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
  };

  const res = await fetch(`${apiBase}${path}`, { headers });
  if (!res.ok) {
    let message = 'Failed to download invoice';
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition');
  const filenameMatch = disposition?.match(/filename="([^"]+)"/);
  const filename =
    options?.filename ||
    filenameMatch?.[1] ||
    `Invoice-${orderId}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function apiTrackGuestOrder(data: {
  email: string;
  orderId: string;
}): Promise<ApiResponse<ApiOrder>> {
  return apiFetch('/api/orders/guest/track', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetGuestOrders(data: {
  email: string;
  phone: string;
}): Promise<ApiResponse<ApiOrder[]>> {
  return apiFetch('/api/orders/guest/my-orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiSendGuestOrdersOtp(data: { email: string }): Promise<ApiResponse<{ email: string; otpSent: boolean }>> {
  return apiFetch('/api/orders/guest/send-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiVerifyGuestOrdersOtp(data: {
  email: string;
  otp: string;
}): Promise<ApiResponse<{ token: string; email: string }>> {
  return apiFetch('/api/orders/guest/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetVerifiedGuestOrders(token: string): Promise<ApiResponse<ApiOrder[]>> {
  return apiFetch('/api/orders/guest/verified-orders', {}, token);
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export async function apiGetPromotions(): Promise<ApiResponse<ApiPromotion[]>> {
  return apiFetch('/api/promotions/public');
}

export async function apiValidatePromotion(
  data: PromotionValidateRequest,
  token?: string | null
): Promise<ApiResponse<PromotionValidateResult>> {
  return apiFetch(
    '/api/promotions/validate',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function apiGetShippingQuote(
  data: ShippingQuoteRequest
): Promise<ApiResponse<ShippingQuoteResponse>> {
  return apiFetch('/api/shipping-rules/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── User Addresses ────────────────────────────────────────────────────────────

export async function apiListUserAddresses(token?: string | null): Promise<ApiResponse<Address[]>> {
  return apiFetch('/api/user-addresses', {}, token);
}

export async function apiCreateUserAddress(
  data: Omit<Address, 'id'>,
  token?: string | null
): Promise<ApiResponse<Address[]>> {
  return apiFetch('/api/user-addresses', { method: 'POST', body: JSON.stringify(data) }, token);
}

export async function apiUpdateUserAddress(
  id: string,
  data: Partial<Omit<Address, 'id'>>,
  token?: string | null
): Promise<ApiResponse<Address[]>> {
  return apiFetch(`/api/user-addresses/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }, token);
}

export async function apiDeleteUserAddress(id: string, token?: string | null): Promise<ApiResponse<Address[]>> {
  return apiFetch(`/api/user-addresses/${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
}
