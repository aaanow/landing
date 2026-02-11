import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Partners Overview - AAAnow',
  description: 'Overview of the AAAnow partner programme — benefits, requirements, and how to get started.',
};

export default function PartnersOverviewPage() {
  const pageContent = getStaticPageContent('detail_partners.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
