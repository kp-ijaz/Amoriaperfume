import { categoriesListingMetadata } from '@/lib/seo/static-pages';
import { CategoriesPageClient } from './CategoriesPageClient';

export const metadata = categoriesListingMetadata;

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
