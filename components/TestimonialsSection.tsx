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
    <section data-background="dark" className="relative top-0">
      <div className="w-[95%] max-w-[1440px] mx-auto py-8">
        <div className="flex flex-col gap-8 bg-gradient-to-b from-[#004452] to-[#002B33] text-button rounded-[4rem] w-full py-16 px-12 max-md:rounded-[2rem] max-md:px-6">
          <div className="text-center w-full mx-auto">
            <TestimonialsIcon className="w-16 h-16 mb-4 block mx-auto" />
            <h2>{heading}</h2>
            <div className="flex flex-col items-center w-full max-w-[55rem] mx-auto">
              <p className="tracking-snug mb-0" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)', lineHeight: 1.5 }}>{subheading}</p>
            </div>
          </div>

          {caseStudies.length > 0 ? (
            <div className="w-full mx-auto">
              <div className="flex flex-wrap gap-4 mt-8 w-full">
                {caseStudies.map((study) => {
                  const logoUrl = getMediaUrl(study.logo)
                  const imageUrl = getMediaUrl(study.image)
                  const imageAlt =
                    study.image && typeof study.image === 'object' ? study.image.alt : ''
                  return (
                    <div key={study.id} className="flex gap-6 text-neutral-0 bg-[#ffffff1a] bg-[url('/images/Frame-334608.avif')] bg-center bg-no-repeat bg-cover border border-[#fff3] rounded-[24px_100px_24px_24px] p-6 max-md:flex-col max-md:p-4">
                        <div className="flex-[16] min-w-0 flex flex-col gap-8 justify-between items-start w-full max-md:gap-4 self-end">
                          <div className="flex flex-col gap-6 relative max-md:gap-4">
                            <QuoteIcon className="opacity-10 w-1/3 absolute top-0 left-0" />
                            <blockquote className="relative border-l-0 mb-4 p-0 font-heading leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                              {study.quote}
                            </blockquote>
                          </div>
                          <div className="flex justify-between items-end w-full">
                            {logoUrl && (
                              <div className="flex flex-col gap-2">
                                <img
                                  src={logoUrl}
                                  loading="lazy"
                                  alt={study.logo && typeof study.logo === 'object' ? study.logo.alt || 'Client logo' : 'Client logo'}
                                  className="w-[150px]"
                                />
                              </div>
                            )}
                            {study.linkHref && (
                              <Button
                                variant="text"
                                color="light"
                                href={study.linkHref}
                                icon={<ArrowIcon className="icon-16" />}
                              >
                                {study.linkLabel || 'Open casestudy'}
                              </Button>
                            )}
                          </div>
                        </div>
                        {imageUrl && (
                          <div className="flex-[7] min-w-0 rounded-[1rem_5rem_1rem_1rem] w-full h-full flex overflow-hidden max-md:order-first">
                            <img
                              src={imageUrl}
                              loading="lazy"
                              alt={imageAlt}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-6 items-center mt-8 max-md:gap-2">
            <h3>{clientLogosHeading}</h3>
            {clientLogos.length > 0 ? (
              <div>
                <div className="flex gap-8 justify-center items-center max-md:gap-4">
                  {clientLogos.map((logo) => {
                    const logoUrl = getMediaUrl(logo.image)
                    if (!logoUrl) return null
                    const mediaAlt = typeof logo.image === 'object' ? logo.image.alt : ''
                    const alt = logo.alt || mediaAlt || ''
                    return (
                      <div key={logo.id} className="flex-1 flex justify-center items-center h-20">
                        {logo.link ? (
                          <a href={logo.link} target="_blank" rel="noopener noreferrer">
                            <img
                              alt={alt}
                              loading="lazy"
                              src={logoUrl}
                              className="w-auto h-full block"
                            />
                          </a>
                        ) : (
                          <img
                            alt={alt}
                            loading="lazy"
                            src={logoUrl}
                            className="w-auto h-full block"
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
