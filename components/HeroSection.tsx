import { ScorecardTabs } from './ScorecardTabs'
import { Button } from './Button'

const HERO = {
  pillText: 'Latest news item',
  pillLink: '#',
  title: 'Discover opportunities across your client accounts.',
  subtitle: 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
  primaryButtonText: 'Get started',
  secondaryButtonText: 'Talk to sales',
}

export function HeroSection() {
  return (
    <section className="nhero__section">
      <div className="nhero">
        <div className="nhero__content">
          <a href={HERO.pillLink} className="nhero__pill">
            {HERO.pillText} <span className="nhero__pill-arrow">&rsaquo;</span>
          </a>
          <h1 className="nhero__title">{HERO.title}</h1>
          <p className="nhero__subtitle">{HERO.subtitle}</p>
          <div className="nhero__buttons">
            <Button variant="solid" href="#" data-modal-open="get-started">
              {HERO.primaryButtonText}
            </Button>
            <Button variant="secondary" href="#">
              {HERO.secondaryButtonText}
            </Button>
          </div>
        </div>
        <ScorecardTabs />
      </div>
    </section>
  )
}
