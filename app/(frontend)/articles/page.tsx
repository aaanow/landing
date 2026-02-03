import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Articles - AAAnow',
};

export default function ArticlesPage() {
  const pageContent = getWebflowPageContent('articles.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
