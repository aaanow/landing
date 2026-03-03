import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';
import { AboutUsBanner } from '@/components/AboutUsBanner';
import { PopupCards } from '@/components/PopupCards';
import type { Page, Popup, LegalPage, Product, DynamicPageProps, ResourceSidebarItem, ResourceSidebarGlobal } from '@/types/cms';
import { getMediaUrl } from '@/types/cms';
import { Button } from '@/components/Button';
import { ArrowIcon } from '@/components/icons';

const ICON_MAP: Record<string, string> = {
  pdf: '/images/icon-pdf.svg',
  document: '/images/icon-document.svg',
};

const DEFAULT_RESOURCES: ResourceSidebarItem[] = [
  { name: 'Agency Growth Platform', icon: 'pdf' },
  { name: 'AiSC - 60secs... WHY', icon: 'document' },
  { name: 'AISC - Agency pricing', icon: 'pdf' },
  { name: 'AISC - The Application', icon: 'pdf' },
  { name: 'Agency revenue, client confidence', icon: 'document' },
  { name: 'IN|SITE', icon: 'document' },
  { name: 'OVER|SITE', icon: 'document' },
  { name: 'WORK|PACK', icon: 'document' },
  { name: 'AOD', icon: 'document' },
  { name: 'Try /CONFIRM', icon: 'document' },
];

// Fallback revalidation; on-demand revalidation handles immediate updates
export const revalidate = 3600;

type ResolvedContent =
  | { type: 'page'; doc: Page; relatedPopups: Popup[] }
  | { type: 'popup'; doc: Popup; siblingPopups: Popup[]; parentTitle?: string }
  | { type: 'legal'; doc: LegalPage }
  | { type: 'product'; doc: Product };

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

  // Try products collection
  const products = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  if (products.docs[0]) {
    return { type: 'product', doc: products.docs[0] as Product };
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
      case 'product': {
        const product = resolved.doc;
        return {
          title: product.meta?.title || product.title ? `${product.meta?.title || product.title} - AAAnow` : 'AAAnow',
          description: product.meta?.description || product.subheading,
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

    const [pages, popups, products, legals] = await Promise.all([
      payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'popups', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'products', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'legals', where: { _status: { equals: 'published' } }, limit: 100 }),
    ]);

    return [
      ...pages.docs.map((doc) => ({ slug: (doc as Page).slug })),
      ...popups.docs.map((doc) => ({ slug: (doc as Popup).slug })),
      ...products.docs.map((doc) => ({ slug: (doc as Product).slug })),
      ...legals.docs.map((doc) => ({ slug: (doc as LegalPage).slug })),
    ];
  } catch {
    return [];
  }
}

