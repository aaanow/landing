'use client'

import { useState, useCallback } from 'react'
import {
  HOW_IT_WORKS_TABS,
  HOW_IT_WORKS_HEADING,
  type TabId,
} from '@/data/how-it-works-data'

const ARROW_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
    <path
      d="M9.186 14.617a.456.456 0 0 1 .456.457v1.371a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.457-.457v-1.371a.457.457 0 0 1 .457-.457h1.37Zm2.743-.458a.457.457 0 0 1-.457.457H10.1a.457.457 0 0 1-.457-.457v-1.371c0-.252.205-.457.457-.457h1.829v1.371Zm4.571-4.571a.457.457 0 0 1-.457.457h-1.371a.457.457 0 0 0-.457.457v1.372a.457.457 0 0 1-.457.457h-1.829v-2.286h1.829c.252 0 .457-.205.457-.457V7.76h1.828c.253 0 .457.205.457.457v1.371Zm-4.571 0H.957A.457.457 0 0 1 .5 9.13V7.76c0-.253.205-.457.457-.457h11.972v2.286Zm2.285-2.286h-2.285V5.473h1.828a.457.457 0 0 1 .457.458v1.828Zm-2.743-4.114a.457.457 0 0 1 .457.457v1.829H10.1a.457.457 0 0 1-.457-.458V3.645a.457.457 0 0 1 .457-.457h1.371ZM9.643 2.73a.457.457 0 0 1-.457.457H7.815a.457.457 0 0 1-.458-.457V1.36c0-.253.205-.457.458-.457h1.37c.253 0 .458.204.458.457v1.371Z"
      fill="currentColor"
    />
  </svg>
)

export function HowItWorksSection() {
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
    <section id="how-it-works" className="hiw__section">
      <div className="hiw__container">
        <div className="hiw__header">
          <h2 className="hiw__heading">{HOW_IT_WORKS_HEADING}</h2>
        </div>

        <div className="hiw__layout">
          {/* Left: vertical tab navigation */}
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

          {/* Right: content panel */}
          <div
            role="tabpanel"
            className={`hiw__panel${transitioning ? ' hiw__panel--exit' : ' hiw__panel--enter'}`}
          >
            {/* Action area */}
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

            {/* Outcome area */}
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
      </div>
    </section>
  )
}
