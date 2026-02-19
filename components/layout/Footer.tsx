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
    <div className="flex flex-col gap-2 flex-1 justify-start items-start w-full max-md:flex-none max-md:w-[49%] max-md:mt-4 max-sm:flex-1 max-sm:w-[48%] max-sm:min-w-[40%]">
      <h5 className="text-button">{title}</h5>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function FooterLink({ href, children, external, indent, className = '' }: { href: string; children: React.ReactNode; external?: boolean; indent?: boolean; className?: string }) {
  const baseClasses = `!text-white/80 !no-underline text-lg leading-normal flex-none py-[0.15rem] block hover:!text-white${indent ? ' border-l border-white/30 pl-4' : ''}`;

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
    <section className="bg-linear-to-b from-[#004452] to-[#002B33] text-neutral-0 rounded-t-[4rem] max-md:rounded-t-[2rem] flex flex-col gap-8 max-sm:gap-0 w-full pt-16 max-sm:pt-12 max-sm:px-1 pb-12 relative">
      <div className="container">
        <div className="flex flex-row gap-[var(--_sizing---gap-m)] w-full max-md:flex-wrap max-md:gap-2 max-sm:gap-4">
          {linkGroups.map((group) => (
            <FooterLinkGroup key={group.id} title={group.title}>
              {group.links?.map((link) => (
                <FooterLink key={link.id} href={link.href} external={link.external} indent={link.indent}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterLinkGroup>
          ))}
        </div>

        <div className="h-16" />

        <div className="grid grid-cols-4 gap-8 border-t border-white/10 pt-8 items-center w-full max-md:flex max-md:flex-col max-md:gap-2 max-sm:flex max-sm:flex-col">
          <div className="flex flex-col gap-6" style={{ gridColumn: 'span 3 / span 3' }}>
            {disclaimerText && (
              <p className="text-white/60 flex-1 text-base max-w-[900px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
                className="w-full max-w-[200px] h-auto"
              />
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
