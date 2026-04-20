import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 min-h-screen" style={{ backgroundColor: 'var(--color-amoria-bg)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
