import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/normalize.css';
import '@/styles/webflow.css';
import '@/styles/webflow-components.css';
import '@/app/globals.css';
import { Footer, Navigation } from '@/components/layout';

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

const getStartedModalHtml = `
<div data-modal-overlay="get-started" class="getstarted__modal-overview">
  <div data-modal-dialog="get-started" class="getstarted__modal-dialog">
    <a data-modal-close="get-started" href="#" class="getstarted__modal-close-btn w-inline-block"><img src="/images/icon-cross.svg" loading="lazy" alt="" class="icon-16"></a>
    <div class="getstarted__modal-content">
      <div class="getstarted__form-content w-form">
        <form id="wf-form-Signup" name="wf-form-Signup" data-name="Signup" method="get" class="signup__form">
          <div class="signup__form-header-wrapper">
            <h2>Get Started</h2>
            <p class="body__xlarge">Set up your scorecard. Free and no credit card required</p>
          </div>
          <div class="field__wrapper"><input class="signup__form-text-field w-input" maxlength="256" name="Name" data-name="Name" placeholder="Your name (First, Last)" type="text" id="singupName"></div>
          <div class="field__wrapper"><input class="signup__form-text-field w-input" maxlength="256" name="Email" data-name="Email" placeholder="Your work email" type="email" id="signupEmail" required=""></div>
          <div class="field__wrapper"><input class="signup__form-text-field w-input" maxlength="256" name="Organisation-Type-2" data-name="Organisation Type 2" placeholder="Organisation type" type="text" id="Organisation-Type-2"></div>
          <input type="submit" data-wait="Please wait..." class="super-btn _0-top-padding w-button" value="Start building my scorecard">
          <div class="signup__form-legal">
            <p class="body__small light">Your data is used for purposes of building your own scorecard and communicating with you about it. If you are requesting via one of our qualified partners, details are provided only on the basis of scorecard preparation. Completing your details is acceptance of our <span>privacy policy</span> and <a href="#" class="link-2"><span>terms &amp; conditions</span></a>.</p>
          </div>
        </form>
        <div class="signup__form-success w-form-done">
          <div class="signup__form-success-content">
            <div>Thank you! Your submission has been received!</div>
          </div>
        </div>
        <div class="w-form-fail">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      </div>
      <div class="getstarted__modal-img-wrapper"><img sizes="(max-width: 1500px) 100vw, 1500px" srcset="/images/aisc_product-01_1-p-500.avif 500w, /images/aisc_product-01_1-p-800.avif 800w, /images/aisc_product-01_1aisc_product-01.avif 1500w" alt="" loading="lazy" src="/images/aisc_product-01_1aisc_product-01.avif" class="signup__form-img"></div>
    </div>
  </div>
</div>
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-wf-page="6981bc63d15449fd5f2c290e" data-wf-site="6981bc63d15449fd5f2c2913" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rch0hpl.css" />
        <Script src="https://use.typekit.net/rch0hpl.js" strategy="beforeInteractive" />
        <Script id="typekit-load" strategy="beforeInteractive">
          {`try{Typekit.load();}catch(e){}`}
        </Script>
        <Script id="webflow-init" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
      </head>
      <body>
        <Navigation />
        <div className="page-wrapper">
          {children}
        </div>
        <Footer />
        <div dangerouslySetInnerHTML={{ __html: getStartedModalHtml }} />

        {/* External Scripts - jQuery must load first */}
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6981bc63d15449fd5f2c2913"
          strategy="beforeInteractive"
        />

        {/* GSAP and animation libraries */}
        <Script src="https://cdn.prod.website-files.com/gsap/3.14.2/gsap.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.prod.website-files.com/gsap/3.14.2/ScrollTrigger.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.prod.website-files.com/gsap/3.14.2/SplitText.min.js" strategy="lazyOnload" />
        <Script src="https://unpkg.com/lenis@1.3.13/dist/lenis.min.js" strategy="lazyOnload" />

        {/* Webflow JS - must load after page is interactive to avoid matchMedia error */}
        <Script src="/js/webflow.js" strategy="lazyOnload" />

        {/* Custom components */}
        <Script src="https://aaanow.vercel.app/webflow/snippets/components/navigation.js" strategy="lazyOnload" />
        <Script src="https://aaanow.vercel.app/webflow/snippets/components/get-started-overlay.js" strategy="lazyOnload" />

        {/* Initialize Lenis smooth scroll after libraries load */}
        <Script id="lenis-init" strategy="lazyOnload">
          {`
            if (typeof Lenis !== 'undefined') {
              const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              })
              lenis.on('scroll', (e) => {})
              function raf(time) {
                lenis.raf(time)
                requestAnimationFrame(raf)
              }
              requestAnimationFrame(raf)
            }
          `}
        </Script>
      </body>
    </html>
  );
}
