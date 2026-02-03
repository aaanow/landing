import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Our Capability - AAAnow',
};

export default function OurCapabilityPage() {
  // Note: Source file has typo in name (our-capabilty.html)
  const pageContent = getStaticPageContent('our-capabilty.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