function PageContent({ page, relatedPopups, resources, initialPopupSlug }: { page: Page; relatedPopups: Popup[]; resources: ResourceSidebarItem[]; initialPopupSlug?: string }) {
  const sidebarImage = getMediaUrl(page.sidebarImage);

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section-header__wrapper hero-animate hero-animate-delay-1" style={{ marginBottom: '2rem' }}>
          <h1>{page.title}</h1>
        </div>
        <div className="section__content-wrapper abouts hero-animate hero-animate-delay-2">
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
                <Image src={sidebarImage} alt={page.title} width={400} height={300} style={{ width: '100%', height: 'auto', borderRadius: '1rem' }} />
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
                        <Image src={ICON_MAP[resource.icon || 'document']} alt="" width={24} height={24} className="image-18" />
                        <div>{resource.name}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <PopupCards popups={relatedPopups} pageTitle={page.title} initialPopupSlug={initialPopupSlug} parentPageSlug={page.slug} />
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
        <div className="section-header__wrapper hero-animate hero-animate-delay-1" style={{ marginBottom: '2rem' }}>
          {popupIcon && (
            <Image src={popupIcon} alt="" width={48} height={48} style={{ marginBottom: '0.5rem' }} />
          )}
          <h1>{popup.name}</h1>
        </div>
        <div className="section__content-wrapper abouts hero-animate hero-animate-delay-2">
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
                <Image src={popupImage} alt={popup.name} width={400} height={300} style={{ width: '100%', height: 'auto', borderRadius: '1rem' }} />
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
        <h1 className="hero-animate hero-animate-delay-1" style={{ textAlign: 'center' }}>{legal.name}</h1>
        <div className="blog__content-text hero-animate hero-animate-delay-2">
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

function ProductContent({ product }: { product: Product }) {
  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section-header__wrapper hero-animate hero-animate-delay-1" style={{ marginBottom: '2.5rem' }}>
          <h1>{product.title}</h1>
          {product.subheading && (
            <div className="subheading__wrapper">
              <p className="body__xlarge">{product.subheading}</p>
            </div>
          )}
        </div>

        {product.panels?.map((panel, index) => {
          const panelImage = getMediaUrl(panel.image);
          const colorClass = panel.panelColor && panel.panelColor !== 'default' ? ` ${panel.panelColor}` : '';
          return (
            <div
              key={panel.id || index}
              className={`section__content-wrapper abouts${colorClass} hero-animate`}
              style={{ animationDelay: `${0.2 + index * 0.15}s`, marginTop: index > 0 ? '2rem' : undefined }}
            >
              <div className="about__content-wrapper" style={{ gridTemplateColumns: 'repeat(24, 1fr)', marginTop: 0 }}>
                <div className="div-block-150" style={{ gridColumn: '1 / 14' }}>
                  <h2>{panel.heading}</h2>
                  {panel.content && (
                    <div className="blog__content-text" style={{ maxWidth: 'none', marginLeft: 0, marginRight: 0 }}>
                      <RichText content={panel.content} />
                    </div>
                  )}
                  {panel.buttonLabel && panel.buttonLink && (
                    <Button
                      variant="main"
                      href={panel.buttonLink}
                      icon={<ArrowIcon className="icon-16" />}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {panel.buttonLabel}
                    </Button>
                  )}
                </div>
                <div style={{ gridColumn: '15 / 25' }}>
                  {panel.mediaType === 'video' && panel.videoUrl ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '1rem', overflow: 'hidden' }}>
                      <iframe
                        src={panel.videoUrl}
                        title={panel.heading}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  ) : panelImage ? (
                    <Image
                      src={panelImage}
                      alt={panel.heading}
                      width={600}
                      height={400}
                      style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        <AboutUsBanner />
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

  // Fetch resource sidebar global for page content, fall back to defaults
  let sidebarItems: ResourceSidebarItem[] = DEFAULT_RESOURCES;
  if (resolved.type === 'page' || (resolved.type === 'popup' && resolved.doc.aboutPage)) {
    try {
      const payload = await getPayloadClient();
      const sidebar = await payload.findGlobal({ slug: 'resource-sidebar' }) as ResourceSidebarGlobal;
      if (sidebar.items && sidebar.items.length > 0) {
        sidebarItems = sidebar.items;
      }
    } catch {
      // Use default resources
    }
  }

  // If this is a popup with a parent page, render the parent page with the modal pre-opened
  if (resolved.type === 'popup' && resolved.doc.aboutPage) {
    const payload = await getPayloadClient();
    const [parentPages, allPopups] = await Promise.all([
      payload.find({ collection: 'pages', where: { slug: { equals: resolved.doc.aboutPage } }, limit: 1, depth: 2 }),
      payload.find({ collection: 'popups', where: { aboutPage: { equals: resolved.doc.aboutPage }, _status: { equals: 'published' } }, limit: 50, depth: 1 }),
    ]);
    const parentPage = parentPages.docs[0] as Page | undefined;
    if (parentPage) {
      return <PageContent page={parentPage} relatedPopups={allPopups.docs as Popup[]} resources={sidebarItems} initialPopupSlug={slug} />;
    }
  }

  switch (resolved.type) {
    case 'page':
      return <PageContent page={resolved.doc} relatedPopups={resolved.relatedPopups} resources={sidebarItems} />;
    case 'popup':
      return <PopupContent popup={resolved.doc} siblingPopups={resolved.siblingPopups} parentTitle={resolved.parentTitle} />;
    case 'product':
      return <ProductContent product={resolved.doc} />;
    case 'legal':
      return <LegalContent legal={resolved.doc} />;
  }
}
