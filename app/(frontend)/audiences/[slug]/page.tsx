import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  subheading?: string;
  content?: unknown;
  quote?: string;
  quoteAuthor?: string;
  sidebarImage?: string;
  sidebarQuote?: string;
  meta?: {
    title?: string;
    description?: string;
  };
  status?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const page = result.docs[0] as Page | undefined;

    return {
      title: page?.meta?.title || page?.title ? `${page?.meta?.title || page?.title} - AAAnow` : 'Audiences - AAAnow',
      description: page?.meta?.description || page?.subheading,
    };
  } catch {
    return {
      title: 'Audiences - AAAnow',
    };
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: { status: { equals: 'published' } },
      limit: 100,
    });

    return result.docs.map((doc) => ({
      slug: (doc as Page).slug,
    }));
  } catch {
    return [];
  }
}

export default async function AudiencesPage({ params }: PageProps) {
  const { slug } = await params;

  let page: Page | undefined;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    page = result.docs[0] as Page | undefined;
  } catch {
    notFound();
  }

  if (!page) {
    notFound();
  }

  return (
    <section className="section sticky">
      <div className="w-layout-blockcontainer container top-padding w-container">
        <div className="section__content-wrapper">
          <div className="section-header__wrapper">
            <h1>{page.title}</h1>
            {page.subheading && (
              <p className="page-subheading">{page.subheading}</p>
            )}
          </div>
          <div className="div-block-115 animate">
            <div className="page-content rich-text">
              {page.content ? (
                <RichText content={page.content} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
            {page.quote && (
              <blockquote className="page-quote">
                <p>{page.quote}</p>
                {page.quoteAuthor && <cite>— {page.quoteAuthor}</cite>}
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
