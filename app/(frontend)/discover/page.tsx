import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Discover - AAAnow',
};

export default function DiscoverPage() {
  const pageContent = getStaticPageContent('discover.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
