import type { Metadata } from 'next';
import Script from 'next/script';
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
import '@/styles/scorecard.css';
import '@/styles/how-it-works.css';
import { Footer, Navigation } from '@/components/layout';
import { AnimationProvider } from '@/components/AnimationProvider';
import { GetStartedModal } from '@/components/GetStartedModal';
import { CalFloatingButton } from '@/components/CalFloatingButton';
import { SITE_CONFIG, EXTERNAL_URLS } from '@/lib/constants';

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.description,
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={`https://use.typekit.net/${EXTERNAL_URLS.typekitId}.css`} />
        <Script src={`https://use.typekit.net/${EXTERNAL_URLS.typekitId}.js`} strategy="beforeInteractive" />
        <Script id="typekit-load" strategy="beforeInteractive">
          {`try{Typekit.load()}catch(e){}`}
        </Script>
      </head>
      <body>
        <AnimationProvider>
          <Navigation />
          <div className="page__wrapper">{children}</div>
          <Footer />
          <GetStartedModal />
          <CalFloatingButton />
        </AnimationProvider>
      </body>
    </html>
  );
}
