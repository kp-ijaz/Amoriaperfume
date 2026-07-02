import 'server-only';

import {
  apiGetProductBySlug,
  apiGetProducts,
  apiGetBrands,
  apiGetBrandBySlug,
  apiGetCategories,
  apiGetCategoryBySlug,
  apiGetGiftSets,
  apiGetGiftSetBySlug,
  apiGetBundles,
  apiGetBundleBySlug,
} from './client';
import { apiGetPublicPage, apiGetPublicCoverImages, type PublicContentPage, type PublicCoverImage } from './public';
import {
  ApiBrand,
  ApiBundle,
  ApiCategory,
  ApiGiftSet,
  ApiProduct,
  ApiResponse,
  PaginatedData,
} from './types';
import { processHeroCoverImages, type HeroCoverBundle } from '@/lib/utils/heroCoverImages';

const REVALIDATE = 300;

function unwrap<T>(res: ApiResponse<T>): T | null {
  if (!res?.success || res.data == null) return null;
  return res.data;
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await apiGetProductBySlug(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchProductsPage(
  page = 1,
  limit = 100
): Promise<PaginatedData<ApiProduct> | null> {
  try {
    const res = await apiGetProducts({ page, limit }, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const first = await fetchProductsPage(1, 100);
  if (!first) return [];
  const all = [...first.items];
  for (let page = 2; page <= first.meta.totalPages; page++) {
    const next = await fetchProductsPage(page, 100);
    if (next?.items.length) all.push(...next.items);
  }
  return all;
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  try {
    const res = await apiGetBrands({ revalidate: REVALIDATE });
    return unwrap(res) ?? [];
  } catch {
    return [];
  }
}

export async function fetchBrandBySlug(slug: string): Promise<ApiBrand | null> {
  try {
    const res = await apiGetBrandBySlug(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const res = await apiGetCategories({ limit: 200 }, { revalidate: REVALIDATE });
    const data = unwrap(res);
    return data?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  try {
    const res = await apiGetCategoryBySlug(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchGiftSets(): Promise<ApiGiftSet[]> {
  try {
    const res = await apiGetGiftSets(undefined, { revalidate: REVALIDATE });
    return unwrap(res) ?? [];
  } catch {
    return [];
  }
}

export async function fetchGiftSetBySlug(slug: string): Promise<ApiGiftSet | null> {
  try {
    const res = await apiGetGiftSetBySlug(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchBundles(): Promise<ApiBundle[]> {
  try {
    const res = await apiGetBundles({ revalidate: REVALIDATE });
    return unwrap(res) ?? [];
  } catch {
    return [];
  }
}

export async function fetchBundleBySlug(slug: string): Promise<ApiBundle | null> {
  try {
    const res = await apiGetBundleBySlug(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchPublicPage(slug: string): Promise<PublicContentPage | null> {
  try {
    const res = await apiGetPublicPage(slug, { revalidate: REVALIDATE });
    return unwrap(res);
  } catch {
    return null;
  }
}

export async function fetchHeroCoverImages(): Promise<HeroCoverBundle> {
  try {
    const res = await apiGetPublicCoverImages(undefined, { revalidate: REVALIDATE });
    const data = unwrap(res);
    if (!Array.isArray(data)) return { sliders: [], sidePanels: [] };
    return processHeroCoverImages(data);
  } catch {
    return { sliders: [], sidePanels: [] };
  }
}

export type { HeroCoverBundle, PublicCoverImage };
