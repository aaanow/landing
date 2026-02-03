import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Our Capability - AAAnow',
};

export default function OurCapabilityPage() {
  // Note: Webflow file has typo in name (our-capabilty.html)
  const pageContent = getWebflowPageContent('our-capabilty.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
