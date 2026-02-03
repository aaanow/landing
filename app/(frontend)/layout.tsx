import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/normalize.css';
import '@/styles/webflow.css';
import '@/styles/webflow-components.css';
import '@/app/globals.css';
import { Footer, Navigation } from '@/components/layout';
import AnimationProvider from '@/components/AnimationProvider';
import GetStartedModal from '@/components/GetStartedModal';

const SITE_TITLE = 'Scorecard by AAAnow';
const SITE_DESCRIPTION = 'The first solution to productise client retention and revenue growth for agencies. Use 3.7 trillion data points, and 25 years results to map Website Value and Risk - create actionable intelligence your commercial teams can use daily.';
const OG_TITLE = 'Scorecard — Fundamentals of online - confirmed';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: OG_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
};

const TYPEKIT_ID = 'rch0hpl';
const WEBFLOW_BASE_URL = 'https://aaanow.vercel.app/webflow/snippets/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={`https://use.typekit.net/${TYPEKIT_ID}.css`} />
        <Script src={`https://use.typekit.net/${TYPEKIT_ID}.js`} strategy="beforeInteractive" />
        <Script id="typekit-load" strategy="beforeInteractive">
          {`try{Typekit.load()}catch(e){}`}
        </Script>
        <Script id="css-feature-detection" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document)`}
        </Script>
      </head>
      <body>
        <AnimationProvider>
          <Navigation />
          <div className="page-wrapper">{children}</div>
          <Footer />
          <GetStartedModal />
        </AnimationProvider>

        <Script src={`${WEBFLOW_BASE_URL}/navigation.js`} strategy="lazyOnload" />
        <Script src={`${WEBFLOW_BASE_URL}/get-started-overlay.js`} strategy="lazyOnload" />
      </body>
    </html>
  );
}
