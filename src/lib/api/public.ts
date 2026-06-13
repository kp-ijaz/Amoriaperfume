import { ApiResponse } from './types';
import { getApiBase } from './resolveApiBase';

const STOREFRONT_SLUG = 'default';

function publicQuery(extra?: Record<string, string>) {
  const q = new URLSearchParams({ storefrontSlug: STOREFRONT_SLUG, ...extra });
  return `?${q.toString()}`;
}

async function publicFetch<T>(path: string, options?: RequestInit): Promise<T> {  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }
  const res = await fetch(`${apiBase}${path}`, options);
  return res.json() as Promise<T>;
}

export interface PublicCoverImage {
  _id: string;
  banner_type: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  redirectUrl?: string;
  mediaType?: 'image' | 'video';
  order?: number;
  enabled?: boolean;
  fixedKind?: 'best_seller' | 'online_deals';
  collection?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    heroImage?: string;
  } | null;
}

export interface PublicHomeSlot {
  _id: string;
  key: string;
  title: string;
  subtitle?: string;
  productIds: unknown[];
  sortOrder: number;
  active: boolean;
}

export interface PublicHomepageSection {
  _id: string;
  type: string;
  enabled: boolean;
  order: number;
  config?: Record<string, unknown>;
  theme?: string;
}

export interface PublicPlatformSnippet {
  flashAnnouncementText?: string;
  isCodEnabled?: boolean;
  isOnlinePaymentEnabled?: boolean;
  isTamaraEnabled?: boolean;
  deliveryCharge?: number;
  deliveryThreshold?: number;
  defaultReturnPeriodDays?: number;
  taxInclusive?: boolean;
  taxPercent?: number;
  minGiftCardAmount?: number;
  customPerfumePrice?: number;
}

export interface PublicHomepageLayoutRow {
  key: string;
  enabled?: boolean;
}

export interface PublicPickupStore {
  id: string;
  name: string;
  address: string;
  mapEmbedSrc?: string;
  hours?: string;
  sortOrder?: number;
}

export interface PublicOfferPopup {
  enabled: boolean;
  discountPercent: number;
  startsAt?: string;
  endsAt?: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  displayDelayMs?: number;
  productIds: string[];
  products: unknown[];
}

export interface PublicBootstrap {
  storefront: { id: string; slug: string; name: string };
  homepageSections: PublicHomepageSection[];
  homepageLayout?: PublicHomepageLayoutRow[];
  devMode: { enabled: boolean; title?: string; message?: string };
  platform: PublicPlatformSnippet;
  pickupStores?: PublicPickupStore[];
}

export interface PublicContentPage {
  _id: string;
  slug: string;
  title: string;
  body: string;
  pageType?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface PublicBlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  coverImage?: string;
  publishedAt?: string;
}

export async function apiGetPublicBootstrap(): Promise<ApiResponse<PublicBootstrap>> {
  return publicFetch(`/api/public/bootstrap${publicQuery()}`);
}

export async function apiGetPublicOfferPopup(): Promise<ApiResponse<PublicOfferPopup | null>> {
  return publicFetch(`/api/public/offer-popup${publicQuery()}`);
}

export async function apiGetPublicCoverImages(params?: {
  banner_type?: string;
  device?: 'mobile' | 'desktop';
}): Promise<ApiResponse<PublicCoverImage[]>> {
  const q: Record<string, string> = {};
  if (params?.banner_type) q.banner_type = params.banner_type;
  if (params?.device) q.device = params.device;
  return publicFetch(`/api/public/cover-images${publicQuery(q)}`);
}

export async function apiGetPublicHomepageSections(): Promise<ApiResponse<PublicHomepageSection[]>> {
  return publicFetch(`/api/public/homepage-sections${publicQuery()}`);
}

export async function apiGetPublicPage(slug: string): Promise<ApiResponse<PublicContentPage>> {
  return publicFetch(`/api/public/pages/${encodeURIComponent(slug)}${publicQuery()}`);
}

export async function apiGetPublicHomeSlots(): Promise<ApiResponse<PublicHomeSlot[]>> {
  return publicFetch('/api/home-slots/public');
}

export async function apiGetPublicHomeSlotByKey(key: string): Promise<ApiResponse<PublicHomeSlot>> {
  return publicFetch(`/api/home-slots/public/key/${encodeURIComponent(key)}`);
}

export async function apiGetPublicBlogPosts(): Promise<ApiResponse<PublicBlogPost[]>> {
  return publicFetch('/api/blog-posts/public');
}

export async function apiSubmitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<ApiResponse<unknown>> {
  return publicFetch('/api/public/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export interface PublicFragranceNote {
  _id: string;
  name: string;
}

export async function apiGetPublicFragranceNotes(params?: {
  search?: string;
  limit?: number;
}): Promise<ApiResponse<PublicFragranceNote[]>> {
  const q: Record<string, string> = {};
  if (params?.search) q.search = params.search;
  if (params?.limit != null) q.limit = String(params.limit);
  return publicFetch(`/api/public/fragrance-notes${publicQuery(q)}`);
}

export async function apiSubmitCustomPerfume(data: {
  name: string;
  email: string;
  phone?: string;
  fragranceNotes: string[];
  brandNames: string[];
  inspiration?: string;
  occasion?: string;
  additionalNotes?: string;
}): Promise<ApiResponse<unknown>> {
  return publicFetch('/api/public/custom-perfume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function apiGetAuthMe(token: string): Promise<ApiResponse<{ _id: string; name: string; email: string; phone?: string }>> {
  const res = await fetch(`${getApiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function apiUpdateAuthMe(
  token: string,
  data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }
): Promise<ApiResponse<{ _id: string; name: string; email: string; phone?: string }>> {
  const res = await fetch(`${getApiBase()}/api/auth/me`, {    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiRequestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
  return publicFetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function apiResetPassword(
  token: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> {
  return publicFetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
}
