'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowIcon } from './icons'

interface VideoLink {
  label: string
  href: string
}

interface TabData {
  id: string
  label: string
  image: { src: string; srcSet: string; sizes: string; alt: string }
  videoLinks: VideoLink[]
  iconSvg: React.ReactNode
  heading: string
  description: string
  ctaLinks: { label: string; href: string }[]
}

const BLOCK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" className="icon-24">
    <path d="M2 17.5C2 17.7761 1.77614 18 1.5 18H0.5C0.223858 18 0 17.7761 0 17.5V16.5C0 16.2239 0.223858 16 0.5 16H2V17.5ZM4 15.5C4 15.7761 3.77614 16 3.5 16H2V14.5C2 14.2239 2.22386 14 2.5 14H4V15.5ZM16 15.5C16 15.7761 15.7761 16 15.5 16H14.5C14.2239 16 14 15.7761 14 15.5V14H16V15.5ZM6 12V13.5C6 13.7761 5.77614 14 5.5 14H4V12.5C4 12.2239 4.22386 12 4.5 12H6ZM14 14H12.5C12.2239 14 12 13.7761 12 13.5V12H13.5C13.7761 12 14 12.2239 14 12.5V14ZM18 13.5C18 13.7761 17.7761 14 17.5 14H16V12.5C16 12.2239 16.2239 12 16.5 12H18V13.5ZM8 11.5C8 11.7761 7.77614 12 7.5 12H6V10.5C6 10.2239 6.22386 10 6.5 10H8V11.5ZM12 12H10.5C10.2239 12 10 11.7761 10 11.5V10H11.5C11.7761 10 12 10.2239 12 10.5V12ZM20 11.5C20 11.7761 19.7761 12 19.5 12H18V10.5C18 10.2239 18.2239 10 18.5 10H20V11.5ZM24 11.5C24 11.7761 23.7761 12 23.5 12H22.5C22.2239 12 22 11.7761 22 11.5V10.5C22 10.2239 21.7761 10 21.5 10H20V8.5C20 8.22386 19.7761 8 19.5 8H18.5C18.2239 8 18 7.77614 18 7.5V6.5C18 6.22386 18.2239 6 18.5 6H23.5C23.7761 6 24 6.22386 24 6.5V11.5ZM10 10H8V8.5C8 8.22386 8.22386 8 8.5 8H9.5C9.77614 8 10 8.22386 10 8.5V10Z" fill="currentColor" />
  </svg>
)

const TABS: TabData[] = [
  {
    id: 'grow',
    label: 'Grow Client Revenue',
    image: {
      src: '/images/1_11.avif',
      srcSet: '/images/1_1-p-500.avif 500w, /images/1_11.avif 783w',
      sizes: '(max-width: 767px) 100vw, (max-width: 991px) 728px, 783px',
      alt: 'AiSC dashboard showing client confidence and revenue growth metrics',
    },
    videoLinks: [
      { label: 'Client confidence, Agency revenue', href: 'https://youtu.be/TMWlp4o-ezk' },
      { label: 'Introduction \u2013 why AiSC, what value?', href: 'https://youtu.be/vKpIORM39f0' },
    ],
    iconSvg: BLOCK_ICON,
    heading: 'Client Confidence, Revenue Growth',
    description:
      'How agencies can protect value, retain clients and grow revenue by using AiSC to create continuous clarity, guide priorities, replace competitors and strengthen confidence before and after launch.',
    ctaLinks: [
      { label: 'AiSC \u2013 what, why, how much', href: 'https://aaanow.aflip.in/AiSC_Application.html' },
      { label: 'See how it works', href: '#' },
    ],
  },
  {
    id: 'win',
    label: 'Win More Business',
    image: {
      src: '/images/2_12.avif',
      srcSet: '/images/2_1-p-500.avif 500w, /images/2_1-p-800.avif 800w, /images/2_1-p-1080.avif 1080w, /images/2_1-p-1600.avif 1600w, /images/2_12.avif 1744w',
      sizes: '(max-width: 767px) 100vw, (max-width: 991px) 728px, 783px',
      alt: 'AiSC pitch differentiation and business development overview',
    },
    videoLinks: [
      { label: 'Client confidence, Agency revenue', href: 'https://youtu.be/TMWlp4o-ezk' },
      { label: 'Differentiate  have number 11.', href: 'https://youtu.be/y0PhgZxybnA' },
    ],
    iconSvg: BLOCK_ICON,
    heading: 'Win More Business',
    description:
      'This video shows how agencies win more work by adding Number 11. AiSC provides continuous proof of value and risk, creating confidence that differentiates pitches and secures wider programs.',
    ctaLinks: [
      { label: 'Losing a pitch \u2013 with AiSC there are 40,000 reasons to.', href: 'https://aaanow.webflow.io/post/how-losing-the-pitch-is-worth-more-30-days-40-000' },
      { label: 'AiSC \u2013 what, why, how much', href: 'https://aaanow.aflip.in/AiSC_Application.html' },
    ],
  },
  {
    id: 'stop',
    label: 'Stop Funding Competitors',
    image: {
      src: '/images/3_13.avif',
      srcSet: '/images/3_1-p-500.avif 500w, /images/3_1-p-800.avif 800w, /images/3_13.avif 980w',
      sizes: '(max-width: 767px) 100vw, (max-width: 991px) 728px, 783px',
      alt: 'AiSC competitive analysis replacing external tools',
    },
    videoLinks: [
      { label: 'Client confidence, Agency revenue', href: 'https://youtu.be/TMWlp4o-ezk' },
      { label: "Stop Funding \u2018competition\u2019", href: 'https://youtu.be/LiWdhqfseHE' },
    ],
    iconSvg: BLOCK_ICON,
    heading: 'Stop funding competitors.',
    description:
      'Agencies lose value when clients adopt external tools. AiSC gives agencies the clarity to replace those competitors, regain control, strengthen retention and protect revenue through continuous oversight and clear priorities.',
    ctaLinks: [
      { label: 'AiSC \u2013 what, why, how much', href: 'https://aaanow.aflip.in/AiSC_Application.html' },
    ],
  },
  {
    id: 'growth',
    label: 'Your growth engine',
    image: {
      src: '/images/4.avif',
      srcSet: '/images/302bf39f9c030bcf57ceed97da9095d7_4-p-500.avif 500w, /images/302bf39f9c030bcf57ceed97da9095d7_4-p-800.avif 800w, /images/4.avif 924w',
      sizes: '(max-width: 767px) 100vw, (max-width: 991px) 728px, 783px',
      alt: 'AiSC agency growth engine across the full client lifecycle',
    },
    videoLinks: [
      { label: 'Client confidence, Agency revenue', href: 'https://youtu.be/TMWlp4o-ezk' },
      { label: 'AiSC \u2013 Agency growth engine', href: 'https://youtu.be/zL-Cne8VJQc' },
    ],
    iconSvg: BLOCK_ICON,
    heading: 'Your growth engine',
    description:
      'How AiSC drives agency growth by adding pitch differentiation, strengthening retainers, revealing billable work, protecting value after launch and giving account teams continuous clarity across the full client lifecycle.',
    ctaLinks: [
      { label: 'AiSC \u2013 what, why, how much', href: 'https://aaanow.aflip.in/AiSC_Application.html' },
    ],
  },
]

