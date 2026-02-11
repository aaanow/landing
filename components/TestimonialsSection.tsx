import { getPayloadClient } from '@/src/payload';
import type { TestimonialsGlobal } from '@/types/cms';
import { getMediaUrl } from '@/types/cms';
import { Button } from './Button';

function SectionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 350 350" fill="none" className="icon__64">
      <g clipPath="url(#clip0_293_1600)">
        <path d="M200 340C200 345.523 195.523 350 190 350H160C154.477 350 150 345.523 150 340V300H200V340ZM150 300H110C104.477 300 100 295.523 100 290V250H140C145.523 250 150 254.477 150 260V300ZM300 240C300 245.523 295.523 250 290 250H260C254.477 250 250 254.477 250 260V290C250 295.523 245.523 300 240 300H200V253.5C200 247.977 204.477 243.5 210 243.5H240C245.523 243.5 250 239.023 250 233.5V210C250 204.477 254.477 200 260 200H300V240ZM100 250H60C54.4772 250 50 245.523 50 240V200H90C95.5229 200 100 204.477 100 210V250ZM50 200H10C4.47715 200 0 195.523 0 190V60C0 54.4772 4.47715 50 10 50H50V200ZM350 190C350 195.523 345.523 200 340 200H300V50H340C345.523 50 350 54.4772 350 60V190ZM200 90C200 95.5229 195.523 100 190 100H160C154.477 100 150 95.5229 150 90V50H200V90ZM150 50H50V10C50 4.47715 54.4772 0 60 0H140C145.523 0 150 4.47715 150 10V50ZM300 50H200V10C200 4.47715 204.477 0 210 0H290C295.523 0 300 4.47715 300 10V50Z" fill="currentColor" />
      </g>
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 80 80" fill="none" className="testimonial__quote-img">
      <path d="M53.7141 33.7899C53.714 34.7999 54.5327 35.6187 55.5426 35.6187H70.1714C71.1813 35.6187 72 36.4373 72 37.4472V61.2188C72 62.2287 71.1813 63.0474 70.1714 63.0474H46.3999C45.39 63.0474 44.5713 62.2287 44.5713 61.2188V28.3037C44.5713 27.2938 45.39 26.4751 46.3999 26.4751H53.7148L53.7141 33.7899ZM17.1426 26.4761V33.7892C17.1426 34.7991 17.9612 35.6177 18.9711 35.6178L33.6002 35.6186C34.6101 35.6186 35.4287 36.4373 35.4287 37.4471V61.2178C35.4287 62.2277 34.61 63.0464 33.6001 63.0464H9.82857C8.81868 63.0464 8 62.2277 8 61.2178V28.3039C8 27.2939 8.8188 26.4752 9.82877 26.4753L17.1426 26.4761ZM26.2854 24.6477C26.2852 25.6575 25.4666 26.4761 24.4568 26.4761H17.1426V19.1611C17.1426 18.1512 17.9613 17.3325 18.9711 17.3325H24.4574C25.4673 17.3325 26.286 18.1513 26.2859 19.1613L26.2854 24.6477ZM62.8574 24.6465C62.8574 25.6564 62.0387 26.4751 61.0289 26.4751H53.7148V19.1611C53.7148 18.1512 54.5335 17.3325 55.5434 17.3325H61.0289C62.0387 17.3325 62.8574 18.1512 62.8574 19.1611V24.6465Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 17" fill="none" className="icon-16">
      <path d="M9.18563 14.6168C9.43803 14.6169 9.64258 14.8216 9.64258 15.074V16.445C9.64258 16.6975 9.43791 16.9022 9.18544 16.9022H7.81456C7.56209 16.9022 7.35742 16.6975 7.35742 16.445V15.0734C7.35742 14.8208 7.56221 14.6161 7.81476 14.6163L9.18563 14.6168ZM11.9287 14.1589C11.9287 14.4114 11.724 14.6161 11.4716 14.6161H10.0997C9.84725 14.6161 9.64258 14.4114 9.64258 14.1589V12.788C9.64258 12.5356 9.84725 12.3309 10.0997 12.3309H11.9287V14.1589ZM16.5 9.58763C16.5 9.8401 16.2953 10.0448 16.0429 10.0448H14.6718C14.4194 10.0448 14.2148 10.2493 14.2146 10.5017L14.2141 11.874C14.214 12.1264 14.0093 12.3309 13.7569 12.3309H11.9287V10.0448H13.7567C14.0092 10.0448 14.2139 9.8401 14.2139 9.58763V7.75961H16.0429C16.2953 7.75961 16.5 7.96428 16.5 8.21676V9.58763ZM11.9287 10.0448H0.957143C0.70467 10.0448 0.5 9.8401 0.5 9.58763V8.21676C0.5 7.96428 0.70467 7.75961 0.957143 7.75961H11.9287V10.0448ZM14.2139 7.75961H11.9287V5.47348H13.7575C14.0101 5.47348 14.2148 5.67827 14.2146 5.93082L14.2139 7.75961ZM11.4718 3.18813C11.7242 3.18824 11.9287 3.39287 11.9287 3.64527V5.47348H10.0997C9.84725 5.47348 9.64258 5.26881 9.64258 5.01634V3.64469C9.64258 3.39214 9.84737 3.18743 10.0999 3.18754L11.4718 3.18813ZM9.64258 2.73118C9.64258 2.98365 9.43791 3.18832 9.18544 3.18832H7.81456C7.56209 3.18832 7.35742 2.98365 7.35742 2.73118V1.35933C7.35742 1.10686 7.56209 0.902191 7.81456 0.902191H9.18544C9.43791 0.902191 9.64258 1.10686 9.64258 1.35933V2.73118Z" fill="currentColor" />
    </svg>
  );
}

