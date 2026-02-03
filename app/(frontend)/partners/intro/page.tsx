import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Partners Introduction - AAAnow',
};

export default function PartnersIntroPage() {
  const pageContent = getWebflowPageContent('detail_partners.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
