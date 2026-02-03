import Script from 'next/script';
import { getStaticPageContent } from '@/lib/static-content';

const BAR_GRAPH_SCRIPT_URL = 'https://aaanow.vercel.app/webflow/animations/bar-graph/bar-graph-animation-embed.js';

export default function Home() {
  const pageContent = getStaticPageContent('index.html');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      <Script src={BAR_GRAPH_SCRIPT_URL} strategy="afterInteractive" />
      <Script id="bar-graph-init" strategy="afterInteractive">
        {`if(window.BarGraphAnimation)window.BarGraphAnimation.mount('#bar-graph')`}
      </Script>
    </>
  );
}
