import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'
import { ScorecardTabs } from './ScorecardTabs'
import { Button } from './Button'

export async function HeroSection() {
  let data: HeroGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'hero' })) as HeroGlobal
  } catch (error) {
    console.error('HeroSection: Failed to fetch Hero global:', error)
  }

  const {
    pillText = 'Latest news item',
    pillLink = '#',
    title = 'Discover opportunities across your client accounts.',
    subtitle = 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
    primaryButtonText = 'Get started',
    primaryButtonAction = 'modal',
    primaryButtonLink,
    secondaryButtonText = 'Talk to sales',
    secondaryButtonLink,
  } = data

  const primaryButtonProps =
    primaryButtonAction === 'modal'
      ? { 'data-modal-open': 'get-started', href: '#' }
      : { href: primaryButtonLink || '#' }

  return (
    <section className="nhero__section">
      <div className="nhero">
        <div className="nhero__content">
          <div className="nhero__top">
            <a href={pillLink || '#'} className="nhero__pill">
              {pillText} <span className="nhero__pill-arrow">&rsaquo;</span>
            </a>
            <h1 className="nhero__title">{title}</h1>
          </div>
          <p className="nhero__subtitle">{subtitle}</p>
          <div className="nhero__buttons">
            <Button variant="solid" {...primaryButtonProps}>
              {primaryButtonText}
            </Button>
            <Button variant="secondary" href={secondaryButtonLink || '#'}>
              {secondaryButtonText}
            </Button>
          </div>
        </div>
        <ScorecardTabs />
      </div>
    </section>
  )
}
