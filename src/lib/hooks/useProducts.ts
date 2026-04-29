'use client';

/**
 * useProducts — re-exports the API-backed hook under the original interface
 * so that existing pages/components continue to work without changes.
 */
export type {
  ApiProductFilters as ProductFilters,
  ApiSortOption as SortOption,
  AvailableProductFilters,
  FilterOption,
} from './useApiProducts';
export { useApiProducts as useProducts } from './useApiProducts';
