import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface LegalPage {
  id: string;
  name: string;
  slug: string;
  content?: unknown;
  order?: number;
  status?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'legals',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const legal = result.docs[0] as LegalPage | undefined;

  return {
    title: legal ? `${legal.name} - AAAnow` : 'Legal - AAAnow',
  };
}

export async function generateStaticParams() {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'legals',
    limit: 100,
  });

  return result.docs.map((doc) => ({
    slug: (doc as LegalPage).slug,
  }));
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'legals',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const legal = result.docs[0] as LegalPage | undefined;

  if (!legal) {
    notFound();
  }

  return (
    <section className="section sticky">
      <div className="w-layout-blockcontainer container top-padding w-container">
        <div className="section__content-wrapper">
          <div className="section-header__wrapper">
            <h1>{legal.name}</h1>
          </div>
          <div className="div-block-115 animate">
            <div className="legal-content rich-text">
              {legal.content ? (
                <RichText content={legal.content} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
