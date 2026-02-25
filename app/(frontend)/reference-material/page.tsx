import { Metadata } from 'next';
import { getPayloadClient } from '@/src/payload';
import { Button } from '@/components/Button';
import { ArrowIcon } from '@/components/icons';
import { ReferenceContent } from '@/components/ReferenceContent';
import type { Resource } from '@/types/cms';

// Fallback revalidation; on-demand revalidation handles immediate updates
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Reference Material - AAAnow',
  description: 'Browse reference materials, resources, and guides to help you get the most out of AAAnow and AiSC.',
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

  const resources = resourcesResult.docs as Resource[];

  return (
    <>
      {/* Main Resources Section */}
      <section className="section reference-section">
        <div className="container top-padding">
          <div className="section-header__wrapper hero-animate hero-animate-delay-1">
            <h1>Reference Materials</h1>
          </div>

          <div className="section__content-wrapper hero-animate hero-animate-delay-2">
            <ReferenceContent resources={resources} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section last">
        <div className="container top-bottom-padding landing">
          <div className="section__content-wrapper light-green">
            <div className="section-header__wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="icon__64">
                <path d="M54.8574 45.7139V53.0289C54.8574 54.0387 54.0387 54.8574 53.0289 54.8574H20.1147C19.1048 54.8574 18.2861 54.0387 18.2861 53.0289V47.5424C18.2861 46.5325 19.1048 45.7139 20.1147 45.7139H54.8574ZM64 43.8853C64 44.8952 63.1813 45.7139 62.1714 45.7139H54.8574V38.3999C54.8574 37.39 55.6761 36.5713 56.686 36.5713H62.1714C63.1813 36.5713 64 37.39 64 38.3999V43.8853ZM27.4287 7.31401C27.4287 8.3239 26.61 9.14258 25.6001 9.14258H20.1147C19.1048 9.14258 18.2861 9.96126 18.2861 10.9711V25.6001C18.2861 26.61 17.4675 27.4287 16.4576 27.4287H10.9711C9.96126 27.4287 9.14258 26.61 9.14258 25.6001V10.9711C9.14258 9.96126 8.3239 9.14258 7.31401 9.14258H1.82857C0.818679 9.14258 0 8.3239 0 7.31401V1.82857C0 0.818679 0.818679 0 1.82857 0H25.6001C26.61 0 27.4287 0.818679 27.4287 1.82857V7.31401ZM45.7139 25.6001C45.7139 26.61 44.8952 27.4287 43.8853 27.4287H38.3999C37.39 27.4287 36.5713 26.61 36.5713 25.6001V20.1147C36.5713 19.1048 37.39 18.2861 38.3999 18.2861H45.7139V25.6001ZM64 25.6001C64 26.61 63.1813 27.4287 62.1714 27.4287H56.686C55.6761 27.4287 54.8574 26.61 54.8574 25.6001V18.2861H62.1714C63.1813 18.2861 64 19.1048 64 20.1147V25.6001ZM54.8574 18.2861H45.7139V10.9711C45.7139 9.96126 46.5325 9.14258 47.5424 9.14258H53.0289C54.0387 9.14258 54.8574 9.96126 54.8574 10.9711V18.2861Z" fill="currentColor"></path>
              </svg>
              <h2>Transform Client Retention</h2>
              <div className="subheading__wrapper">
                <p className="body__xlarge">Join agencies who are turning oversight into revenue.<br />Monitor fundamentals, show value, and convert insights into paid work.</p>
                <Button
                  variant="main"
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
