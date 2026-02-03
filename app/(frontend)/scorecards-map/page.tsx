import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Scorecards Map - AAAnow',
};

export default function ScorecardsMapPage() {
  const pageContent = getStaticPageContent('scorecards-map.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
