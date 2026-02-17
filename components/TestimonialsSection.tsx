import { getPayloadClient } from '@/src/payload'
import type { TestimonialsGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'
import { Button } from './Button'
import { TestimonialsIcon, QuoteIcon, ArrowIcon } from './icons'

export async function TestimonialsSection() {
  let data: TestimonialsGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'testimonials' })) as TestimonialsGlobal
  } catch (error) {
    console.error('TestimonialsSection: Failed to fetch global:', error)
  }

  const {
    heading = 'Where we deliver confidence',
    subheading = 'Discover how agencies leverage AiSC across their entire client lifecycle.',
    caseStudies = [],
    clientLogosHeading = "Who's talking about us",
    clientLogos = [],
  } = data

  return (
    <section data-background="dark" className="section sticky">
      <div className="container top-bottom-padding landing">
        <div className="section__content-wrapper dark-green">
          <div className="section-header__wrapper">
            <TestimonialsIcon className="icon__64" />
            <h2>{heading}</h2>
            <div className="subheading__wrapper">
              <p className="body__xlarge">{subheading}</p>
            </div>
          </div>

          {caseStudies.length > 0 ? (
            <div className="testimonial__list-wrapper">
              <div className="testimonial__list">
                {caseStudies.map((study) => {
                  const logoUrl = getMediaUrl(study.logo)
                  const imageUrl = getMediaUrl(study.image)
                  const imageAlt =
                    study.image && typeof study.image === 'object' ? study.image.alt : ''
                  return (
                    <div key={study.id} className="grid card">
                        <div className="testimonial__content-wrapper testimonial__content-area">
                          <div className="testimonial__quote-wrapper">
                            <QuoteIcon className="testimonial__quote-img" />
                            <blockquote className="testimonial__quote">
                              {study.quote}
                            </blockquote>
                          </div>
                          <div className="testimonial__content-footer">
                            {logoUrl && (
                              <div className="testimonial__logo-wrapper">
                                <img
                                  src={logoUrl}
                                  loading="lazy"
                                  alt=""
                                  className="testimonial__logo"
                                />
                              </div>
                            )}
                            {study.linkHref && (
                              <Button
                                variant="ghost"
                                href={study.linkHref}
                                icon={<ArrowIcon className="icon-16" />}
                              >
                                {study.linkLabel || 'Open casestudy'}
                              </Button>
                            )}
                          </div>
                        </div>
                        {imageUrl && (
                          <div className="testimonial__img-wrapper testimonial__image-area">
                            <img
                              src={imageUrl}
                              loading="lazy"
                              alt={imageAlt}
                              className="testimonial__img"
                            />
                          </div>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="testimonial__logos">
            <h3>{clientLogosHeading}</h3>
            {clientLogos.length > 0 ? (
              <div>
                <div className="logo__list">
                  {clientLogos.map((logo) => {
                    const logoUrl = getMediaUrl(logo.image)
                    if (!logoUrl) return null
                    const mediaAlt = typeof logo.image === 'object' ? logo.image.alt : ''
                    const alt = logo.alt || mediaAlt || ''
                    return (
                      <div key={logo.id} className="testimonial__logo-item">
                        {logo.link ? (
                          <a href={logo.link} target="_blank" rel="noopener noreferrer">
                            <img
                              alt={alt}
                              loading="lazy"
                              src={logoUrl}
                              className="testimonial__client-img"
                            />
                          </a>
                        ) : (
                          <img
                            alt={alt}
                            loading="lazy"
                            src={logoUrl}
                            className="testimonial__client-img"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
