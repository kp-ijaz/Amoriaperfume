import { FloatingSidebar } from '@/components/layout/FloatingSidebar';
import { FragranceFinderWidget } from '@/components/home/FragranceFinderWidget';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <FloatingSidebar />
      <FragranceFinderWidget />
    </>
  );
}
