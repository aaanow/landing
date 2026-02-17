import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'

import { HeroCarousel } from './HeroCarousel'
import { HeroStats } from './HeroStats'

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
    title = 'Uncover What Your Clients Need and the Revenue You\'re Missing',
    subtitle = 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
    tags = [
      { label: 'ROI in 19 Days' },
      { label: '£217M Opportunities Tracked' },
    ],
    slides = [],
    autoplayDuration = 5000,
  } = data

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
          {tags.length > 0 && (
            <div className="nhero__tags">
              {tags.map((tag, i) => (
                <span key={tag.id ?? i} className="nhero__tag">{tag.label}</span>
              ))}
            </div>
          )}
        </div>
        <HeroCarousel slides={slides} autoplayDuration={autoplayDuration} />
      </div>
      <HeroStats />
    </section>
  )
}
