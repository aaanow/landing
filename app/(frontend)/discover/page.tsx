import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Discover - AAAnow',
  description: 'Discover how AAAnow and AiSC help agencies protect client value, identify risks, and grow revenue through continuous website assessment.',
};

export default function DiscoverPage() {
  const pageContent = getStaticPageContent('discover.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
