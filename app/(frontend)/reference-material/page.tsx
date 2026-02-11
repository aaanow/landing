import { Metadata } from 'next';
import { getPayloadClient } from '@/src/payload';
import { Button } from '@/components/Button';
import { ArrowIcon } from '@/components/icons';
import type { Resource, ResourceChapter } from '@/types/cms';

// Revalidate every hour for standard content
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Reference Material - AAAnow',
};

// Icon component for section headers
const SectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="icon__64">
    <g clipPath="url(#clip0_554_1576)">
      <path d="M45.7139 62.1714C45.7139 63.1813 46.5325 64 47.5424 64H62.1714C63.1813 64 64 63.1813 64 62.1714V56.686C64 55.6761 63.1813 54.8574 62.1714 54.8574H47.5424C46.5325 54.8574 45.7139 55.6761 45.7139 56.686V62.1714ZM0 62.1714C0 63.1813 0.81868 64 1.82857 64H25.6001C26.61 64 27.4287 63.1813 27.4287 62.1714V54.8574H20.1147C19.1048 54.8574 18.2861 54.0387 18.2861 53.0289V45.7139H10.9711C9.96126 45.7139 9.14258 44.8952 9.14258 43.8853V36.5713H1.82857C0.81868 36.5713 0 37.39 0 38.3999V62.1714ZM27.4287 54.8574H34.7427C35.7526 54.8574 36.5713 54.0387 36.5713 53.0289V45.7139H27.4287V54.8574ZM36.5713 45.7139H43.8853C44.8952 45.7139 45.7139 44.8952 45.7139 43.8853V36.5713H38.3999C37.39 36.5713 36.5713 37.39 36.5713 38.3999V45.7139ZM18.2861 45.7139H27.4287V38.3999C27.4287 37.39 26.61 36.5713 25.6001 36.5713H18.2861V45.7139ZM45.7139 36.5713H53.0289C54.0387 36.5713 54.8574 35.7526 54.8574 34.7427V27.4287H47.5424C46.5325 27.4287 45.7139 28.2474 45.7139 29.2573V36.5713ZM9.14258 36.5713H18.2861V27.4287H10.9711C9.96126 27.4287 9.14258 28.2474 9.14258 29.2573V36.5713ZM36.5713 9.14258H43.8853C44.8952 9.14258 45.7139 9.96126 45.7139 10.9711V16.4576C45.7139 17.4675 46.5325 18.2861 47.5424 18.2861H53.0289C54.0387 18.2861 54.8574 19.1048 54.8574 20.1147V27.4287H62.1714C63.1813 27.4287 64 26.61 64 25.6001V10.9711C64 9.96126 63.1813 9.14258 62.1714 9.14258H56.686C55.6761 9.14258 54.8574 8.3239 54.8574 7.31401V1.82857C54.8574 0.818679 54.0387 0 53.0289 0H38.3999C37.39 0 36.5713 0.818679 36.5713 1.82857V9.14258ZM18.2861 27.4287H25.6001C26.61 27.4287 27.4287 26.61 27.4287 25.6001V18.2861H20.1147C19.1048 18.2861 18.2861 19.1048 18.2861 20.1147V27.4287ZM27.4287 18.2861H34.7427C35.7526 18.2861 36.5713 17.4675 36.5713 16.4576V9.14258H29.2573C28.2474 9.14258 27.4287 9.96126 27.4287 10.9711V18.2861Z" fill="currentColor"></path>
    </g>
  </svg>
);

// Icon mapping for resources
const getIconPath = (icon: string | null | undefined) => {
  const iconMap: Record<string, string> = {
    'user': '/images/icon-user-1.svg',
    'happy': '/images/icon-happy.svg',
    'face': '/images/icon-face.svg',
    'light-bulb': '/images/icon-light-bulb.svg',
    'museum': '/images/icon-musuem.svg',
    'search': '/images/icon-search.svg',
    'pdf': '/images/icon-pdf.svg',
  };
  return icon && iconMap[icon] ? iconMap[icon] : '/images/icon-light-bulb.svg';
};

// Get the link for a resource based on its type
const getResourceLink = (resource: Resource): string => {
  if (resource.externalLink) {
    return resource.externalLink;
  }
  if (resource.blogArticle) {
    return resource.blogArticle;
  }
  if (resource.pdf) {
    return resource.pdf;
  }
  return '#';
};

// Format resource type for display
const formatResourceType = (resource: Resource): string => {
  if (resource.tag) return resource.tag;
  if (resource.type === 'blog-post') return 'Blog Post';
  if (resource.type === 'external-link') return 'External Link';
  if (resource.pdf) return 'PDF';
  return 'Resource';
};

