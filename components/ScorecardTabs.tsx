'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TABS, type Tab } from '@/data/scorecard-data'
import { AccountsPanel, AnalysePanel, PlanPanel } from './scorecard/ScorecardPanels'

const TAB_DURATION = 8000

export function ScorecardTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('Accounts')
  const [transitioning, setTransitioning] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const pausedRef = useRef(false)

  const goToTab = useCallback((tab: Tab) => {
    if (tab === activeTab) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(tab)
      setTimerKey(k => k + 1)
      setTimeout(() => setTransitioning(false), 20)
    }, 250)
  }, [activeTab])

  const advanceTab = useCallback(() => {
    if (pausedRef.current) return
    const idx = TABS.indexOf(activeTab)
    const next = TABS[(idx + 1) % TABS.length]
    goToTab(next)
  }, [activeTab, goToTab])

  useEffect(() => {
    const id = setTimeout(advanceTab, TAB_DURATION)
    return () => clearTimeout(id)
  }, [activeTab, advanceTab, timerKey])

  const handleTabClick = (tab: Tab) => {
    pausedRef.current = false
    goToTab(tab)
  }

  return (
    <div
      className="nhero__scorecard-wrapper"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false; setTimerKey(k => k + 1) }}
    >
      <div className="scorecard-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`scorecard-tab${activeTab === tab ? ' scorecard-tab--active' : ''}`}
            onClick={() => handleTabClick(tab)}
            type="button"
          >
            <span className="scorecard-tab__label">{tab}</span>
            {activeTab === tab && (
              <span key={timerKey} className="scorecard-tab__timer" style={{ animationDuration: `${TAB_DURATION}ms` }} />
            )}
          </button>
        ))}
      </div>
      <div className={`scorecard-panel${transitioning ? ' scorecard-panel--exit' : ' scorecard-panel--enter'}`}>
        {activeTab === 'Accounts' && <AccountsPanel />}
        {activeTab === 'Analyse' && <AnalysePanel />}
        {activeTab === 'Plan' && <PlanPanel />}
      </div>
    </div>
  )
}
