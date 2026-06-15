import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageTransition } from '@/components/layout/PageTransition';
import { FloatingSidebar } from '@/components/layout/FloatingSidebar';
import { FragranceFinderWidget } from '@/components/home/FragranceFinderWidget';
import { ShopProviders } from '@/components/providers/ShopProviders';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProviders>
      <Header />
      {/* Reserve space above the fixed bottom tab bar + device safe area */}
      <main className="flex-1 shop-main-content pt-[128px] sm:pt-[100px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomTabBar />
      <ScrollToTop />
      <FloatingSidebar />
      <FragranceFinderWidget />
    </ShopProviders>
  );
}
