import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { FragranceFinderWidgetLazy } from '@/components/home/FragranceFinderWidgetLazy';
import { Toaster } from 'sonner';
import { getSiteUrl } from '@/lib/seo/site';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
} from '@/lib/seo/constants';

const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  icons: {
    icon: '/brand-icon.png',
    shortcut: '/brand-icon.png',
    apple: '/brand-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_AE',
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
            <LanguageProvider>
            <CustomCursor />
            {children}
            <FragranceFinderWidgetLazy />
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
            </LanguageProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
