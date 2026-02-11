import Script from 'next/script';
import { getStaticPageContent } from '@/lib/static-content';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const BAR_GRAPH_SCRIPT_URL = 'https://aaanow.vercel.app/webflow/animations/bar-graph/bar-graph-animation-embed.js';
const TESTIMONIALS_MARKER = '<!-- TESTIMONIALS_SECTION -->';

export default function Home() {
  const pageContent = getStaticPageContent('index.html');
  const parts = pageContent.split(TESTIMONIALS_MARKER);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
      {parts.length > 1 && <TestimonialsSection />}
      {parts.length > 1 && <div dangerouslySetInnerHTML={{ __html: parts[1] }} />}
      <Script src={BAR_GRAPH_SCRIPT_URL} strategy="afterInteractive" />
      <Script id="bar-graph-init" strategy="afterInteractive">
        {`if(window.BarGraphAnimation)window.BarGraphAnimation.mount('#bar-graph')`}
      </Script>
    </>
  );
}
