'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { HowItWorksTab } from '@/data/how-it-works-data'
import { AccountsPanel, AnalysePanel, PlanPanel } from './scorecard/ScorecardPanels'

interface HowItWorksSectionProps {
  heading: string
  tabs: HowItWorksTab[]
}

const SCORECARD_TABS = ['Accounts', 'Analyse', 'Plan'] as const

function ScorecardPreview({ stepIndex }: { stepIndex: number }) {
  const activeTab = SCORECARD_TABS[stepIndex] || 'Accounts'

  return (
    <div className="hiw__scorecard">
      <div className="scorecard-tabs">
        {SCORECARD_TABS.map(tab => (
          <span
            key={tab}
            className={`scorecard-tab${activeTab === tab ? ' scorecard-tab--active' : ''}`}
          >
            <span className="scorecard-tab__label">{tab}</span>
          </span>
        ))}
      </div>
      <div className="scorecard-panel scorecard-panel--enter">
        {activeTab === 'Accounts' && <AccountsPanel />}
        {activeTab === 'Analyse' && <AnalysePanel />}
        {activeTab === 'Plan' && <PlanPanel />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  useMediaQuery hook                                                 */
/* ------------------------------------------------------------------ */
function useMediaQuery(query: string): { matches: boolean; mounted: boolean } {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    setMounted(true)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return { matches, mounted }
}

/* ------------------------------------------------------------------ */
/*  Mobile: Original click-based tabs                                  */
/* ------------------------------------------------------------------ */
function HowItWorksMobile({ tabs }: { tabs: HowItWorksTab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'day')
  const [transitioning, setTransitioning] = useState(false)

  const goToTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTab || transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        setActiveTab(tabId)
        setTimeout(() => setTransitioning(false), 25)
      }, 250)
    },
    [activeTab, transitioning],
  )

  const tab = tabs.find((t) => t.id === activeTab)!
  const tabIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <div className="hiw__layout">
      <div className="hiw__tabs" role="tablist" aria-orientation="vertical">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`hiw__tab${activeTab === t.id ? ' hiw__tab--active' : ''}`}
            onClick={() => goToTab(t.id)}
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
          <ScorecardPreview stepIndex={tabIndex} />

          <div className="hiw__panel-outcome-text">
            <h4 className="hiw__panel-outcome-title">{tab.outcomeTitle}</h4>
            <p className="hiw__panel-outcome-desc">{tab.outcomeDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop: Scroll-driven sticky layout                               */
/* ------------------------------------------------------------------ */
function HowItWorksDesktop({ tabs }: { tabs: HowItWorksTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const textPanelRefs = useRef<(HTMLDivElement | null)[]>([])
  const visualPanelRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressDotRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll-driven timeline – GSAP handles pinning AND panel transitions directly
  useLayoutEffect(() => {
    const count = tabs.length
    const textEls = textPanelRefs.current
    const visualEls = visualPanelRefs.current

    const ctx = gsap.context(() => {
      // Set initial panel states before first paint
      textEls.forEach((el, i) => {
        if (!el) return
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 30,
          pointerEvents: i === 0 ? 'auto' : 'none',
        })
      })
      visualEls.forEach((el, i) => {
        if (!el) return
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          pointerEvents: i === 0 ? 'auto' : 'none',
        })
      })

      // Build crossfade timeline with absolute positions
      const tl = gsap.timeline()
      const step = 1 // each step = 1 unit of timeline time

      for (let i = 1; i < count; i++) {
        const fadeAt = i * step - 0.15 // crossfade centered on step boundary
        tl.to(textEls[i - 1]!, { opacity: 0, y: -30, pointerEvents: 'none', duration: 0.3, ease: 'power2.inOut' }, fadeAt)
        tl.fromTo(textEls[i]!, { opacity: 0, y: 30 }, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3, ease: 'power2.inOut' }, fadeAt)
        tl.to(visualEls[i - 1]!, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.inOut' }, fadeAt)
        tl.fromTo(visualEls[i]!, { opacity: 0 }, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.inOut' }, fadeAt)
      }

      // Extend timeline so the last step has a full hold period
      tl.to({}, { duration: 0.01 }, count * step)

      ScrollTrigger.create({
        trigger: scrollTrackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        animation: tl,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          const idx = p >= 1 ? count - 1 : Math.floor(p * count)
          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx
            setActiveIndex(idx)
          }
        },
      })
    })

    return () => ctx.revert()
  }, [tabs.length])

  return (
    <div ref={scrollTrackRef} className="hiw__scroll-track">
      <div ref={stickyRef} className="hiw__sticky">
        <div className="hiw__sticky-inner">
          <div className="hiw__split">
            {/* Progress indicator */}
            <div className="hiw__progress">
              <div className="hiw__progress-track">
                <div className="hiw__progress-fill" />
              </div>
              {tabs.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { progressDotRefs.current[i] = el }}
                  className="hiw__progress-dot"
                  data-active={i <= activeIndex}
                  data-current={i === activeIndex}
                  aria-label={`Step ${i + 1}: ${t.timeLabel} — ${t.outcomeLabel}`}
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
              {tabs.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { textPanelRefs.current[i] = el }}
                  className="hiw__text-panel"
                  aria-hidden={i !== activeIndex}
                >
                  <h3 className="hiw__text-title">{t.actionTitle}</h3>
                  <p className="hiw__text-desc">{t.actionDescription}</p>

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

                </div>
              ))}
            </div>

            {/* Right: scorecard panels */}
            <div className="hiw__visual-stack">
              {tabs.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { visualPanelRefs.current[i] = el }}
                  className="hiw__visual-panel"
                  aria-hidden={i !== activeIndex}
                >
                  <ScorecardPreview stepIndex={i} />
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
export function HowItWorksSection({ heading, tabs }: HowItWorksSectionProps) {
  const { matches: isMobile, mounted } = useMediaQuery('(max-width: 767px)')

  return (
    <section id="how-it-works" className="hiw__section" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.15s ease' }}>
      <div className="hiw__container">
        <h2 className="hiw__heading">{heading}</h2>
        {isMobile ? <HowItWorksMobile tabs={tabs} /> : <HowItWorksDesktop tabs={tabs} />}
      </div>
    </section>
  )
}
