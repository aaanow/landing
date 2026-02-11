import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';
import type { FooterGlobal } from '@/types/cms';

interface FooterLinkGroupProps {
  title: string;
  children: React.ReactNode;
}

function FooterLinkGroup({ title, children }: FooterLinkGroupProps) {
  return (
    <div className="footer__group flex flex-col gap-2">
      <h5 className="footer-heading">{title}</h5>
      <div className="footer__link-list flex flex-col gap-1">{children}</div>
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
  let footer: FooterGlobal = {};

  try {
    const payload = await getPayloadClient();
    footer = await payload.findGlobal({ slug: 'footer' }) as FooterGlobal;
  } catch (error) {
    console.error('Footer: Failed to fetch footer global:', error);
  }

  const {
    linkGroups = [],
    disclaimerText,
    copyrightText,
    logo,
    attributionText,
    attributionLink,
  } = footer;

  return (
    <section className="footer">
      <div className="container">
        <div className="footer__link-container">
          {linkGroups.map((group) => (
            <FooterLinkGroup key={group.id} title={group.title}>
              {group.links?.map((link) => (
                <FooterLink key={link.id} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterLinkGroup>
          ))}
        </div>

        <div className="spacer-vertical" />

        <div className="footer__bottom">
          <div className="footer__disclaimer" style={{ gridArea: 'span 1 / span 3 / span 1 / span 3' }}>
            {disclaimerText && (
              <p className="footer__text long">
                {disclaimerText}
              </p>
            )}
            {copyrightText && (
              <div className="footer__link copyright">
                {copyrightText}
              </div>
            )}
          </div>
          <div className="footer__branding" style={{ gridArea: 'span 1 / span 1 / span 1 / span 1' }}>
            {logo && (
              <Image
                src={logo}
                alt="AAAnow Logo"
                width={120}
                height={30}
                className="footer__logo"
              />
            )}
            {attributionText && attributionLink && (
              <div className="footer__attribution">
                <FooterLink href={attributionLink} external>
                  {attributionText}
                </FooterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
