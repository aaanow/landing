'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HOW_IT_WORKS_TABS,
  HOW_IT_WORKS_HEADING,
  type TabId,
} from '@/data/how-it-works-data'

const STEP_COUNT = HOW_IT_WORKS_TABS.length

const ARROW_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
    <path
      d="M9.186 14.617a.456.456 0 0 1 .456.457v1.371a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.457-.457v-1.371a.457.457 0 0 1 .457-.457h1.37Zm2.743-.458a.457.457 0 0 1-.457.457H10.1a.457.457 0 0 1-.457-.457v-1.371c0-.252.205-.457.457-.457h1.829v1.371Zm4.571-4.571a.457.457 0 0 1-.457.457h-1.371a.457.457 0 0 0-.457.457v1.372a.457.457 0 0 1-.457.457h-1.829v-2.286h1.829c.252 0 .457-.205.457-.457V7.76h1.828c.253 0 .457.205.457.457v1.371Zm-4.571 0H.957A.457.457 0 0 1 .5 9.13V7.76c0-.253.205-.457.457-.457h11.972v2.286Zm2.285-2.286h-2.285V5.473h1.828a.457.457 0 0 1 .457.458v1.828Zm-2.743-4.114a.457.457 0 0 1 .457.457v1.829H10.1a.457.457 0 0 1-.457-.458V3.645a.457.457 0 0 1 .457-.457h1.371ZM9.643 2.73a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.458-.457V1.36c0-.253.205-.457.458-.457h1.37c.253 0 .458.204.458.457v1.371Z"
      fill="currentColor"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  useMediaQuery hook                                                 */
