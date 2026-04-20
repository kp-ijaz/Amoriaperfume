import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from 'sonner';

const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amoria — Premium Arabian Fragrances',
  description:
    'Discover authentic Arabian perfumes, attars, and oud fragrances. Shop Swiss Arabian, Ajmal, Rasasi, Lattafa, and Armaf. Free delivery on orders over AED 200.',
  keywords: 'perfume UAE, oud, attar, Arabian fragrance, Dubai perfume, Swiss Arabian, Ajmal',
  openGraph: {
    title: 'Amoria — Premium Arabian Fragrances',
    description: 'Authentic Arabian perfumes, attars, and oud fragrances delivered across UAE.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--color-amoria-bg)', color: 'var(--color-amoria-text)' }}
      >
        <StoreProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1A0A2E',
                  border: '1px solid #C9A84C',
                  color: '#FAF8F5',
                },
              }}
            />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
