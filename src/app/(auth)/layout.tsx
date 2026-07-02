import { FloatingSidebar } from '@/components/layout/FloatingSidebar';
import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata = noIndexMetadata;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <FloatingSidebar />
    </>
  );
}
