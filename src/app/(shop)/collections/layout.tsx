import { collectionsListingMetadata } from '@/lib/seo/static-pages';

export const metadata = collectionsListingMetadata;

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
