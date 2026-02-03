import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Pricing - AAAnow',
};

export default function PricingPage() {
  const pageContent = getWebflowPageContent('pricing.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