/* ------------------------------------------------------------------ */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/* ------------------------------------------------------------------ */
/*  Mobile: Original click-based tabs                                  */
/* ------------------------------------------------------------------ */
function HowItWorksMobile() {
  const [activeTab, setActiveTab] = useState<TabId>('day')
  const [transitioning, setTransitioning] = useState(false)

  const goToTab = useCallback(
    (tabId: TabId) => {
      if (tabId === activeTab || transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        setActiveTab(tabId)
        setTimeout(() => setTransitioning(false), 25)
      }, 250)
    },
    [activeTab, transitioning],
  )

  const tab = HOW_IT_WORKS_TABS.find((t) => t.id === activeTab)!

  return (
    <div className="hiw__layout">
      <div className="hiw__tabs" role="tablist" aria-orientation="vertical">
        {HOW_IT_WORKS_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`hiw__tab${activeTab === t.id ? ' hiw__tab--active' : ''}`}
            onClick={() => goToTab(t.id as TabId)}
          >
            <span className="hiw__tab-indicator" />
            <div className="hiw__tab-text">
              <span className="hiw__tab-number">{t.number} {t.timeLabel}</span>
              <span className="hiw__tab-time">{t.outcomeLabel}</span>
            </div>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        className={`hiw__panel${transitioning ? ' hiw__panel--exit' : ' hiw__panel--enter'}`}
      >
        <div className="hiw__panel-action">
          <h3 className="hiw__panel-title">{tab.actionTitle}</h3>
          <p className="hiw__panel-desc">{tab.actionDescription}</p>

          {tab.researchLink && (
            <div className="hiw__panel-research">
              <a href="#" className="hiw__panel-research-link">
                {tab.researchLink.label} {ARROW_ICON}
              </a>
              <p className="hiw__panel-research-desc">
                {tab.researchLink.description}
              </p>
            </div>
          )}

          <div className="hiw__steps">
            {tab.steps.map((step) => (
              <div key={step.label} className="hiw__step">
                <span className="hiw__step-label">{step.label}</span>
                <div className="hiw__step-content">
                  <p className="hiw__step-title">{step.title}</p>
                  <p className="hiw__step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw__panel-outcome">
          <div className="hiw__panel-image-wrapper">
            <img
              src={tab.image.src}
              srcSet={tab.image.srcSet}
              sizes={tab.image.sizes}
              alt={tab.outcomeTitle}
              loading="lazy"
              className="hiw__panel-image"
            />
            <div className="hiw__panel-video-links">
              {tab.videoLinks.map((vl) => (
                <a
                  key={vl.url + vl.label}
                  href={vl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hiw__video-link"
                >
                  {vl.label} {ARROW_ICON}
                </a>
              ))}
            </div>
          </div>

          <div className="hiw__panel-outcome-text">
            <h4 className="hiw__panel-outcome-title">{tab.outcomeTitle}</h4>
            <p className="hiw__panel-outcome-desc">{tab.outcomeDescription}</p>
            <div className="hiw__panel-resource-links">
              {tab.resourceLinks.map((rl) => (
                <a
                  key={rl.url + rl.label}
                  href={rl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hiw__resource-link"
                >
                  {rl.label} {ARROW_ICON}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop: Scroll-driven sticky layout                               */
/* ------------------------------------------------------------------ */
function HowItWorksDesktop() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const textPanelRefs = useRef<(HTMLDivElement | null)[]>([])
  const visualPanelRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const progressDotRefs = useRef<(HTMLDivElement | null)[]>([])

  // ScrollTrigger setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollTrackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress
          const idx = p >= 1 ? STEP_COUNT - 1 : Math.floor(p * STEP_COUNT)
          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx
            setActiveIndex(idx)
          }
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Animate panels on activeIndex change
  useEffect(() => {
    textPanelRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', pointerEvents: 'auto' })
      } else {
        gsap.set(el, { opacity: 0, y: i < activeIndex ? -30 : 30, pointerEvents: 'none' })
      }
    })

    visualPanelRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        gsap.to(el, { opacity: 1, duration: 0.5, ease: 'power2.out', pointerEvents: 'auto' })
      } else {
        gsap.set(el, { opacity: 0, pointerEvents: 'none' })
      }
    })

    // Progress fill
    if (progressFillRef.current) {
      gsap.to(progressFillRef.current, {
        scaleX: (activeIndex + 1) / STEP_COUNT,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }, [activeIndex])

  const tab = HOW_IT_WORKS_TABS[activeIndex]

  return (
    <div ref={scrollTrackRef} className="hiw__scroll-track">
      <div ref={stickyRef} className="hiw__sticky">
        <div className="hiw__sticky-inner">
          <div className="hiw__split">
            {/* Progress indicator */}
            <div className="hiw__progress">
              <div className="hiw__progress-track">
                <div ref={progressFillRef} className="hiw__progress-fill" />
              </div>
              {HOW_IT_WORKS_TABS.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { progressDotRefs.current[i] = el }}
                  className="hiw__progress-dot"
                  data-active={i <= activeIndex}
                  data-current={i === activeIndex}
                >
                  <span className="hiw__progress-dot-circle">{t.number}</span>
                  <div className="hiw__progress-dot-text">
                    <span className="hiw__progress-dot-label">{t.outcomeLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Left: text panels */}
            <div className="hiw__text-stack">
              {HOW_IT_WORKS_TABS.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { textPanelRefs.current[i] = el }}
                  className="hiw__text-panel"
                  style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(30px)' }}
                  aria-hidden={i !== activeIndex}
                >
                  <h3 className="hiw__text-title">{t.actionTitle}</h3>
                  <p className="hiw__text-desc">{t.actionDescription}</p>

                  {t.researchLink && (
                    <div className="hiw__text-research">
                      <a href="#" className="hiw__text-research-link">
                        {t.researchLink.label} {ARROW_ICON}
                      </a>
                      <p className="hiw__text-research-desc">{t.researchLink.description}</p>
                    </div>
                  )}

                  <div className="hiw__text-steps">
                    {t.steps.map((step) => (
                      <div key={step.label} className="hiw__text-step">
                        <span className="hiw__text-step-label">{step.label}</span>
                        <div className="hiw__text-step-content">
                          <p className="hiw__text-step-title">{step.title}</p>
                          <p className="hiw__text-step-desc">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hiw__text-links">
                    {t.videoLinks.map((vl) => (
                      <a
                        key={vl.url + vl.label}
                        href={vl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hiw__text-link"
                      >
                        {vl.label} {ARROW_ICON}
                      </a>
                    ))}
                    {t.resourceLinks.map((rl) => (
                      <a
                        key={rl.url + rl.label}
                        href={rl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hiw__text-link"
                      >
                        {rl.label} {ARROW_ICON}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: image only */}
            <div className="hiw__visual-stack">
              {HOW_IT_WORKS_TABS.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { visualPanelRefs.current[i] = el }}
                  className="hiw__visual-panel"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i !== activeIndex}
                >
                  <div className="hiw__visual-image-wrap">
                    <img
                      src={t.image.src}
                      srcSet={t.image.srcSet}
                      sizes="(max-width: 991px) 50vw, 600px"
                      alt={t.outcomeTitle}
                      loading="eager"
                      className="hiw__visual-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */
export function HowItWorksSection() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section id="how-it-works" className="hiw__section">
      <div className="hiw__container">
        <div className="hiw__header">
          <h2 className="hiw__heading">{HOW_IT_WORKS_HEADING}</h2>
        </div>
        {isMobile ? <HowItWorksMobile /> : <HowItWorksDesktop />}
      </div>
    </section>
  )
}
