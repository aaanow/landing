'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { HowItWorksTab } from '@/data/how-it-works-data'

interface HowItWorksSectionProps {
  heading: string
  tabs: HowItWorksTab[]
}

const ARROW_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
    <path
      d="M9.186 14.617a.456.456 0 0 1 .456.457v1.371a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.457-.457v-1.371a.457.457 0 0 1 .457-.457h1.37Zm2.743-.458a.457.457 0 0 1-.457.457H10.1a.457.457 0 0 1-.457-.457v-1.371c0-.252.205-.457.457-.457h1.829v1.371Zm4.571-4.571a.457.457 0 0 1-.457.457h-1.371a.457.457 0 0 0-.457.457v1.372a.457.457 0 0 1-.457.457h-1.829v-2.286h1.829c.252 0 .457-.205.457-.457V7.76h1.828c.253 0 .457.205.457.457v1.371Zm-4.571 0H.957A.457.457 0 0 1 .5 9.13V7.76c0-.253.205-.457.457-.457h11.972v2.286Zm2.285-2.286h-2.285V5.473h1.828a.457.457 0 0 1 .457.458v1.828Zm-2.743-4.114a.457.457 0 0 1 .457.457v1.829H10.1a.457.457 0 0 1-.457-.458V3.645a.457.457 0 0 1 .457-.457h1.371ZM9.643 2.73a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.458-.457V1.36c0-.253.205-.457.458-.457h1.37c.253 0 .458.204.458.457v1.371Z"
      fill="currentColor"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  AiSC Mockup – stacked card UI (matches tool-use screenshot style)  */
/* ------------------------------------------------------------------ */
interface CodeLine { key: string; val: string; isNum?: boolean }
interface MockupData {
  fn: string
  desc: string
  params: CodeLine[]
  response: CodeLine[]
}

const MOCKUP_BY_TAB: Record<string, MockupData> = {
  day: {
    fn: 'run_client_audit',
    desc: 'Based on the portfolio, function',
    params: [
      { key: 'domain', val: 'automation.com' },
      { key: 'type', val: 'value_risk' },
    ],
    response: [
      { key: 'value_score', val: 'A' },
      { key: 'risk_items', val: '14', isNum: true },
      { key: 'billable_est', val: '~32hrs' },
    ],
  },
  week: {
    fn: 'run_prospect_scan',
    desc: 'Based on the target, function',
    params: [
      { key: 'domain', val: 'prospect-corp.com' },
      { key: 'mode', val: 'full_scan' },
    ],
    response: [
      { key: 'risk_level', val: 'elevated' },
      { key: 'quick_wins', val: '8', isNum: true },
      { key: 'est_value', val: '£18,000' },
    ],
  },
  month: {
    fn: 'run_sector_analysis',
    desc: 'Based on the sector, function',
    params: [
      { key: 'sector', val: 'retail' },
      { key: 'sites', val: '50', isNum: true },
    ],
    response: [
      { key: 'audited', val: '50', isNum: true },
      { key: 'avg_risk', val: 'C' },
      { key: 'your_rank', val: 'top 12%' },
    ],
  },
  quarter: {
    fn: 'run_growth_report',
    desc: 'Based on the accounts, function',
    params: [
      { key: 'period', val: 'Q1' },
      { key: 'accounts', val: '48', isNum: true },
    ],
    response: [
      { key: 'retention', val: '+18%' },
      { key: 'new_revenue', val: '£42k' },
      { key: 'authority', val: 'sector lead' },
    ],
  },
}

/* Small icon components matching the screenshot */
const ICON_BTNS = (
  <div className="mockup-icons">
    <span className="mockup-icon-btn">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8.5 1.5l2 2M1.5 8.5l6-6 2 2-6 6H1.5v-2z" /></svg>
    </span>
    <span className="mockup-icon-btn">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><text x="2" y="10" fontSize="10" fill="currentColor" stroke="none">ƒ</text></svg>
    </span>
    <span className="mockup-icon-btn">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 2v8M2 6h8" /></svg>
    </span>
  </div>
)

const DIAMOND = <span className="mockup-diamond">◇</span>

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <div className="mockup-code">
      <span className="mockup-brace">{'{'}</span>
      {lines.map((l, i) => (
        <div key={l.key} className="mockup-code__line">
          {'  '}<span className="mockup-key">&quot;{l.key}&quot;</span>
          <span className="mockup-punct">: </span>
          {l.isNum
            ? <span className="mockup-num">{l.val}</span>
            : <span className="mockup-str">&quot;{l.val}&quot;</span>}
          {i < lines.length - 1 && <span className="mockup-punct">,</span>}
        </div>
      ))}
      <span className="mockup-brace">{'}'}</span>
    </div>
  )
}

function AiScMockup({ tabId }: { tabId: string }) {
  const d = MOCKUP_BY_TAB[tabId] || MOCKUP_BY_TAB.day

  return (
    <div className="hiw-mockup">
      {[5, 4, 3, 2, 1].map(n => (
        <div key={n} className={`hiw-mockup__layer hiw-mockup__layer--${n}`} aria-hidden="true" />
      ))}

      <div className="hiw-mockup__card">
        {/* Message block */}
        <div className="mockup-msg">
          <div className="mockup-msg__head">
            <span className="mockup-msg__bar" />
            <span className="mockup-msg__label">AiSC</span>
            <span className="mockup-msg__tag">{'{}'} 130</span>
          </div>
          <div className="mockup-msg__body">
            <p className="mockup-msg__text">
              {d.desc} <code className="mockup-fn">{d.fn}</code> would be appropriate for the task.
            </p>
            {ICON_BTNS}
          </div>
        </div>

        {/* Run block */}
        <div className="mockup-run">
          <div className="mockup-run__head">
            <svg className="mockup-run__play" width="10" height="11" viewBox="0 0 10 11" fill="currentColor"><path d="M1 1v9l8-4.5z" /></svg>
            <span>Run <strong>{d.fn}</strong></span>
            {ICON_BTNS}
          </div>
          <CodeBlock lines={d.params} />
          {DIAMOND}
        </div>

        {/* Response block */}
        <div className="mockup-resp">
          <div className="mockup-resp__label">Response {DIAMOND}</div>
          <CodeBlock lines={d.response} />
          {DIAMOND}
        </div>
      </div>
    </div>
  )
}

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
          <AiScMockup tabId={tab.id} />

          <div className="hiw__panel-outcome-text">
            <h4 className="hiw__panel-outcome-title">{tab.outcomeTitle}</h4>
            <p className="hiw__panel-outcome-desc">{tab.outcomeDescription}</p>
            <div className="hiw__panel-resource-links">
              {tab.videoLinks.map((vl) => (
                <a
                  key={vl.url + vl.label}
                  href={vl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hiw__resource-link"
                >
                  {vl.label} {ARROW_ICON}
                </a>
              ))}
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
    gsap.registerPlugin(ScrollTrigger)

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

            {/* Right: AiSC mockup */}
            <div className="hiw__visual-stack">
              {tabs.map((t, i) => (
                <div
                  key={t.id}
                  ref={(el) => { visualPanelRefs.current[i] = el }}
                  className="hiw__visual-panel"
                  aria-hidden={i !== activeIndex}
                >
                  <AiScMockup tabId={t.id} />
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
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section id="how-it-works" className="hiw__section">
      <div className="hiw__container">
        <div className="hiw__header">
          <h2 className="hiw__heading">{heading}</h2>
        </div>
        {isMobile ? <HowItWorksMobile tabs={tabs} /> : <HowItWorksDesktop tabs={tabs} />}
      </div>
    </section>
  )
}
