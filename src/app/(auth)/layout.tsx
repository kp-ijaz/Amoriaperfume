import { FloatingSidebar } from '@/components/layout/FloatingSidebar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <FloatingSidebar />
    </>
  );
}
