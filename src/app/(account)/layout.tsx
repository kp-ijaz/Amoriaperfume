import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AccountSubNav } from '@/components/account/AccountSubNav';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 min-h-screen" style={{ backgroundColor: 'var(--color-amoria-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <AccountSubNav />
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
