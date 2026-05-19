import { apiRecordProductView } from '@/lib/api/client';

const STORAGE_KEY = 'amoria_product_views';
const COOLDOWN_MS = 30 * 60 * 1000;

function shouldSkip(productId: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    const last = map[productId];
    if (last && now - last < COOLDOWN_MS) return true;
    map[productId] = now;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return false;
  } catch {
    return false;
  }
}

/** Track a storefront product click or PDP visit (deduped per browser session). */
export function recordProductView(productId: string) {
  if (!productId?.trim() || shouldSkip(productId)) return;
  void apiRecordProductView(productId).catch(() => {
    /* non-blocking */
  });
}
