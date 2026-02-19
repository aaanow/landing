import { Button } from './Button'
import { ArrowIcon } from './icons'

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
    <div className="mt-0 w-[95%] max-w-[1440px]">
      <div className="flex items-start gap-12 max-lg:flex-col">
        <div className="flex-[0_0_40%] flex flex-col items-start gap-4 pt-4 max-lg:flex-none max-lg:w-full">
          <h3 className="font-heading text-2xl font-normal leading-tight tracking-tight text-primary-900 m-0 max-lg:text-title-3">{heading}</h3>
          <Button variant="sub" href={ctaLink} icon={<ArrowIcon className="icon-16" />}>
            {ctaText}
          </Button>
        </div>
        <div className="flex-1 flex gap-4 max-md:flex-col">
          {stats.map((stat, i) => (
            <div key={i} className="flex-1 border-l border-l-primary-400/20 pl-8">
              <div className="!text-[4.5rem] !font-normal !leading-none tracking-tighter text-primary-900 mb-4 max-md:!text-4xl" style={{ fontFamily: 'var(--font-family-heading)' }}>{stat.value}</div>
              <p className="text-body leading-normal text-primary-900">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
