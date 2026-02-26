import Image from 'next/image'

import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'

import { HeroStats } from './HeroStats'

export async function HeroSectionSimple() {
  let data: HeroGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'hero' })) as HeroGlobal
  } catch (error) {
    console.error('HeroSectionSimple: Failed to fetch Hero global:', error)
  }

  const {
    pillText = 'For Agencies',
    pillIcon,
    title = 'Uncover What Your Clients Need and the Revenue You\'re Missing',
    subtitle = 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
    tags = [
      { label: 'ROI in 19 Days' },
      { label: '£217M Opportunities Tracked' },
    ],
  } = data

  return (
    <section data-sticky-card className="section sticky relative overflow-hidden pt-32 pb-32 min-h-[100vh] flex flex-col items-center gap-16 text-primary-900 max-md:pt-20 max-md:px-4 max-md:pb-10">
      {/* Background image – contained size, positioned behind content */}
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[65vw] aspect-[16/10] pointer-events-none max-md:w-[90%] max-md:right-1/2 max-md:translate-x-1/2">
        <Image
          src="/images/aaanow_background.png"
          alt=""
          fill
          style={{
            objectFit: 'contain',
          }}
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-start justify-center flex-1 w-[95%] max-w-[1440px] mx-auto gap-5 max-md:items-center max-md:text-center">
        <span className="hero-animate hero-animate-delay-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-[rgba(0,50,60,0.05)] backdrop-blur-sm text-primary-900 text-sm font-medium font-body">
          {getMediaUrl(pillIcon) && (
            <Image src={getMediaUrl(pillIcon)!} alt="" width={20} height={20} className="shrink-0" />
          )}
          {pillText}
        </span>
        <h1 className="hero-animate hero-animate-delay-2 font-heading !text-[clamp(3rem,6.5vw,5rem)] !font-normal !leading-none tracking-tight text-primary-900 !mb-0 max-w-[50rem] max-md:!text-[2rem]">{title}</h1>
        <p className="hero-animate hero-animate-delay-3 font-body !text-2xl !leading-snug !font-normal !text-[rgba(0,50,60,0.85)] max-w-[42rem] m-0 max-md:!text-xl">{subtitle}</p>
        {tags.length > 0 && (
          <div className="hero-animate hero-animate-delay-4 flex gap-6 items-center mt-2 flex-wrap">
            {tags.map((tag, i) => (
              <span key={tag.id ?? i} className="inline-flex items-center gap-1.5 py-1.5 font-body text-lg font-normal text-[rgba(0,50,60,0.85)]">
                {getMediaUrl(tag.icon) && (
                  <Image src={getMediaUrl(tag.icon)!} alt="" width={18} height={18} className="shrink-0" />
                )}
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="hero-animate hero-animate-delay-5 relative z-10 w-full flex justify-center">
        <HeroStats />
      </div>
    </section>
  )
}
