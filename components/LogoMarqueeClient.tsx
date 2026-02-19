interface ResolvedLogo {
  id?: string
  image: string
  alt: string
  link?: string
}

interface LogoMarqueeClientProps {
  heading?: string
  logos: ResolvedLogo[]
  speed?: number
  direction?: 'forward' | 'backward'
}

export function LogoMarqueeClient({
  heading,
  logos,
  speed = 60,
  direction = 'forward',
}: LogoMarqueeClientProps) {
  const animationDirection = direction === 'backward' ? 'reverse' : 'normal'
  // Repeat logos enough times so one half fills the viewport on wide screens
  const repeats = Math.max(2, Math.ceil(12 / logos.length))
  const set = Array.from({ length: repeats }, () => logos).flat()
  const duration = `${Math.max(10, set.length * (60 / speed))}s`

  const renderLogo = (logo: ResolvedLogo, index: number, prefix: string) => (
    <div className="logo-marquee__slide" key={`${prefix}-${index}`}>
      {logo.link ? (
        <a
          href={logo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-marquee__link"
        >
          <img
            src={logo.image}
            alt={logo.alt || ''}
            className="logo-marquee__img"
          />
        </a>
      ) : (
        <img
          src={logo.image}
          alt={logo.alt || ''}
          className="logo-marquee__img"
        />
      )}
    </div>
  )

  return (
    <div className="logo-marquee">
      {heading && <h3 className="logo-marquee__heading">{heading}</h3>}
      <div className="logo-marquee__viewport">
        <div
          className="logo-marquee__container"
          style={{
            animationDuration: duration,
            animationDirection: animationDirection,
          }}
        >
          {set.map((logo, i) => renderLogo(logo, i, 'a'))}
          {set.map((logo, i) => renderLogo(logo, i, 'b'))}
        </div>
      </div>
    </div>
  )
}
