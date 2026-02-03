import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';

interface BaseItem {
  id: string;
  name: string;
  slug: string;
  status?: string;
}

interface Popup extends BaseItem {
  aboutPage?: string;
}

interface Scorecard extends BaseItem {
  link?: string;
}

interface Resource extends BaseItem {
  externalLink?: string;
  blogArticle?: string;
  type?: string;
}

interface Legal extends BaseItem {
  order?: number;
}

interface FooterLinkGroupProps {
  title: string;
  children: React.ReactNode;
}

function FooterLinkGroup({ title, children }: FooterLinkGroupProps) {
  return (
    <div className="footer__group">
      <h5 className="footer-heading">{title}</h5>
      <div className="footer__link-list">{children}</div>
    </div>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  if (external) {
    return (
      <a href={href} className="footer__link" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="footer__link">
      {children}
    </Link>
  );
}

export async function Footer() {
  let popups: Popup[] = [];
  let scorecards: Scorecard[] = [];
  let resources: Resource[] = [];
  let legals: Legal[] = [];

  try {
    const payload = await getPayloadClient();
    const [popupsResult, scorecardsResult, resourcesResult, legalsResult] = await Promise.all([
      payload.find({ collection: 'popups', where: { status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'scorecards', where: { status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'resources', limit: 100, sort: 'order' }),
      payload.find({ collection: 'legals', where: { status: { equals: 'published' } }, limit: 100, sort: 'order' }),
    ]);

    popups = popupsResult.docs as Popup[];
    scorecards = scorecardsResult.docs as Scorecard[];
    resources = resourcesResult.docs as Resource[];
    legals = legalsResult.docs as Legal[];
  } catch (error) {
    console.error('Footer: Failed to fetch CMS data:', error);
  }

  const aboutPopups = popups.filter(p => p.aboutPage === 'about-us');
  const aiscPopups = popups.filter(p =>
    ['aisc', 'aod---ai-for-agency-growth', 'lifecycle-alignment'].includes(p.aboutPage || '')
  );
  const footerResources = resources
    .filter(r => r.type === 'external-link' || r.type === 'blog-post' || r.externalLink || r.blogArticle)
    .slice(0, 8);

  return (
    <section className="footer">
      <div className="container">
        <div className="footer__link-container">
          <FooterLinkGroup title="About AAAnow">
            <FooterLink href="/about/about-us">About us</FooterLink>
            {aboutPopups.map(popup => (
              <FooterLink key={popup.id} href={`/about/${popup.slug}`}>
                {popup.name}
              </FooterLink>
            ))}
            <FooterLink href="/our-capability">Our capability</FooterLink>
            <FooterLink href="https://www.linkedin.com/company/aaanow" external>
              LinkedIn
            </FooterLink>
          </FooterLinkGroup>

          <FooterLinkGroup title="AiSC">
            <FooterLink href="/about/aisc">AiSC Introduction</FooterLink>
            {aiscPopups.map(popup => (
              <FooterLink key={popup.id} href={`/about/${popup.slug}`}>
                {popup.name}
              </FooterLink>
            ))}
          </FooterLinkGroup>

          <FooterLinkGroup title="Public scorecards">
            <FooterLink href="/scorecards">Introduction</FooterLink>
            {scorecards.map(scorecard => (
              <FooterLink key={scorecard.id} href={scorecard.link || `/scorecards/${scorecard.slug}`}>
                {scorecard.name}
              </FooterLink>
            ))}
          </FooterLinkGroup>

          <FooterLinkGroup title="Resources">
            <FooterLink href="/reference-material">All Reference Materials</FooterLink>
            {footerResources.map(resource => (
              <FooterLink
                key={resource.id}
                href={resource.externalLink || resource.blogArticle || `/resources/${resource.slug}`}
              >
                {resource.name}
              </FooterLink>
            ))}
            <FooterLink href="/reference-material#i-want-to">I want to...</FooterLink>
          </FooterLinkGroup>

          <FooterLinkGroup title="Legal">
            {legals.map(legal => (
              <FooterLink key={legal.id} href={`/legal/${legal.slug}`}>
                {legal.name}
              </FooterLink>
            ))}
          </FooterLinkGroup>
        </div>

        <div className="spacer-vertical" />

        <div className="footer__bottom">
          <div className="div-block-77">
            <p className="footer__text long">
              This website, all of its content and any/all documents offered directly or
              otherwise, should be considered as introduction, an overview and a starting
              point only – it should not be used as a single, sole authoritative guide. You
              should not consider this legal guidance.
              <br /><br />
              The services provided by AAAnow are based on general best practices and on
              audits of the available areas of websites at a point in time. Sections of the
              site that are not open to public access or are not being served (possibly due
              to site errors or downtime) may not be covered by our reports.
              <br /><br />
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
              <FooterLink href="https://willneeteson.com" external>
                Website by SOWN
              </FooterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
