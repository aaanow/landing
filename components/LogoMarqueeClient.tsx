'use client'

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import type { MarqueeLogo } from '@/types/cms'

interface LogoMarqueeClientProps {
  heading?: string
  logos: MarqueeLogo[]
  speed?: number
  direction?: 'forward' | 'backward'
}

export function LogoMarqueeClient({
  heading,
  logos,
  speed = 1,
  direction = 'forward',
}: LogoMarqueeClientProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: false,
      align: 'start',
    },
    [
      AutoScroll({
        speed,
        direction,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  )

  // Triple logos for seamless infinite loop on wide viewports
  const duplicatedLogos = [...logos, ...logos, ...logos]

  return (
    <div className="logo-marquee">
      {heading && <h3 className="logo-marquee__heading">{heading}</h3>}
      <div className="logo-marquee__viewport" ref={emblaRef}>
        <div className="logo-marquee__container">
          {duplicatedLogos.map((logo, index) => (
            <div className="logo-marquee__slide" key={`${logo.id}-${index}`}>
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
                    loading="lazy"
                    className="logo-marquee__img"
                  />
                </a>
              ) : (
                <img
                  src={logo.image}
                  alt={logo.alt || ''}
                  loading="lazy"
                  className="logo-marquee__img"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
