import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Our Capability - AAAnow',
  description: 'Learn about the capabilities behind AAAnow and AiSC — automated website auditing, value and risk assessment, and agency growth tools.',
};

export default function OurCapabilityPage() {
  // Note: Source file has typo in name (our-capabilty.html)
  const pageContent = getStaticPageContent('our-capabilty.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
