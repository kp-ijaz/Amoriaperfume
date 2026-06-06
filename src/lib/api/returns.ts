import {
  getApiBase,
  getGuestOrdersToken,
  getStoredToken,
} from './client';
import { ApiResponse } from './types';

const STOREFRONT_SLUG = 'default';

export interface ReturnCondition {
  _id: string;
  title: string;
  description: string;
  order?: number;
}

export interface ReturnEvidence {
  url: string;
  mediaType: 'image' | 'video';
  publicId?: string;
  originalFilename?: string;
}

export interface ReturnLineItem {
  productId?: string;
  productName: string;
  quantity: number;
  image?: string;
}

export interface ReturnRequest {
  _id: string;
  requestId: string;
  orderId: string;
  orderBusinessId: string;
  orderItemIndex: number;
  lineItem: ReturnLineItem;
  conditionSnapshot?: { title: string; description?: string };
  description?: string;
  evidence: ReturnEvidence[];
  status: string;
  rejectionReason?: string;
  pickup?: {
    courierName?: string;
    trackingId?: string;
    scheduledAt?: string;
    instructions?: string;
    address?: string;
  };
  replacementShipment?: {
    courierName?: string;
    trackingId?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedReturns {
  items: ReturnRequest[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface CreateReturnPayload {
  orderId: string;
  orderItemIndex: number;
  returnConditionId: string;
  description?: string;
  evidence: ReturnEvidence[];
}

function resolveAuthToken(token?: string | null): string | null {
  return token ?? getStoredToken() ?? getGuestOrdersToken();
}

async function returnsFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }
  const authToken = resolveAuthToken(token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) {
    const message =
      json && typeof json === 'object' && 'message' in json && typeof json.message === 'string'
        ? json.message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json as T;
}

export async function getReturnConditions(): Promise<ReturnCondition[]> {
  const q = new URLSearchParams({ storefrontSlug: STOREFRONT_SLUG });
  const res = await fetch(`${getApiBase()}/api/public/return-conditions?${q.toString()}`);
  const json = (await res.json()) as ApiResponse<ReturnCondition[]>;
  if (!json.success || !Array.isArray(json.data)) return [];
  return json.data;
}

export async function uploadReturnEvidence(
  file: File,
  token?: string | null
): Promise<ReturnEvidence> {
  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }
  const authToken = resolveAuthToken(token);
  if (!authToken) {
    throw new Error('Please sign in or verify your email to upload proof.');
  }
  const form = new FormData();
  form.append('file', file);
  const headers: Record<string, string> = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${apiBase}/api/returns/evidence`, {
    method: 'POST',
    headers,
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Upload failed');
  }
  return json.data as ReturnEvidence;
}

export async function createReturnRequest(
  payload: CreateReturnPayload,
  opts?: { isGuest?: boolean; token?: string | null }
): Promise<ReturnRequest> {
  const path = opts?.isGuest ? '/api/returns/guest' : '/api/returns';
  const res = await returnsFetch<ApiResponse<ReturnRequest>>(
    path,
    { method: 'POST', body: JSON.stringify(payload) },
    opts?.token
  );
  if (!res.success || !res.data) throw new Error(res.message || 'Failed to submit request');
  return res.data;
}

export async function listMyReturns(
  params: { page?: number; limit?: number; isGuest?: boolean; token?: string | null } = {}
): Promise<PaginatedReturns> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const path = params.isGuest ? `/api/returns/guest/my${query}` : `/api/returns/my${query}`;
  const res = await returnsFetch<ApiResponse<PaginatedReturns>>(path, {}, params.token);
  if (!res.success || !res.data) {
    return { items: [], meta: { page: 1, limit: 20, totalCount: 0, totalPages: 1 } };
  }
  return res.data;
}

export async function getReturnDetail(
  id: string,
  token?: string | null
): Promise<ReturnRequest> {
  const res = await returnsFetch<ApiResponse<ReturnRequest>>(`/api/returns/${id}`, {}, token);
  if (!res.success || !res.data) throw new Error(res.message || 'Request not found');
  return res.data;
}

export const RETURN_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  PICKUP_SCHEDULED: 'Pickup scheduled',
  STORE_RECEIVED: 'Store received',
  REPLACEMENT_ORDER_CREATED: 'Replacement order created',
  REPLACEMENT_SHIPPED: 'Replacement shipped',
  REPLACEMENT_DELIVERED: 'Replacement delivered',
  CLOSED: 'Closed',
};

export const TERMINAL_RETURN_STATUSES = new Set(['REJECTED', 'CLOSED']);

export function isOpenReturnStatus(status: string): boolean {
  return !TERMINAL_RETURN_STATUSES.has(status);
}
