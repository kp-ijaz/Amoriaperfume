import { bundlesListingMetadata } from '@/lib/seo/static-pages';

export const metadata = bundlesListingMetadata;

export default function BundlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
