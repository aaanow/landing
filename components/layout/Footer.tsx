import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';

interface Popup {
  id: string;
  name: string;
  slug: string;
  aboutPage?: string;
  status?: string;
}

interface Scorecard {
  id: string;
  name: string;
  slug: string;
  link?: string;
  status?: string;
}

interface Resource {
  id: string;
  name: string;
  slug: string;
  externalLink?: string;
  blogArticle?: string;
  type?: string;
}

interface Legal {
  id: string;
  name: string;
  slug: string;
  order?: number;
  status?: string;
}

export async function Footer() {
  const payload = await getPayloadClient();

  // Fetch popups for About AAAnow and AiSC sections
  const popupsResult = await payload.find({
    collection: 'popups',
    where: { status: { equals: 'published' } },
    limit: 100,
  });
  const popups = popupsResult.docs as Popup[];

  // Fetch scorecards
  const scorecardsResult = await payload.find({
    collection: 'scorecards',
    where: { status: { equals: 'published' } },
    limit: 100,
  });
  const scorecards = scorecardsResult.docs as Scorecard[];

  // Fetch resources
  const resourcesResult = await payload.find({
    collection: 'resources',
    limit: 100,
    sort: 'order',
  });
  const resources = resourcesResult.docs as Resource[];

  // Fetch legals
  const legalsResult = await payload.find({
    collection: 'legals',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: 'order',
  });
  const legals = legalsResult.docs as Legal[];

  // Group popups by aboutPage
  const aboutPopups = popups.filter(p => p.aboutPage === 'about-us');
  const aiscPopups = popups.filter(p =>
    p.aboutPage === 'aisc' ||
    p.aboutPage === 'aod---ai-for-agency-growth' ||
    p.aboutPage === 'lifecycle-alignment'
  );

  // Filter resources for footer (exclude draft types)
  const footerResources = resources.filter(r =>
    r.type === 'external-link' || r.type === 'blog-post' || r.externalLink || r.blogArticle
  ).slice(0, 8);

  return (
    <section className="footer">
      <div className="container">
        <div className="footer__link-container">
          <div className="footer__group">
            <h5 className="footer-heading">About AAAnow</h5>
            <div className="footer__link-list">
              <Link href="/about/about-us" className="footer__link">
                About us
              </Link>
              {aboutPopups.map((popup) => (
                <Link
                  key={popup.id}
                  href={`/about/${popup.slug}`}
                  className="footer__link"
                >
                  {popup.name}
                </Link>
              ))}
              <Link href="/our-capability" className="footer__link">
                Our capability
              </Link>
              <a
                href="https://www.linkedin.com/company/aaanow"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">AiSC</h5>
            <div className="footer__link-list">
              <Link href="/about/aisc" className="footer__link">
                AiSC Introduction
              </Link>
              {aiscPopups.map((popup) => (
                <Link
                  key={popup.id}
                  href={`/about/${popup.slug}`}
                  className="footer__link"
                >
                  {popup.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Public scorecards</h5>
            <div className="footer__link-list">
              <Link href="/scorecards" className="footer__link">
                Introduction
              </Link>
              {scorecards.map((scorecard) => (
                <Link
                  key={scorecard.id}
                  href={scorecard.link || `/scorecards/${scorecard.slug}`}
                  className="footer__link"
                >
                  {scorecard.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Resources</h5>
            <div className="footer__link-list">
              <Link href="/reference-material" className="footer__link">
                All Reference Materials
              </Link>
              {footerResources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.externalLink || resource.blogArticle || `/resources/${resource.slug}`}
                  className="footer__link"
                >
                  {resource.name}
                </Link>
              ))}
              <Link href="/reference-material#i-want-to" className="footer__link">
                I want to...
              </Link>
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Legal</h5>
            <div className="footer__link-list">
              {legals.map((legal) => (
                <Link
                  key={legal.id}
                  href={`/legal/${legal.slug}`}
                  className="footer__link"
                >
                  {legal.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="spacer-vertical" />

        <div className="footer__bottom">
          <div className="div-block-77">
            <p className="footer__text long">
              This website, all of its content and any/all documents offered directly or
              otherwise, should be considered as introduction, an overview and a starting
              point only – it should not be used as a single, sole authoritative guide. You
              should not consider this legal guidance.
              <br />
              <br />
              The services provided by AAAnow are based on general best practices and on
              audits of the available areas of websites at a point in time. Sections of the
              site that are not open to public access or are not being served (possibly due
              to site errors or downtime) may not be covered by our reports.
              <br />
              <br />
              Where matters of legal compliance are concerned you should always take
              independent advice from appropriately qualified individuals or firms.
            </p>
            <div className="footer__link copyrigtt">
              © 2026 AAAnow.al Limited All rights reserved.
            </div>
          </div>
          <div className="div-block-74">
            <Image
              src="/images/aaanow_logo.svg"
              alt="AAAnow Logo"
              width={120}
              height={30}
              className="footer__logo-copy"
            />
            <div className="div-block-82">
              <a
                href="https://willneeteson.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website by SOWN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
