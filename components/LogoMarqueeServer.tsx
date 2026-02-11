import { getPayloadClient } from '@/src/payload'
import type { LogoMarqueeGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'
import { LogoMarqueeClient } from './LogoMarqueeClient'

export async function LogoMarquee() {
  let data: LogoMarqueeGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'logo-marquee' })) as LogoMarqueeGlobal
  } catch (error) {
    console.error('LogoMarquee: Failed to fetch global:', error)
  }

  const { logos = [], speed, direction } = data

  // Extract URLs from media objects and resolve alt text
  const resolvedLogos = logos
    .map((logo) => {
      const url = getMediaUrl(logo.image)
      if (!url) return null
      const mediaAlt = typeof logo.image === 'object' ? logo.image.alt : undefined
      return {
        id: logo.id,
        image: url,
        alt: logo.alt || mediaAlt || '',
        link: logo.link,
      }
    })
    .filter(Boolean) as { id?: string; image: string; alt: string; link?: string }[]

  if (resolvedLogos.length === 0) {
    return null
  }

  return (
    <LogoMarqueeClient
      logos={resolvedLogos}
      speed={speed}
      direction={direction}
    />
  )
}
