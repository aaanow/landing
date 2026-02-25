import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';
import type { FooterGlobal, FooterLink as FooterLinkType, LegalPage } from '@/types/cms';

const collectionPrefixes: Record<string, string> = {
  pages: '',
  popups: '',
  legals: '',
  scorecards: '/scorecards',
  posts: '/posts',
};

function resolveFooterLinkHref(link: FooterLinkType): { href: string; external: boolean } {
  if (link.linkType === 'external') {
    return { href: link.url || '#', external: true };
  }

  if (link.reference && typeof link.reference.value === 'object') {
    const { relationTo, value } = link.reference;
    // Scorecards can have an external link field
    if (relationTo === 'scorecards' && value.link) {
      return { href: value.link, external: true };
    }
    const prefix = collectionPrefixes[relationTo] || '';
    return { href: `${prefix}/${value.slug}`, external: false };
  }

  return { href: '#', external: false };
}

interface FooterLinkGroupProps {
  title: string;
  children: React.ReactNode;
}

function FooterLinkGroup({ title, children }: FooterLinkGroupProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 justify-start items-start w-full max-md:flex-none max-md:w-[49%] max-md:mt-4 max-sm:flex-1 max-sm:w-[48%] max-sm:min-w-[40%]">
      <h5 className="font-heading !font-bold !text-[20px] !leading-[28px] !text-[#d2f9c5]">{title}</h5>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function FooterLink({ href, children, external, indent, className = '' }: { href: string; children: React.ReactNode; external?: boolean; indent?: boolean; className?: string }) {
  const baseClasses = `!text-white/80 !no-underline font-body !font-normal !text-[16px] !leading-[22px] flex-none py-[0.15rem] block hover:!text-white${indent ? ' border-l border-white/30 pl-4' : ''}`;

  if (external) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${baseClasses} ${className}`}>
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
    <section className="bg-linear-to-b from-[#004452] to-[#002B33] text-neutral-0 rounded-t-[4rem] max-md:rounded-t-[2rem] flex flex-col gap-8 max-sm:gap-0 w-full pt-16 max-sm:pt-12 max-sm:px-1 pb-12 relative">
      <div className="container">
        <div className="flex flex-row gap-[var(--_sizing---gap-m)] w-full max-md:flex-wrap max-md:gap-2 max-sm:gap-4">
          {linkGroups.map((group) => (
            <FooterLinkGroup key={group.id} title={group.title}>
              {group.links?.map((link) => {
                const { href, external } = resolveFooterLinkHref(link);
                return (
                  <FooterLink key={link.id} href={href} external={external} indent={link.indent}>
                    {link.label}
                  </FooterLink>
                );
              })}
            </FooterLinkGroup>
          ))}
        </div>

        <div className="h-16" />

        <div className="border-t border-white/10 pt-8 w-full max-md:flex max-md:flex-col max-md:gap-2" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <div className="flex flex-col gap-6">
            {disclaimerText && (
              <p className="text-white/60 flex-1 text-sm max-w-[900px]" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                {disclaimerText}
              </p>
            )}
            {copyrightText && (
              <div className="text-white/60 text-base mt-12">
                {copyrightText}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 justify-start self-start items-start w-full max-w-[500px]">
            {logo && (
              <Image
                src={logo}
                alt="AAAnow Logo"
                width={120}
                height={30}
                className="w-full h-auto" style={{ maxWidth: '13.75rem' }}
              />
            )}
            {legalPages.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {legalPages.map((legal) => (
                  <FooterLink key={legal.id} href={`/${legal.slug}`}>
                    {legal.name}
                  </FooterLink>
                ))}
              </div>
            )}
            {attributionText && attributionLink && (
              <div className="flex flex-col items-start w-full">
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
