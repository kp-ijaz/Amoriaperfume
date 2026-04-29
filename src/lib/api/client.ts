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
  ApiLoginResponse,
  CreateOrderRequest,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

const TOKEN_KEY = 'amoria_access_token';

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

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const authToken = token ?? getStoredToken();
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();
  return json as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(
  email: string,
  password: string
): Promise<ApiResponse<ApiLoginResponse>> {
  return apiFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  gender?: string;
  fragranceFamily?: string;
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
  if (params.sort)            qs.set('sort', params.sort);
  if (params.gender)          qs.set('gender', params.gender);
  if (params.fragranceFamily) qs.set('fragranceFamily', params.fragranceFamily);
  if (params.concentration)   qs.set('concentration', params.concentration);
  if (params.collection)      qs.set('collection', params.collection);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/products${query}`);
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

// ─── Promotions ───────────────────────────────────────────────────────────────

export async function apiGetPromotions(): Promise<ApiResponse<ApiPromotion[]>> {
  return apiFetch('/api/promotions/public');
}

export async function apiGetShippingQuote(
  data: ShippingQuoteRequest
): Promise<ApiResponse<ShippingQuoteResponse>> {
  return apiFetch('/api/shipping-rules/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
