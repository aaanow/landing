import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Documentation - AAAnow',
};

export default function DocumentationPage() {
  // Using detail_resource.html as the base template for documentation
  const pageContent = getWebflowPageContent('detail_resource.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
