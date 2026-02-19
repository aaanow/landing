import Image from 'next/image'

import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'

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
    pillText = 'For Agencies',
    pillIcon,
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
    <section className="bg-gradient-to-b from-[#e1ede0] to-transparent pt-32 pb-32 min-h-[80vh] flex flex-col items-center gap-16 text-primary-900 max-md:pt-20 max-md:px-4 max-md:pb-10">
      <div className="flex items-center w-[95%] max-w-[1440px] mx-auto gap-12 max-md:flex-col max-md:gap-8">
        <div className="flex-[5] min-w-0 flex flex-col items-start gap-5 pb-8 max-md:text-center max-md:items-center">
          <div className="flex flex-col items-start gap-0 max-md:items-center">
            <span className="hero-animate hero-animate-delay-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-[rgba(0,50,60,0.05)] text-primary-900 text-sm font-medium font-body">
              {getMediaUrl(pillIcon) && (
                <Image src={getMediaUrl(pillIcon)!} alt="" width={20} height={20} className="shrink-0" />
              )}
              {pillText}
            </span>
            <h1 className="hero-animate hero-animate-delay-2 font-heading !text-[clamp(3rem,6.5vw,5rem)] !font-normal !leading-none tracking-tight text-primary-900 !mb-0 !mt-[0.5rem] max-md:!text-[2rem]">{title}</h1>
          </div>
          <p className="hero-animate hero-animate-delay-3 font-body !text-2xl !leading-snug !font-normal !text-[rgba(0,50,60,0.75)] max-w-[42rem] m-0 max-md:!text-xl">{subtitle}</p>
          {tags.length > 0 && (
            <div className="hero-animate hero-animate-delay-4 flex gap-6 items-center mt-2 flex-wrap">
              {tags.map((tag, i) => (
                <span key={tag.id ?? i} className="inline-flex items-center gap-1.5 py-1.5 font-body text-lg font-normal text-[rgba(0,50,60,0.75)]">
                  {getMediaUrl(tag.icon) && (
                    <Image src={getMediaUrl(tag.icon)!} alt="" width={18} height={18} className="shrink-0" />
                  )}
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="hero-animate hero-animate-delay-4 flex-[7] min-w-0">
          <HeroCarousel slides={slides} autoplayDuration={autoplayDuration} />
        </div>
      </div>
      <div className="hero-animate hero-animate-delay-5 w-full flex justify-center">
        <HeroStats />
      </div>
    </section>
  )
}
