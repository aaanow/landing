import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Discover - AAAnow',
};

export default function DiscoverPage() {
  const pageContent = getWebflowPageContent('discover.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
