import type { Metadata } from 'next';
/* Base & legacy styles */
import '@/styles/base.css';
import '@/styles/components.css';
/* Design tokens & Tailwind */
import '@/app/globals.css';
/* Component styles */
import '@/styles/button.css';
import '@/styles/navigation.css';
import '@/styles/articles.css';
import '@/styles/article-card.css';
import '@/styles/pricing.css';
import '@/styles/reference-materials.css';
import '@/styles/stats.css';
import '@/styles/marquee.css';
import '@/styles/modal.css';
import '@/styles/contact-modal.css';
import '@/styles/scorecard.css';
import '@/styles/how-it-works.css';
import { Footer, Navigation } from '@/components/layout';
import { AnimationProvider } from '@/components/AnimationProvider';
import { GetStartedModal } from '@/components/GetStartedModal';
import { ContactModal } from '@/components/ContactModal';
import { CalFloatingButton } from '@/components/CalFloatingButton';
import { SITE_CONFIG, EXTERNAL_URLS } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.description,
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: SITE_CONFIG.ogTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.description,
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
  verification: {
    google: 'rm4RRCVTDP59HLDpsDn6dC1lAX6WVbAT86qMXw0SUpA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://f9zjmgqvvmcuey8j.public.blob.vercel-storage.com" />
        <link rel="stylesheet" href={`https://use.typekit.net/${EXTERNAL_URLS.typekitId}.css`} />
      </head>
      <body>
        <AnimationProvider>
          <Navigation />
          <div className="page__wrapper">{children}</div>
          <Footer />
          <GetStartedModal />
          <ContactModal />
          <CalFloatingButton />
        </AnimationProvider>
      </body>
    </html>
  );
}
