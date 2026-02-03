import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Documentation - AAAnow',
};

export default function DocumentationPage() {
  // Using detail_resource.html as the base template for documentation
  const pageContent = getStaticPageContent('detail_resource.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
