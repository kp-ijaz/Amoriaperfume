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
} from './types';

export const API_BASE = 'https://amoria-backend.onrender.com';

const TOKEN_KEY = 'amoria_access_token';

// Admin credentials used to auto-authenticate all API calls that require auth.
// This includes collections, orders, and promotions.
const ADMIN_EMAIL    = 'admin@amoria.com';
const ADMIN_PASSWORD = 'Admin@1234';

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

// Single in-flight promise so concurrent auth-gated calls don't race
let _tokenRefreshPromise: Promise<string | null> | null = null;

async function ensureToken(): Promise<string | null> {
  const existing = getStoredToken();
  if (existing) return existing;

  if (!_tokenRefreshPromise) {
    _tokenRefreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
        });
        const json = await res.json();
        if (json?.success && json?.data?.accessToken) {
          setStoredToken(json.data.accessToken);
          return json.data.accessToken as string;
        }
      } catch {
        // Silently ignore login errors — callers handle missing auth gracefully
      }
      return null;
    })().finally(() => {
      _tokenRefreshPromise = null;
    });
  }

  return _tokenRefreshPromise;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = await ensureToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

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
  category?: string;  // MongoDB _id
  brand?: string;     // MongoDB _id
  featured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  gender?: string;
  fragranceFamily?: string;
  concentration?: string;
}

export async function apiGetProducts(
  params: ProductsParams = {}
): Promise<ApiResponse<PaginatedData<ApiProduct>>> {
  const qs = new URLSearchParams();
  if (params.page)            qs.set('page', String(params.page));
  if (params.limit)           qs.set('limit', String(params.limit));
  if (params.search)          qs.set('search', params.search);
  if (params.category)        qs.set('category', params.category);
  if (params.brand)           qs.set('brand', params.brand);
  if (params.featured != null) qs.set('featured', String(params.featured));
  if (params.sort)            qs.set('sort', params.sort);
  if (params.gender)          qs.set('gender', params.gender);
  if (params.fragranceFamily) qs.set('fragranceFamily', params.fragranceFamily);
  if (params.concentration)   qs.set('concentration', params.concentration);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/products${query}`);
}

export async function apiGetProduct(id: string): Promise<ApiResponse<ApiProduct>> {
  return apiFetch(`/api/products/${id}`);
}

export async function apiGetProductReviews(
  productId: string
): Promise<ApiResponse<ApiReview[]>> {
  return apiFetch(`/api/products/${productId}/reviews`);
}

export async function apiCreateProductReview(
  productId: string,
  data: { rating: number; comment: string }
): Promise<ApiResponse<ApiReview>> {
  return apiFetch(
    `/api/products/${productId}/reviews`,
    { method: 'POST', body: JSON.stringify(data) },
    true
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function apiGetCategories(slug?: string): Promise<ApiResponse<PaginatedData<ApiCategory>>> {
  const query = slug ? `?slug=${encodeURIComponent(slug)}` : '';
  return apiFetch(`/api/categories${query}`);
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export async function apiGetBrands(): Promise<ApiResponse<ApiBrand[]>> {
  return apiFetch('/api/brands');
}

export async function apiGetBrand(id: string): Promise<ApiResponse<ApiBrand>> {
  return apiFetch(`/api/brands/${id}`);
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function apiGetCollections(slug?: string): Promise<ApiResponse<ApiCollection[]>> {
  const query = slug ? `?slug=${encodeURIComponent(slug)}` : '';
  return apiFetch(`/api/collections${query}`, {}, true);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function apiGetOrders(): Promise<ApiResponse<ApiOrder[]>> {
  return apiFetch('/api/orders', {}, true);
}

export async function apiCreateOrder(
  data: CreateOrderRequest
): Promise<ApiResponse<ApiOrder>> {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export async function apiGetPromotions(): Promise<ApiResponse<ApiPromotion[]>> {
  return apiFetch('/api/promotions', {}, true);
}
