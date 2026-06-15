import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AccountSubNav } from '@/components/account/AccountSubNav';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { FloatingSidebar } from '@/components/layout/FloatingSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main
        className="flex-1 min-h-screen pt-[128px] sm:pt-[100px]"
        style={{ backgroundColor: 'var(--color-amoria-bg)' }}
      >
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <AccountSubNav />
        </div>
        {children}
      </main>
      <Footer />
      <BottomTabBar />
      <FloatingSidebar />
    </>
  );
}
