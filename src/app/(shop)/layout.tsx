import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageTransition } from '@/components/layout/PageTransition';
import { FloatingSidebar } from '@/components/layout/FloatingSidebar';
import { ShopProviders } from '@/components/providers/ShopProviders';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProviders>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
        style={{ color: 'var(--color-amoria-primary)' }}
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 shop-main-content pt-[128px] sm:pt-[100px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomTabBar />
      <ScrollToTop />
      <FloatingSidebar />
    </ShopProviders>
  );
}
