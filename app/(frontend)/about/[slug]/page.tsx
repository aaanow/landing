import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Popup {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  shortDescription?: string;
  content?: unknown;
  link?: string;
  aboutPage?: string;
  status?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'popups',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const popup = result.docs[0] as Popup | undefined;

    return {
      title: popup ? `${popup.name} - AAAnow` : 'About - AAAnow',
      description: popup?.shortDescription,
    };
  } catch {
    return {
      title: 'About - AAAnow',
    };
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'popups',
      where: { status: { equals: 'published' } },
      limit: 100,
    });

    return result.docs.map((doc) => ({
      slug: (doc as Popup).slug,
    }));
  } catch {
    return [];
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { slug } = await params;

  let popup: Popup | undefined;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'popups',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    popup = result.docs[0] as Popup | undefined;
  } catch {
    notFound();
  }

  if (!popup) {
    notFound();
  }

  return (
    <section className="section sticky">
      <div className="w-layout-blockcontainer container top-padding w-container">
        <div className="section__content-wrapper">
          <div className="section-header__wrapper">
            {popup.icon && (
              <img src={popup.icon} alt="" className="about-icon" />
            )}
            <h1>{popup.name}</h1>
            {popup.shortDescription && (
              <p className="about-description">{popup.shortDescription}</p>
            )}
          </div>
          {popup.image && (
            <div className="about-image-wrapper">
              <img src={popup.image} alt={popup.name} className="about-image" />
            </div>
          )}
          <div className="div-block-115 animate">
            <div className="about-content rich-text">
              {popup.content ? (
                <RichText content={popup.content} />
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
