import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'

const DEFAULTS: Required<Pick<HeroGlobal, 'pillText' | 'title' | 'subtitle' | 'primaryButtonText' | 'secondaryButtonText'>> = {
  pillText: 'Latest news item',
  title: 'Discover opportunities across your client accounts.',
  subtitle: 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
  primaryButtonText: 'Get started',
  secondaryButtonText: 'Talk to sales',
}

export async function HeroSection() {
  let data: HeroGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'hero' })) as HeroGlobal
  } catch (error) {
    console.error('HeroSection: Failed to fetch global:', error)
  }

  const {
    pillText = DEFAULTS.pillText,
    pillLink,
    title = DEFAULTS.title,
    subtitle = DEFAULTS.subtitle,
    primaryButtonText = DEFAULTS.primaryButtonText,
    primaryButtonAction = 'modal',
    primaryButtonLink,
    secondaryButtonText = DEFAULTS.secondaryButtonText,
    secondaryButtonLink,
  } = data

  const primaryProps = primaryButtonAction === 'modal'
    ? { 'data-modal-open': 'get-started', href: '#' }
    : { href: primaryButtonLink || '#' }

  return (
    <section id="banner" className="section gradient">
      <div className="w-layout-blockcontainer container w-container">
        <div className="nhero">
          <div className="nhero__content">
            {pillText && (
              <a href={pillLink || '#'} className="nhero__pill">
                {pillText} <span className="nhero__pill-arrow">›</span>
              </a>
            )}
            <h1 className="nhero__title">{title}</h1>
            {subtitle && <p className="nhero__subtitle">{subtitle}</p>}
            <div className="nhero__buttons">
              {primaryButtonText && (
                <a {...primaryProps} className="nhero__btn nhero__btn--primary">
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a href={secondaryButtonLink || '#'} className="nhero__btn nhero__btn--secondary">
                  {secondaryButtonText}
                </a>
              )}
            </div>
          </div>
          <div className="nhero__scorecard-wrapper">
            <div className="scorecard-tabs">
              <div className="scorecard-tab">Accounts</div>
              <div className="scorecard-tab scorecard-tab--active">Analyse</div>
              <div className="scorecard-tab">Plan</div>
            </div>
            <div className="scorecard-panel">
              <div className="scorecard-meta">
                <div className="scorecard-meta__item"><span className="scorecard-meta__label">Ref. number:</span><span className="scorecard-meta__value">KFX/2025/10</span></div>
                <div className="scorecard-meta__item"><span className="scorecard-meta__label">Scorecard:</span><span className="scorecard-meta__value">Value</span></div>
                <div className="scorecard-meta__item"><span className="scorecard-meta__label">Total websites:</span><span className="scorecard-meta__value">217</span></div>
                <div className="scorecard-meta__item"><span className="scorecard-meta__label">Audit date:</span><span className="scorecard-meta__value">Oct 15, 2025</span></div>
                <div className="scorecard-meta__item"><span className="scorecard-meta__label">Change view:</span><span className="scorecard-meta__value"><span className="scorecard-meta__link">Summary</span> | <span className="scorecard-meta__link scorecard-meta__link--active">Value &amp; Risk (by site)</span></span></div>
              </div>
              <div className="scorecard-table-wrap">
                <table className="scorecard-table">
                  <thead>
                    <tr>
                      <th className="scorecard-th scorecard-th--org">Organization</th>
                      <th className="scorecard-th"></th>
                      <th className="scorecard-th scorecard-th--sort">Experience <span className="scorecard-sort">⇅</span></th>
                      <th className="scorecard-th scorecard-th--sort">Search <span className="scorecard-sort">⇅</span></th>
                      <th className="scorecard-th scorecard-th--sort">Integrity <span className="scorecard-sort">⇅</span></th>
                      <th className="scorecard-th"></th>
                      <th className="scorecard-th scorecard-th--value">VALUE</th>
                      <th className="scorecard-th scorecard-th--narrow">⇅</th>
                      <th className="scorecard-th scorecard-th--narrow">▲</th>
                      <th className="scorecard-th scorecard-th--narrow">+/-</th>
                      <th className="scorecard-th">History</th>
                      <th className="scorecard-th scorecard-th--icons">🔍 ⊕</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ScorecardRow org="Automation.com" orgSuffix=" *" exp="a" search="a" integrity="a" value="a" bars={[['grey',60],['green',20],['blue',20]]} />
                    <ScorecardRow org="APOK" exp="a" search="d" integrity="b" value="d" bars={[['grey',50],['green',15],['red',15],['blue',20]]} />
                    <ScorecardRow org="Actors' Equity Association" exp="b" search="c" integrity="c" value="c" bars={[['grey',55],['green',20],['orange',10],['blue',15]]} />
                    <ScorecardRow org="Adecco" exp="b" search="b" integrity="b" value="b" bars={[['grey',65],['green',20],['blue',15]]} />
                    <ScorecardRow org="Amelia Island" exp="b" search="a" integrity="a" value="b" bars={[['grey',70],['green',15],['blue',15]]} />
                    <ScorecardRow org="Anglicare WA" exp="b" search="d" integrity="b" value="d" bars={[['grey',50],['green',15],['red',20],['blue',15]]} />
                    <ScorecardRow org="Aon" exp="b" search="a" integrity="a" value="b" bars={[['grey',60],['green',25],['blue',15]]} />
                    <ScorecardRow org="BB&K Law" exp="b" search="b" integrity="b" value="b" bars={[['grey',65],['green',20],['blue',15]]} />
                    <ScorecardRow org="Bruno Independent Living Aids" exp="b" search="b" integrity="c" value="b" fade bars={[['grey',55],['green',15],['orange',10],['blue',20]]} />
                  </tbody>
                </table>
                <div className="scorecard-fade"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type Grade = 'a' | 'b' | 'c' | 'd'
type BarColor = 'grey' | 'green' | 'blue' | 'red' | 'orange'

function ScorecardRow({ org, orgSuffix, exp, search, integrity, value, bars, fade }: {
  org: string
  orgSuffix?: string
  exp: Grade
  search: Grade
  integrity: Grade
  value: Grade
  bars: [BarColor, number][]
  fade?: boolean
}) {
  return (
    <tr className={fade ? 'scorecard-tr--fade' : undefined}>
      <td className="scorecard-td scorecard-td--org"><span className="scorecard-dot"></span>{org}{orgSuffix && <sup>{orgSuffix}</sup>}</td>
      <td className="scorecard-td scorecard-td--ref">Client - Ref</td>
      <td className="scorecard-td"><span className={`scorecard-grade scorecard-grade--${exp}`}>{exp.toUpperCase()}</span></td>
      <td className="scorecard-td"><span className={`scorecard-grade scorecard-grade--${search}`}>{search.toUpperCase()}</span></td>
      <td className="scorecard-td"><span className={`scorecard-grade scorecard-grade--${integrity}`}>{integrity.toUpperCase()}</span></td>
      <td className="scorecard-td"></td>
      <td className="scorecard-td"><span className={`scorecard-grade scorecard-grade--${value} scorecard-grade--lg`}>{value.toUpperCase()}</span></td>
      <td className="scorecard-td scorecard-td--center">-</td>
      <td className="scorecard-td"></td>
      <td className="scorecard-td"></td>
      <td className="scorecard-td">
        <div className="scorecard-bar">
          {bars.map(([color, width], i) => (
            <span key={i} className={`scorecard-bar__seg scorecard-bar__seg--${color}`} style={{ width: `${width}%` }}></span>
          ))}
        </div>
      </td>
      <td className="scorecard-td"></td>
    </tr>
  )
}
