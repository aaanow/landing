import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';
import type { FooterGlobal, FooterLink as FooterLinkType, LegalPage } from '@/types/cms';
import { FooterAccordion } from './FooterAccordion';

const collectionPrefixes: Record<string, string> = {
  pages: '',
  popups: '',
  legals: '',
  scorecards: '/scorecards',
  posts: '/posts',
  products: '',
};

function resolveFooterLinkHref(link: FooterLinkType): { href: string; external: boolean } {
  if (link.linkType === 'external') {
    return { href: link.url || '#', external: true };
  }

  if (link.reference && typeof link.reference.value === 'object') {
    const { relationTo, value } = link.reference;
    if (relationTo === 'scorecards' && value.link) {
      return { href: value.link, external: true };
    }
    const prefix = collectionPrefixes[relationTo] || '';
    return { href: `${prefix}/${value.slug}`, external: false };
  }

  return { href: '#', external: false };
}

function FooterLink({ href, children, external, indent, small }: { href: string; children: React.ReactNode; external?: boolean; indent?: boolean; small?: boolean }) {
  const size = small ? '!text-[11px] md:!text-sm !leading-[16px] md:!leading-5' : '!text-[16px] !leading-[22px]';
  const classes = `!text-white/80 !no-underline font-body !font-normal ${size} py-[0.15rem] block hover:!text-white transition-colors${indent ? ' border-l border-white/30 pl-4' : ''}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export async function Footer() {
  let footer: FooterGlobal = {};
  let legalPages: LegalPage[] = [];

  try {
    const payload = await getPayloadClient();
    const [footerGlobal, legalsResult] = await Promise.all([
      payload.findGlobal({ slug: 'footer' }),
      payload.find({
        collection: 'legals',
        where: { _status: { equals: 'published' } },
        sort: 'name',
        limit: 50,
      }),
    ]);
    footer = footerGlobal as FooterGlobal;
    legalPages = legalsResult.docs as LegalPage[];
  } catch (error) {
    console.error('Footer: Failed to fetch footer data:', error);
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
    <section className="flex justify-center w-full px-6 md:px-0 pb-6">
      <div className="bg-linear-to-b from-[#004452] to-[#002B33] text-neutral-0 rounded-[2rem] md:rounded-[4rem] flex flex-col w-full max-w-[1440px] pt-12 md:pt-16 pb-12 md:pb-16 relative px-6 md:px-12 lg:px-16">
        {/* Link groups: row on desktop, accordion stack on mobile */}
        <div className="flex flex-col md:flex-row md:gap-6 gap-0 w-full">
          {linkGroups.map((group, i) => (
            <FooterAccordion key={group.id} title={group.title}>
              {group.links?.map((link) => {
                const { href, external } = resolveFooterLinkHref(link);
                return (
                  <FooterLink key={link.id} href={href} external={external} indent={link.indent}>
                    {link.label}
                  </FooterLink>
                );
              })}
              {i === 0 && (
                <button
                  type="button"
                  data-contact-modal-open
                  className="!text-white/80 !no-underline font-body !font-normal !text-[16px] !leading-[22px] py-[0.15rem] block hover:!text-white transition-colors cursor-pointer bg-transparent text-left"
                  style={{ border: 'none', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem' }}
                >
                  Contact us
                </button>
              )}
            </FooterAccordion>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 mt-12 md:mt-16 pt-8 w-full flex flex-col md:flex-row md:gap-8 gap-6 md:items-start">
          {/* Left: disclaimer + legal links + copyright */}
          <div className="flex flex-col gap-6 md:flex-[3] order-2 md:order-1">
            {disclaimerText && (
              <p className="!text-white/60 !text-[11px] md:!text-sm !leading-[16px] md:!leading-5">
                {disclaimerText}
              </p>
            )}
            {legalPages.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {legalPages.map((legal) => (
                  <FooterLink key={legal.id} href={`/${legal.slug}`} small>
                    {legal.name}
                  </FooterLink>
                ))}
              </div>
            )}
          </div>

          {/* Right: logo, attribution, copyright */}
          <div className="flex flex-col gap-3 items-start md:flex-[1] order-1 md:order-2">
            {logo && (
              <Image
                src={logo}
                alt="AAAnow Logo"
                width={220}
                height={55}
                className="h-auto max-w-[13.75rem]"
              />
            )}
            {attributionText && attributionLink && (
              <FooterLink href={attributionLink} external small>
                {attributionText}
              </FooterLink>
            )}
            {copyrightText && (
              <div className="!text-white/60 !text-[11px] md:!text-sm !leading-[16px] md:!leading-5">
                {copyrightText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
