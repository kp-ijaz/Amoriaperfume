import { productsListingMetadata } from '@/lib/seo/static-pages';
import { ProductsPageClient } from './ProductsPageClient';

export const metadata = productsListingMetadata;

export default function ProductsPage() {
  return <ProductsPageClient />;
}
