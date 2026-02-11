import { Metadata } from 'next';
import { PricingContent } from '@/components/PricingContent';

export const metadata: Metadata = {
  title: 'Pricing - AAAnow',
  description: 'Transparent pricing designed for agencies of all sizes. Choose a subscription level or start with a free trial of AiSC.',
};

export default function PricingPage() {
  return <PricingContent />;
}
