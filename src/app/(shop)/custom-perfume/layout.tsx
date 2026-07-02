import { customPerfumeMetadata } from '@/lib/seo/static-pages';

export const metadata = customPerfumeMetadata;

export default function CustomPerfumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
