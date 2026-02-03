import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Scorecards Map - AAAnow',
};

export default function ScorecardsMapPage() {
  const pageContent = getWebflowPageContent('scorecards-map.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