export function AdvantagesSection() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [selectedTab, setSelectedTab] = useState(TABS[0].id)
  const [transitioning, setTransitioning] = useState(false)
  const selectedIndex = TABS.findIndex((t) => t.id === selectedTab)
  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0]
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  const goToTab = useCallback((id: string) => {
    if (id === selectedTab) return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSelectedTab(id)
    setTransitioning(true)
    timersRef.current.push(setTimeout(() => {
      setActiveTab(id)
      timersRef.current.push(setTimeout(() => setTransitioning(false), 20))
    }, 300))
  }, [selectedTab])

  return (
    <section className="section sticky">
      <div className="w-[95%] max-w-[1440px] mx-auto py-8">
        <div className="section__content-wrapper card _2 dark-section-white">
          <div className="section-header__wrapper">
            <h2 className="heading-3">Ways Agencies Drive Commercial Advantage</h2>
          </div>

          <div className="tab__wrapper">
            {/* Tab navigation */}
            <div className="tab__nav-wrapper">
              <div
                className="tab__nav-slider"
                style={{
                  width: `calc((100% - 0.5rem) / ${TABS.length})`,
                  transform: `translateX(${selectedIndex * 100}%)`,
                }}
              />
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`tab__nav-item${selectedTab === t.id ? ' is-active' : ''}`}
                  onClick={() => goToTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="tabs-content">
              <div className={`tab__pane${transitioning ? ' tab__pane--exit' : ' tab__pane--enter'}`}>
                <div className="tab__pane-grid">
                  <div className="tab__pane-content" style={{ gridColumn: '1 / -1' }}>
                    {/* Image with video overlay links */}
                    <div className="tab__pane-video-wrapper" style={{ gridColumn: 'span 7' }}>
                      <div className="div-block-158">
                        <Image
                          src={tab.image.src}
                          alt={tab.image.alt}
                          sizes={tab.image.sizes}
                          width={783}
                          height={500}
                          className="image-19"
                        />
                        <div className="tab__pane-btn-wrapper-copy">
                          {tab.videoLinks.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button button--text button--light"
                            >
                              {link.label}
                              <ArrowIcon className="icon-16" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="tab__pane-text-wrapper" style={{ gridColumn: 'span 3' }}>
                      <div className="tab__pane-text">
                        <div className="div-block-122">
                          {tab.iconSvg}
                        </div>
                        <h3>{tab.heading}</h3>
                        <p>{tab.description}</p>
                      </div>
                      <div className="tab__pane-btn-wrapper">
                        {tab.ctaLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button--text button--light"
                          >
                            {link.label}
                            <ArrowIcon className="icon-16" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
