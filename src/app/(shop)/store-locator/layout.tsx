import { storeLocatorMetadata } from '@/lib/seo/static-pages';

export const metadata = storeLocatorMetadata;

export default function StoreLocatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
