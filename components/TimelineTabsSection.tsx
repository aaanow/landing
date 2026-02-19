'use client'

import { useState, useCallback } from 'react'
import { ArrowIcon } from './icons'

const TABS = [
  {
    id: 'day',
    label: 'in 1 Day',
    heading: 'Evidence billable time',
    description:
      'Profile present (& lapsed) clients.  Value / Risk fundamentals costed for each;  email, engage and sell work.',
    researchLink: true,
    steps: [
      {
        number: '1',
        title: "Email \u2018advisor note\u2019 ",
        description:
          "Send Value / Risk summary (example) \u2018confirm\u2019 importance of ongoing, independent clarity of position.",
      },
      {
        number: '2',
        title: 'AiSC audits, completes costs assessment',
        description:
          'No human input, Value/Risk results and costed work|packs ready in 2.5hrs.',
      },
      {
        number: '3',
        title: 'Review results, share; client by client',
        description:
          '1-click, share results, book calls. Feed detail to CRM.  Foundations in place for retention improvement.',
      },
    ],
  },
  {
    id: 'week',
    label: 'in a Week',
    heading: 'Be heard by key prospects',
    description:
      'Use unique, 1-2-1 findings to get heard and engage. You are now in meaningful discussion about protecting and maximising online investment.',
    steps: [
      {
        number: '1',
        title: "Email \u2018advisor note\u2019 ",
        description:
          "Send Value / Risk summary (example) \u2018confirm\u2019 importance of ongoing, independent clarity of position.",
      },
      {
        number: '2',
        title: 'Add website using /CONFIRM',
        description:
          'Takes you 1min, click go. AiSC audits, understands fundamentals and grades Value and Risk, summary done.',
      },
      {
        number: '3',
        title: 'ONE-CLICK - share results by email',
        description:
          'Directly engage, and offer time slots to walk through findings, and share complementary 3 quick wins call.',
      },
    ],
  },
  {
    id: 'month',
    label: 'in a Month',
    heading: 'Have the boardroom keys ',
    description:
      'With unique value, and the human want to compare, above  the noise  your message is heard from the boardroom down.',
    steps: [
      {
        number: 'a',
        title: 'Advise all Value / Risk results coming',
        description:
          'Have known contacts communicate internally, new target advise of value, uniqueness - Board \u2192 Digital leads.',
      },
      {
        number: 'b',
        title: 'Against target account (new or to expand)',
        description:
          'Securely upload the websites, covering the full landscape to AiSC. Using XLS file, takes you 7mins.',
      },
      {
        number: 'c',
        title: 'Share (start with known contacts - then board)',
        description:
          'Distribution of the results.  Invite to webinar to walk through and access to site specifics.',
      },
    ],
  },
  {
    id: 'quarter',
    label: 'in a Quarter',
    heading: 'Own your target sector ',
    description:
      'Evergreen PR and event content, sector  want to understand position - you set the digital standard others report against.',
    steps: [
      {
        number: 'a',
        title: 'Sector constituents loaded',
        description: 'Securely add websites via XLS file, takes you 7mins.',
      },
      {
        number: 'b',
        title: 'Influencer reach out',
        description:
          'Partner with memberbody, associations (direct value to them) sector media to collaborate on results distribution.',
      },
      {
        number: 'c',
        title: 'Against target account (new or to expand)',
        description:
          'Repeating 90Day cycle, monthly announcement / update - continuous sector engagement and discussion.',
      },
    ],
  },
]

export function TimelineTabsSection() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [selectedTab, setSelectedTab] = useState(TABS[0].id)
  const [transitioning, setTransitioning] = useState(false)
  const selectedIndex = TABS.findIndex((t) => t.id === selectedTab)
  const tab = TABS.find((t) => t.id === activeTab)!

  const goToTab = useCallback((id: string) => {
    if (id === selectedTab) return
    setSelectedTab(id)
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(id)
      setTimeout(() => setTransitioning(false), 20)
    }, 300)
  }, [selectedTab])

  return (
    <section className="section sticky">
      <div className="w-[95%] max-w-[1440px] mx-auto py-8">
        <div className="section__content-wrapper card _2 dark-section-green">
          <div className="section-header__wrapper">
            <h2 className="heading-3">
              AiSC - &lsquo;one change&rsquo; how long for results?
            </h2>
          </div>

          <div className="tab__wrapper-copy">
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
                  <div className="tab__pane-text-wrapper-copy" style={{ gridColumn: '1 / -1' }}>
                    {/* Left column: heading + description + research link */}
                    <div className="tab__pane-thing">
                      <div>
                        <h3 className="heading-5">{tab.heading}</h3>
                        <p className="p_xxxlarge">{tab.description}</p>
                      </div>
                      {tab.researchLink && (
                        <div className="div-block-170">
                          <a href="#" className="button button--text button--light">
                            The research behind our numbers.
                            <ArrowIcon className="icon-16" />
                          </a>
                          <p className="body__small">
                            How behavioural science, AI modelling evidence can
                            be used to removes noise, and increases profit.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right column: numbered steps */}
                    <div className="div-block-162">
                      {tab.steps.map((step) => (
                        <div key={step.number} className="div-block-163">
                          <div className="text-block-2">{step.number}</div>
                          <div className="div-block-161">
                            <p className="p_default bold">{step.title}</p>
                            <p>{step.description}</p>
                          </div>
                        </div>
                      ))}
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
