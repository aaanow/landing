import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Partners Introduction - AAAnow',
  description: 'Learn about the AAAnow partner programme and how your agency can benefit from offering AiSC to clients.',
};

export default function PartnersIntroPage() {
  const pageContent = getStaticPageContent('detail_partners.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
