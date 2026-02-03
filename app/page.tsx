import Script from 'next/script';
import { getWebflowPageContent } from '@/lib/webflow-content';

export default function Home() {
  const pageContent = getWebflowPageContent('index.html');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      <Script src="https://aaanow.vercel.app/webflow/animations/bar-graph/bar-graph-animation-embed.js" strategy="afterInteractive" />
      <Script id="bar-graph-init" strategy="afterInteractive">
        {`
          window.addEventListener('DOMContentLoaded', () => {
            if (window.BarGraphAnimation) {
              window.BarGraphAnimation.mount('#bar-graph')
            }
          })
        `}
      </Script>
    </>
  );
}
