import { Fragment } from 'react'
import { getPayloadClient } from '@/src/payload'
import type { ResearchStatsGlobal } from '@/types/cms'

export async function StatsSection() {
  let data: ResearchStatsGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'research-stats' })) as ResearchStatsGlobal
  } catch (error) {
    console.error('StatsSection: Failed to fetch Research Stats global:', error)
  }

  const {
    heading = 'How agencies turn insight into measurable growth.',
    stats = [
      { value: '58%', description: 'Increase in email open and response rates when outreach is based on specific, real issues found on a client\u2019s site.' },
      { value: '23%', description: 'Increase in pitch success when proposals are grounded in clear, evidence-based opportunities.' },
      { value: '17%', description: 'Increase in revenue per client by turning site analysis into clear, costed, actionable plans.' },
    ],
    ctaText = 'Read the research',
    ctaLink = '#',
  } = data

  return (
    <section id="stats" className="section sticky">
      <div className="container top-bottom-padding landing">
        <div className="stats-card">
          <div className="stats-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" width="48" height="40" fill="none">
              <path d="M2,0h2v1H2zM8,0h2v1H8zM1,1h4v1H1zM7,1h4v1H7zM0,2h12v3H0zM1,5h10v1H1zM2,6h8v1H2zM3,7h6v1H3zM4,8h4v1H4zM5,9h2v1H5z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="stats-heading">{heading}</h2>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <Fragment key={stat.id || i}>
                {i > 0 && <div className="stats-divider" />}
                <div className="stats-item">
                  <div className="stats-value">{stat.value}</div>
                  <p className="stats-description">{stat.description}</p>
                </div>
              </Fragment>
            ))}
          </div>
          <a href={ctaLink} className="stats-cta">{ctaText}</a>
        </div>
      </div>
    </section>
  )
}
