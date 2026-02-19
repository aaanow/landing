import { getPayloadClient } from '@/src/payload'
import type { CTAGlobal } from '@/types/cms'
import { Button } from './Button'
import { ArrowIcon } from './icons'

export async function CTASection() {
  let data: CTAGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'cta' })) as CTAGlobal
  } catch (error) {
    console.error('CTASection: Failed to fetch CTA global:', error)
  }

  const {
    heading = 'Ready to Transform Client Retention?',
    body = 'Join agencies who are turning oversight into revenue.\nStart monitoring fundamentals, showing value, and converting insights into paid work.',
    buttonText = 'Get Started',
    buttonAction = 'modal',
    buttonLink,
  } = data

  const bodyLines = body.split('\n')

  const buttonProps =
    buttonAction === 'modal'
      ? { 'data-modal-open': 'get-started', href: '#' }
      : { href: buttonLink || '#' }

  return (
    <section className="w-full relative pb-16">
      <div className="w-[95%] max-w-[1440px] mx-auto py-8">
        <div className="gap-8 bg-button rounded-[4rem] max-md:rounded-[2rem] flex flex-col w-full py-16 px-4">
          <div className="text-center w-full mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="w-16 h-16 mb-4 mx-auto block">
              <path d="M54.8574 45.7139V53.0289C54.8574 54.0387 54.0387 54.8574 53.0289 54.8574H20.1147C19.1048 54.8574 18.2861 54.0387 18.2861 53.0289V47.5424C18.2861 46.5325 19.1048 45.7139 20.1147 45.7139H54.8574ZM64 43.8853C64 44.8952 63.1813 45.7139 62.1714 45.7139H54.8574V38.3999C54.8574 37.39 55.6761 36.5713 56.686 36.5713H62.1714C63.1813 36.5713 64 37.39 64 38.3999V43.8853ZM27.4287 7.31401C27.4287 8.3239 26.61 9.14258 25.6001 9.14258H20.1147C19.1048 9.14258 18.2861 9.96126 18.2861 10.9711V25.6001C18.2861 26.61 17.4675 27.4287 16.4576 27.4287H10.9711C9.96126 27.4287 9.14258 26.61 9.14258 25.6001V10.9711C9.14258 9.96126 8.3239 9.14258 7.31401 9.14258H1.82857C0.818679 9.14258 0 8.3239 0 7.31401V1.82857C0 0.818679 0.818679 0 1.82857 0H25.6001C26.61 0 27.4287 0.818679 27.4287 1.82857V7.31401ZM45.7139 25.6001C45.7139 26.61 44.8952 27.4287 43.8853 27.4287H38.3999C37.39 27.4287 36.5713 26.61 36.5713 25.6001V20.1147C36.5713 19.1048 37.39 18.2861 38.3999 18.2861H45.7139V25.6001ZM64 25.6001C64 26.61 63.1813 27.4287 62.1714 27.4287H56.686C55.6761 27.4287 54.8574 26.61 54.8574 25.6001V18.2861H62.1714C63.1813 18.2861 64 19.1048 64 20.1147V25.6001ZM54.8574 18.2861H45.7139V10.9711C45.7139 9.96126 46.5325 9.14258 47.5424 9.14258H53.0289C54.0387 9.14258 54.8574 9.96126 54.8574 10.9711V18.2861Z" fill="currentColor" />
            </svg>
            <h2>{heading}</h2>
            <div className="flex flex-col items-center w-full max-w-[55rem] mx-auto">
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)', lineHeight: 1.5 }} className="tracking-snug">
                {bodyLines.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
              <div className="flex gap-4 items-center mt-8 max-sm:flex-col">
                <Button
                  {...buttonProps}
                  variant="main"
                  icon={<ArrowIcon className="icon-16 green" />}
                >
                  {buttonText}
                </Button>
                <Button
                  variant="sub"
                  data-cal-namespace="aisc-prove"
                  data-cal-link="aaanow-ljs/aisc-prove"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
