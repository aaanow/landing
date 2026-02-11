import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Scorecards Map - AAAnow',
  description: 'Explore public scorecards on an interactive map. See how websites perform across value and risk fundamentals.',
};

export default function ScorecardsMapPage() {
  const pageContent = getStaticPageContent('scorecards-map.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
