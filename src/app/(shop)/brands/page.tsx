import { brandsListingMetadata } from '@/lib/seo/static-pages';
import { BrandsPageClient } from './BrandsPageClient';

export const metadata = brandsListingMetadata;

export default function BrandsPage() {
  return <BrandsPageClient />;
}