export async function TestimonialsSection() {
  let data: TestimonialsGlobal = {};

  try {
    const payload = await getPayloadClient();
    data = await payload.findGlobal({ slug: 'testimonials' }) as TestimonialsGlobal;
  } catch (error) {
    console.error('TestimonialsSection: Failed to fetch global:', error);
  }

  const {
    heading = 'Where we deliver confidence',
    subheading = 'Discover how agencies leverage AiSC across their entire client lifecycle.',
    caseStudies = [],
    clientLogosHeading = "Who's talking about us",
    clientLogos = [],
  } = data;

  return (
    <section data-background="dark" className="section sticky">
      <div className="container top-bottom-padding landing">
        <div className="section__content-wrapper dark-green">
          <div className="section-header__wrapper">
            <SectionIcon />
            <h2>{heading}</h2>
            <div className="subheading__wrapper">
              <p className="body__xlarge">{subheading}</p>
            </div>
          </div>

          {caseStudies.length > 0 ? (
            <div className="testimonial__collection-list-wrapper animate collection-list">
              <div role="list" className="testimonial__collection-list collection-items">
                {caseStudies.map((study) => {
                  const logoUrl = getMediaUrl(study.logo);
                  const imageUrl = getMediaUrl(study.image);
                  const imageAlt = study.image && typeof study.image === 'object' ? study.image.alt : '';
                  return (
                    <div key={study.id} role="listitem" className="testimonial__item collection-item">
                      <div className="grid card">
                        <div className="testimonial__content-wrapper" style={{ gridArea: '1 / 1 / 2 / 17', alignSelf: 'end' }}>
                          <div className="testimonial___quote-wrapper">
                            <QuoteIcon />
                            <blockquote className="testimonial__quote">{study.quote}</blockquote>
                          </div>
                          <div className="testimonial__content-footer">
                            {logoUrl && (
                              <div className="testimonial__logo-wrapper">
                                <img src={logoUrl} loading="lazy" alt="" className="testimonial__logo" />
                              </div>
                            )}
                            {study.linkHref && (
                              <Button
                                variant="ghost"
                                href={study.linkHref}
                                icon={<ArrowRightIcon />}
                              >
                                {study.linkLabel || 'Open casestudy'}
                              </Button>
                            )}
                          </div>
                        </div>
                        {imageUrl && (
                          <div className="testimonial__img-wrapper" style={{ gridArea: '1 / 18 / 2 / 25' }}>
                            <img src={imageUrl} loading="lazy" alt={imageAlt} className="testimonial__img" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="testimonial__collection-list-wrapper animate collection-list">
              <div className="collection-empty">
                <div>No items found.</div>
              </div>
            </div>
          )}

          <div className="div-block-147">
            <h3>{clientLogosHeading}</h3>
            {clientLogos.length > 0 ? (
              <div className="logo__list-wrapper collection-list">
                <div role="list" className="logo__list collection-items">
                  {clientLogos.map((logo) => {
                    const logoUrl = getMediaUrl(logo.image);
                    if (!logoUrl) return null;
                    const mediaAlt = typeof logo.image === 'object' ? logo.image.alt : '';
                    const alt = logo.alt || mediaAlt || '';
                    return (
                      <div key={logo.id} role="listitem" className="log__item collection-item">
                        {logo.link ? (
                          <a href={logo.link} target="_blank" rel="noopener noreferrer">
                            <img alt={alt} loading="lazy" src={logoUrl} className="client__img-copy" />
                          </a>
                        ) : (
                          <img alt={alt} loading="lazy" src={logoUrl} className="client__img-copy" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="logo__list-wrapper collection-list">
                <div className="collection-empty">
                  <div>No items found.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
