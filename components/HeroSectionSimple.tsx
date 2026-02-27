import Image from 'next/image'

import { getPayloadClient } from '@/src/payload'
import type { HeroGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'

import { HeroPlayButton } from './HeroPlayButton'
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
    videoUrl,
  } = data

  return (
    <section data-sticky-card className="section sticky relative overflow-hidden bg-gradient-to-b from-[#e1ede0] to-transparent pt-32 pb-32 min-h-[100vh] flex flex-col items-center gap-16 text-primary-900 max-md:pt-20 max-md:px-4 max-md:pb-10 max-md:min-h-0">
      {/* Background image – contained size, positioned behind content */}
      <div className={`hero-animate hero-animate-delay-3 hero-bg-mobile absolute top-[47%] -right-[10vw] -translate-y-1/2 w-[85vw] aspect-[16/10]${videoUrl ? '' : ' pointer-events-none'}`}>
        <Image
          src="/images/aaanow_background.png"
          alt=""
          fill
          className="object-contain max-md:!object-cover"
          priority
        />
        {videoUrl && <HeroPlayButton videoUrl={videoUrl} />}
      </div>

      <div className="relative z-10 flex-1 w-[95%] max-w-[1440px] mx-auto flex items-center">
      <div className="flex flex-col items-start justify-center max-w-[46ch] gap-5 max-md:items-center max-md:text-center max-md:gap-3">
        <div className="flex flex-col items-start gap-2 max-md:items-center">
          <span className="hero-animate hero-animate-delay-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-[rgba(0,50,60,0.05)] backdrop-blur-sm text-primary-900 text-sm font-medium font-body">
            {getMediaUrl(pillIcon) && (
              <Image src={getMediaUrl(pillIcon)!} alt="" width={20} height={20} className="shrink-0" />
            )}
            {pillText}
          </span>
          <h1 className="hero-animate hero-animate-delay-2 font-heading !text-[clamp(3rem,6.5vw,5rem)] !font-normal !leading-none tracking-tight text-primary-900 !mb-0 !mt-0 max-w-[50rem] max-md:!text-[2.5rem]">{title}</h1>
        </div>
        <p className="hero-animate hero-animate-delay-3 font-body !text-2xl !leading-snug !font-normal !text-[rgba(0,50,60,0.85)] max-w-[42rem] m-0 max-md:!text-xl">{subtitle}</p>
        {tags.length > 0 && (
          <div className="hero-animate hero-animate-delay-4 flex gap-6 items-center flex-wrap max-md:justify-center max-md:w-full max-md:gap-0 max-md:-mt-2">
            {tags.map((tag, i) => (
              <span key={tag.id ?? i} className="inline-flex items-center gap-1.5 py-1.5 font-body text-base font-normal text-[rgba(0,50,60,0.85)]">
                {getMediaUrl(tag.icon) && (
                  <Image src={getMediaUrl(tag.icon)!} alt="" width={18} height={18} className="shrink-0" />
                )}
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
      </div>
      <div className="hero-animate hero-animate-delay-5 relative z-10 w-full flex justify-center max-md:mt-24">
        <HeroStats />
      </div>
    </section>
  )
}
