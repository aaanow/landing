export function HeroStats() {
  const heading = 'AiSC \u2018Ai for good\u2019 provides new ways to work. Without AiSC are at a disadvantage.'
  const stats = [
    { value: '58%', description: 'Email openings, better lead generation \u2013 stand out from the noise, be heard.' },
    { value: '21%', description: 'Email openings, better lead generation \u2013 stand out from the noise, be heard.' },
    { value: '17%', description: 'Revenue uplift across client base and remove those undermining value.' },
  ]
  const ctaText = 'Download the research report'
  const ctaLink = '#'

  return (
    <div className="hero-stats">
      <div className="hero-stats__layout">
        <div className="hero-stats__content">
          <h2 className="hero-stats__heading">{heading}</h2>
          <a href={ctaLink} className="hero-stats__cta">
            {ctaText} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="hero-stats__grid">
          {stats.map((stat, i) => (
            <div key={i} className="hero-stats__card">
              <div className="hero-stats__value">{stat.value}</div>
              <p className="hero-stats__description">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
