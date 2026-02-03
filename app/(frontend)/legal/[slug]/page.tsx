import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ')} - AAAnow`,
  };
}

export function generateStaticParams() {
  return [
    { slug: 'terms' },
    { slug: 'privacy' },
  ];
}

export default async function LegalPage({ params }: PageProps) {
  await params;
  const pageContent = getWebflowPageContent('detail_legal.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
