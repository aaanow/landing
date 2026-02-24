import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';
import { AboutUsBanner } from '@/components/AboutUsBanner';
import { PopupCards } from '@/components/PopupCards';
import type { Page, Popup, LegalPage, DynamicPageProps, ResourceSidebarItem, ResourceSidebarGlobal } from '@/types/cms';
import { getMediaUrl } from '@/types/cms';

const ICON_MAP: Record<string, string> = {
  pdf: '/images/icon-pdf.svg',
  document: '/images/icon-document.svg',
};

export const revalidate = 3600;

type ResolvedContent =
  | { type: 'page'; doc: Page; relatedPopups: Popup[] }
  | { type: 'popup'; doc: Popup; siblingPopups: Popup[]; parentTitle?: string }
  | { type: 'legal'; doc: LegalPage };

async function resolveSlug(slug: string): Promise<ResolvedContent | null> {
  const payload = await getPayloadClient();

  // Try pages collection first
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  if (pages.docs[0]) {
    // Fetch popups whose aboutPage matches this page's slug
    const relatedPopups = await payload.find({
      collection: 'popups',
      where: {
        aboutPage: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 50,
      depth: 1,
    });
    return {
      type: 'page',
      doc: pages.docs[0] as Page,
      relatedPopups: relatedPopups.docs as Popup[],
    };
  }

  // Try popups collection
  const popups = await payload.find({
    collection: 'popups',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  if (popups.docs[0]) {
    const popup = popups.docs[0] as Popup;
    // Fetch sibling popups and parent page title
    let siblingPopups: Popup[] = [];
    let parentTitle: string | undefined;
    if (popup.aboutPage) {
      const [siblings, parentPage] = await Promise.all([
        payload.find({
          collection: 'popups',
          where: {
            aboutPage: { equals: popup.aboutPage },
            slug: { not_equals: slug },
            _status: { equals: 'published' },
          },
          limit: 50,
          depth: 1,
        }),
        payload.find({
          collection: 'pages',
          where: { slug: { equals: popup.aboutPage } },
          limit: 1,
          depth: 0,
        }),
      ]);
      siblingPopups = siblings.docs as Popup[];
      if (parentPage.docs[0]) {
        parentTitle = (parentPage.docs[0] as Page).title;
      }
    }
    return { type: 'popup', doc: popup, siblingPopups, parentTitle };
  }

  // Try legals collection
  const legals = await payload.find({
    collection: 'legals',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  if (legals.docs[0]) {
    return { type: 'legal', doc: legals.docs[0] as LegalPage };
  }

  return null;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const resolved = await resolveSlug(slug);
    if (!resolved) return { title: 'AAAnow' };

    switch (resolved.type) {
      case 'page': {
        const page = resolved.doc;
        return {
          title: page.meta?.title || page.title ? `${page.meta?.title || page.title} - AAAnow` : 'AAAnow',
          description: page.meta?.description || page.subheading,
        };
      }
      case 'popup': {
        const popup = resolved.doc;
        return {
          title: popup.name ? `${popup.name} - AAAnow` : 'AAAnow',
          description: popup.shortDescription,
        };
      }
      case 'legal': {
        const legal = resolved.doc;
        return {
          title: legal.name ? `${legal.name} - AAAnow` : 'Legal - AAAnow',
        };
      }
    }
  } catch {
    return { title: 'AAAnow' };
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();

    const [pages, popups, legals] = await Promise.all([
      payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'popups', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'legals', where: { _status: { equals: 'published' } }, limit: 100 }),
    ]);

    return [
      ...pages.docs.map((doc) => ({ slug: (doc as Page).slug })),
      ...popups.docs.map((doc) => ({ slug: (doc as Popup).slug })),
      ...legals.docs.map((doc) => ({ slug: (doc as LegalPage).slug })),
    ];
  } catch {
    return [];
  }
}

function PageContent({ page, relatedPopups, resources }: { page: Page; relatedPopups: Popup[]; resources: ResourceSidebarItem[] }) {
  const sidebarImage = getMediaUrl(page.sidebarImage);

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section-header__wrapper" style={{ marginBottom: '2rem' }}>
          <h1>{page.title}</h1>
        </div>
        <div className="section__content-wrapper abouts">
          <div className="about__content-wrapper" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            <div className="div-block-150" style={{ gridColumn: '1 / 16' }}>
              {page.subheading && (
                <p className="body__subheading">{page.subheading}</p>
              )}
              <div className="blog__content-text" style={{ maxWidth: 'none', marginLeft: 0, marginRight: 0 }}>
                {page.content ? (
                  <RichText content={page.content} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
              {page.quote && (
                <blockquote className="block-quote__sm">
                  <p>{page.quote}</p>
                  {page.quoteAuthor && <cite>— {page.quoteAuthor}</cite>}
                </blockquote>
              )}
            </div>
            <div className="abouts-bar" style={{ gridColumn: '16 / 25' }}>
              {sidebarImage && (
                <img src={sidebarImage} loading="lazy" alt="" style={{ width: '100%', borderRadius: '1rem' }} />
              )}
              {page.sidebarQuote && (
                <blockquote className="block-quote__sm" style={{ marginTop: '1.5rem' }}>
                  {page.sidebarQuote}
                </blockquote>
              )}
              {resources.length > 0 && (
                <div className="audience__sidebar">
                  <h3>Resources</h3>
                  <div className="resource__list-wrapper">
                    {resources.map((resource) => (
                      <a key={resource.id || resource.name} href={resource.url || '#'} className="resource__item w-inline-block">
                        <img src={ICON_MAP[resource.icon || 'document']} loading="lazy" alt="" className="image-18" />
                        <div>{resource.name}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <PopupCards popups={relatedPopups} pageTitle={page.title} />
        <AboutUsBanner />
      </div>
    </section>
  );
}

function PopupContent({ popup, siblingPopups, parentTitle }: { popup: Popup; siblingPopups: Popup[]; parentTitle?: string }) {
  const popupImage = getMediaUrl(popup.image);
  const popupIcon = getMediaUrl(popup.icon);

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section-header__wrapper" style={{ marginBottom: '2rem' }}>
          {popupIcon && (
            <img src={popupIcon} loading="lazy" alt="" style={{ width: 48, height: 48, marginBottom: '0.5rem' }} />
          )}
          <h1>{popup.name}</h1>
        </div>
        <div className="section__content-wrapper abouts">
          <div className="about__content-wrapper" style={popupImage ? { gridTemplateColumns: 'repeat(24, 1fr)' } : undefined}>
            <div className="div-block-150" style={{ gridColumn: popupImage ? '1 / 16' : '1 / -1' }}>
              {popup.shortDescription && (
                <p className="body__subheading">{popup.shortDescription}</p>
              )}
              <div className="blog__content-text" style={{ maxWidth: 'none', marginLeft: 0, marginRight: 0 }}>
                {popup.content ? (
                  <RichText content={popup.content} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
            </div>
            {popupImage && (
              <div className="abouts-bar" style={{ gridColumn: '16 / 25' }}>
                <img src={popupImage} loading="lazy" alt={popup.name} style={{ width: '100%', borderRadius: '1rem' }} />
              </div>
            )}
          </div>
        </div>
        <PopupCards popups={siblingPopups} pageTitle={parentTitle} />
        <AboutUsBanner />
      </div>
    </section>
  );
}

function LegalContent({ legal }: { legal: LegalPage }) {
  return (
    <section className="section sticky">
      <div className="container top-bottom-padding narrow">
        <h1 style={{ textAlign: 'center' }}>{legal.name}</h1>
        <div className="blog__content-text">
          {legal.content ? (
            <RichText content={legal.content} />
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function SlugPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  let resolved: ResolvedContent | null = null;

  try {
    resolved = await resolveSlug(slug);
  } catch {
    notFound();
  }

  if (!resolved) {
    notFound();
  }

  // Fetch resource sidebar global for page content
  let sidebarItems: ResourceSidebarItem[] = [];
  if (resolved.type === 'page') {
    try {
      const payload = await getPayloadClient();
      const sidebar = await payload.findGlobal({ slug: 'resource-sidebar' }) as ResourceSidebarGlobal;
      sidebarItems = sidebar.items || [];
    } catch {
      // Fall through with empty items
    }
  }

  switch (resolved.type) {
    case 'page':
      return <PageContent page={resolved.doc} relatedPopups={resolved.relatedPopups} resources={sidebarItems} />;
    case 'popup':
      return <PopupContent popup={resolved.doc} siblingPopups={resolved.siblingPopups} parentTitle={resolved.parentTitle} />;
    case 'legal':
      return <LegalContent legal={resolved.doc} />;
  }
}
