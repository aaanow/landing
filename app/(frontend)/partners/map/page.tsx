import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Partners Map - AAAnow',
  description: 'Find AAAnow partners near you on our interactive partner map.',
};

export default function PartnersMapPage() {
  const pageContent = getStaticPageContent('detail_partners.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