export default async function ReferenceMaterialPage() {
  const payload = await getPayloadClient();

  // Fetch all resources
  const resourcesResult = await payload.find({
    collection: 'resources',
    sort: 'order',
    limit: 100,
    depth: 1,
  });

  // Fetch all chapters
  const chaptersResult = await payload.find({
    collection: 'resource-chapters',
    sort: 'order',
    limit: 100,
  });

  const resources = resourcesResult.docs as Resource[];
  const chapters = chaptersResult.docs as ResourceChapter[];

  // Group resources by chapter
  const resourcesByChapter = new Map<string | null, Resource[]>();

  // Initialize with null for uncategorized resources
  resourcesByChapter.set(null, []);

  // Initialize each chapter
  chapters.forEach(chapter => {
    resourcesByChapter.set(chapter.id, []);
  });

  // Distribute resources to their chapters
  resources.forEach(resource => {
    const chapterId = typeof resource.chapter === 'object'
      ? resource.chapter?.id
      : resource.chapter;

    const existing = resourcesByChapter.get(chapterId ?? null) || [];
    existing.push(resource);
    resourcesByChapter.set(chapterId ?? null, existing);
  });

  return (
    <>
      {/* Main Resources Section */}
      <section className="section sticky">
        <div className="w-layout-blockcontainer container top-padding w-container">
          <div className="section__content-wrapper">
            <div className="section-header__wrapper">
              <SectionIcon />
              <h2>Reference Materials</h2>
              <div className="subheading__wrapper">
                <p className="body__xlarge">Discover how agencies leverage AiSC across their entire client lifecycle.</p>
              </div>
            </div>
            <div className="card-grid animate">
              <div className="resource-table">
                <div className="resource-table-header">
                  <span>Resource Name</span>
                  <span>Format</span>
                  <span>Description</span>
                </div>
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <div key={resource.id} className="resource-table-row">
                      <span className="resource-name">
                        <img src={getIconPath(resource.icon)} alt="" className="resource-icon" />
                        {resource.name}
                      </span>
                      <span className="resource-type">{formatResourceType(resource)}</span>
                      <span className="resource-snippet">{resource.snippet || '—'}</span>
                      <a href={getResourceLink(resource)} className="card__link w-inline-block"></a>
                    </div>
                  ))
                ) : (
                  <div className="w-dyn-empty">
                    <div>No resources found.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I Want To Section */}
      {(() => {
        const iWantToChapter = chapters.find(c => c.slug === 'i-want-to');
        const iWantToResources = iWantToChapter ? resourcesByChapter.get(iWantToChapter.id) || [] : [];

        if (!iWantToChapter || iWantToResources.length === 0) return null;

        return (
          <section id="i-want-to" className="section sticky">
            <div className="w-layout-blockcontainer container top-bottom-padding landing w-container">
              <div className="section__content-wrapper">
                <div className="section-header__wrapper">
                  <SectionIcon />
                  <h2>{iWantToChapter.name}</h2>
                  <div className="subheading__wrapper">
                    <p className="body__xlarge">Agencies use AiSC to support measurable outcomes across Marketing, Sales, and Client Services. AiSC identifies where value and risk are present today, highlights revenue opportunities in current and lapsed clients, and provides continuous oversight that strengthens retention and creates new billable work.</p>
                  </div>
                </div>
                <div className="card-grid animate">
                  <div className="resource-table">
                    <div className="resource-table-header">
                      <span>Resource Name</span>
                      <span>Format</span>
                      <span>Description</span>
                    </div>
                    {iWantToResources.map((resource) => (
                      <div key={resource.id} className="resource-table-row">
                        <span className="resource-name">
                          <img src={getIconPath(resource.icon)} alt="" className="resource-icon" />
                          {resource.name}
                        </span>
                        <span className="resource-type">{formatResourceType(resource)}</span>
                        <span className="resource-snippet">{resource.snippet || '—'}</span>
                        <a href={getResourceLink(resource)} className="card__link w-inline-block"></a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* CTA Section */}
      <section className="section sticky last">
        <div className="w-layout-blockcontainer container top-bottom-padding landing w-container">
          <div className="section__content-wrapper light-green">
            <div className="section-header__wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="icon__64">
                <path d="M54.8574 45.7139V53.0289C54.8574 54.0387 54.0387 54.8574 53.0289 54.8574H20.1147C19.1048 54.8574 18.2861 54.0387 18.2861 53.0289V47.5424C18.2861 46.5325 19.1048 45.7139 20.1147 45.7139H54.8574ZM64 43.8853C64 44.8952 63.1813 45.7139 62.1714 45.7139H54.8574V38.3999C54.8574 37.39 55.6761 36.5713 56.686 36.5713H62.1714C63.1813 36.5713 64 37.39 64 38.3999V43.8853ZM27.4287 7.31401C27.4287 8.3239 26.61 9.14258 25.6001 9.14258H20.1147C19.1048 9.14258 18.2861 9.96126 18.2861 10.9711V25.6001C18.2861 26.61 17.4675 27.4287 16.4576 27.4287H10.9711C9.96126 27.4287 9.14258 26.61 9.14258 25.6001V10.9711C9.14258 9.96126 8.3239 9.14258 7.31401 9.14258H1.82857C0.818679 9.14258 0 8.3239 0 7.31401V1.82857C0 0.818679 0.818679 0 1.82857 0H25.6001C26.61 0 27.4287 0.818679 27.4287 1.82857V7.31401ZM45.7139 25.6001C45.7139 26.61 44.8952 27.4287 43.8853 27.4287H38.3999C37.39 27.4287 36.5713 26.61 36.5713 25.6001V20.1147C36.5713 19.1048 37.39 18.2861 38.3999 18.2861H45.7139V25.6001ZM64 25.6001C64 26.61 63.1813 27.4287 62.1714 27.4287H56.686C55.6761 27.4287 54.8574 26.61 54.8574 25.6001V18.2861H62.1714C63.1813 18.2861 64 19.1048 64 20.1147V25.6001ZM54.8574 18.2861H45.7139V10.9711C45.7139 9.96126 46.5325 9.14258 47.5424 9.14258H53.0289C54.0387 9.14258 54.8574 9.96126 54.8574 10.9711V18.2861Z" fill="currentColor"></path>
              </svg>
              <h2>Transform Client Retention</h2>
              <div className="subheading__wrapper">
                <p className="body__xlarge">Join agencies who are turning oversight into revenue.<br />Monitor fundamentals, show value, and convert insights into paid work.</p>
                <Button
                  variant="primary"
                  href="#"
                  data-modal-open="get-started"
                  icon={<ArrowIcon className="icon-16 green" />}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
