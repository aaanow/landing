import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Partner Application - AAAnow',
  description: 'Apply to become an AAAnow partner and start offering AiSC-powered services to your agency clients.',
};

export default function PartnerApplicationPage() {
  const pageContent = getStaticPageContent('detail_partners.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
