import { getPayloadClient } from '@/src/payload'
import type { LogoMarqueeGlobal } from '@/types/cms'
import { LogoMarqueeClient } from './LogoMarqueeClient'

export async function LogoMarquee() {
  let data: LogoMarqueeGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'logo-marquee' })) as LogoMarqueeGlobal
  } catch (error) {
    console.error('LogoMarquee: Failed to fetch global:', error)
  }

  const { heading, logos = [], speed, direction } = data

  if (logos.length === 0) {
    return null
  }

  return (
    <LogoMarqueeClient
      heading={heading}
      logos={logos}
      speed={speed}
      direction={direction}
    />
  )
}
