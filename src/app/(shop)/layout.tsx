import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageTransition } from '@/components/layout/PageTransition';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pb-[72px] on mobile reserves space above the fixed bottom tab bar */}
      <main className="flex-1 pb-[72px] md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      {/* Footer hidden on mobile — bottom tabs replace it */}
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomTabBar />
      <ScrollToTop />
    </>
  );
}
