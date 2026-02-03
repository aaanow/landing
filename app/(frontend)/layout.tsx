import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/normalize.css';
import '@/styles/webflow.css';
import '@/styles/webflow-components.css';
import '@/app/globals.css';
import { Footer, Navigation } from '@/components/layout';
import AnimationProvider from '@/components/AnimationProvider';
import GetStartedModal from '@/components/GetStartedModal';

export const metadata: Metadata = {
  title: 'Scorecard by AAAnow',
  description:
    'The first solution to productise client retention and revenue growth for agencies. Use 3.7 trillion data points, and 25 years results to map Website Value and Risk - create actionable intelligence your commercial teams can use daily.',
  openGraph: {
    title: 'Scorecard — Fundamentals of online - confirmed',
    description:
      'The first solution to productise client retention and revenue growth for agencies. Use 3.7 trillion data points, and 25 years results to map Website Value and Risk - create actionable intelligence your commercial teams can use daily.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scorecard — Fundamentals of online - confirmed',
    description:
      'The first solution to productise client retention and revenue growth for agencies. Use 3.7 trillion data points, and 25 years results to map Website Value and Risk - create actionable intelligence your commercial teams can use daily.',
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rch0hpl.css" />
        <Script src="https://use.typekit.net/rch0hpl.js" strategy="beforeInteractive" />
        <Script id="typekit-load" strategy="beforeInteractive">
          {`try{Typekit.load();}catch(e){}`}
        </Script>
        <Script id="css-feature-detection" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
      </head>
      <body>
        <AnimationProvider>
          <Navigation />
          <div className="page-wrapper">
            {children}
          </div>
          <Footer />
          <GetStartedModal />
        </AnimationProvider>

        {/* Custom components */}
        <Script src="https://aaanow.vercel.app/webflow/snippets/components/navigation.js" strategy="lazyOnload" />
        <Script src="https://aaanow.vercel.app/webflow/snippets/components/get-started-overlay.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
