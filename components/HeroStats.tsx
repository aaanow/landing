import Link from 'next/link'
import { getPayloadClient } from '@/src/payload'
import type { ResearchStatsGlobal } from '@/types/cms'
import { ArrowIcon } from './icons'

interface HeroStatsProps {
  variant?: 'light' | 'dark'
}

export async function HeroStats({
  variant = 'light',
}: HeroStatsProps) {
  let data: ResearchStatsGlobal = {}

  try {
    const payload = await getPayloadClient()
    data = (await payload.findGlobal({ slug: 'research-stats' })) as ResearchStatsGlobal
  } catch (error) {
    console.error('HeroStats: Failed to fetch Research Stats global:', error)
  }

  const {
    heading = 'AiSC \u2018Ai for good\u2019 provides new ways to work. Without AiSC are at a disadvantage.',
    stats = [
      { value: '58%', description: 'Email openings, better lead generation \u2013 stand out from the noise, be heard.' },
      { value: '21%', description: 'Improvement in client retention when agencies provide continuous, evidence-based oversight.' },
      { value: '17%', description: 'Revenue uplift across client base and remove those undermining value.' },
    ],
    ctaText = 'Download the research report',
    ctaLink: rawCtaLink,
  } = data
  const ctaLink = rawCtaLink && rawCtaLink !== '#' ? rawCtaLink : '/images/58_21_17-Reveune_R02424_84ATA.pdf'
  const isDark = variant === 'dark'

  const wrapperClasses = isDark
    ? 'w-[95%] max-w-[1440px] mx-auto bg-button rounded-[2rem] px-12 py-14 max-md:px-6 max-md:py-10'
    : 'mt-0 w-[95%] max-w-[1440px]'

  const headingClasses = isDark
    ? 'font-heading text-2xl font-normal leading-tight tracking-tight text-primary-900 m-0 max-lg:text-title-3'
    : 'font-heading text-2xl font-normal leading-tight tracking-tight text-primary-900 m-0 max-lg:text-title-3'

  const dividerClasses = isDark
    ? 'flex-1 border-l border-l-primary-900/15 pl-8'
    : 'flex-1 border-l border-l-primary-400/20 pl-8'

  return (
    <div className={wrapperClasses}>
      <div className="flex items-start gap-12 max-lg:flex-col">
        <div className="flex-[0_0_40%] flex flex-col items-start gap-1 pt-4 max-lg:flex-none max-lg:w-full">
          <h3 className={headingClasses}>{heading}</h3>
          {ctaLink.startsWith('/') ? (
            <Link href={ctaLink} className="inline-flex items-center gap-1.5 py-1.5 font-body text-base font-normal text-[rgba(0,50,60,0.85)]">
              {ctaText}
              <ArrowIcon className="icon-16 shrink-0" />
            </Link>
          ) : (
            <a href={ctaLink} className="inline-flex items-center gap-1.5 py-1.5 font-body text-base font-normal text-[rgba(0,50,60,0.85)]">
              {ctaText}
              <ArrowIcon className="icon-16 shrink-0" />
            </a>
          )}
        </div>
        <div className="flex-1 flex gap-4 max-md:flex-col">
          {stats.map((stat, i) => (
            <div key={i} className={dividerClasses}>
              <div className="!text-[4.5rem] !font-normal !leading-none tracking-tighter text-primary-900 mb-4 max-md:!text-4xl" style={{ fontFamily: 'var(--font-family-heading)' }}>{stat.value}</div>
              <p className="text-body leading-normal text-primary-900">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
