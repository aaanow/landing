import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Reference Material - AAAnow',
};

export default function ReferenceMaterialPage() {
  const pageContent = getWebflowPageContent('reference-material.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
