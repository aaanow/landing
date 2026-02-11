/* ------------------------------------------------------------------ */
/*  Scorecard mock data for the hero section demo                      */
/* ------------------------------------------------------------------ */

export type Grade = 'a' | 'b' | 'c' | 'd'
export type BarSeg = [color: 'grey' | 'green' | 'blue' | 'red' | 'orange', pct: number]

export interface MetaItem { label: string; value: string }
export interface AccountData { account: string; contact: string; sites: number; mrr: string; status: 'active' | 'onboarding'; health: 'good' | 'at-risk' | 'monitor' | 'new'; renewal: string }
export interface AnalyseData { org: string; suffix?: string; exp: Grade; search: Grade; integrity: Grade; value: Grade; bars: BarSeg[] }
export interface PlanData { account: string; action: string; priority: 'high' | 'medium' | 'low'; value: string; owner: string; due: string; progress: number }

export const TABS = ['Accounts', 'Analyse', 'Plan'] as const
export type Tab = (typeof TABS)[number]

export const HEALTH_LABELS: Record<AccountData['health'], string> = {
  good: 'Good', 'at-risk': 'At risk', monitor: 'Monitor', new: 'New',
}

/* ---- Accounts ---------------------------------------------------- */

export const ACCOUNTS_META: MetaItem[] = [
  { label: 'Portfolio', value: 'Agency Clients' },
  { label: 'Accounts', value: '48' },
  { label: 'Total websites', value: '217' },
  { label: 'Last updated', value: 'Feb 10, 2026' },
]

export const ACCOUNTS_DATA: AccountData[] = [
  { account: 'Automation.com', contact: 'J. Peters', sites: 12, mrr: '$4,200', status: 'active', health: 'good', renewal: 'Jun 2026' },
  { account: 'APOK', contact: 'R. Tanaka', sites: 5, mrr: '$1,800', status: 'active', health: 'at-risk', renewal: 'Mar 2026' },
  { account: "Actors' Equity Association", contact: 'M. Davis', sites: 3, mrr: '$2,100', status: 'active', health: 'good', renewal: 'Sep 2026' },
  { account: 'Adecco', contact: 'S. Chen', sites: 8, mrr: '$3,600', status: 'active', health: 'good', renewal: 'Jul 2026' },
  { account: 'Amelia Island', contact: 'K. Brooks', sites: 4, mrr: '$1,500', status: 'onboarding', health: 'new', renewal: 'Dec 2026' },
  { account: 'Anglicare WA', contact: "P. O'Brien", sites: 6, mrr: '$2,400', status: 'active', health: 'at-risk', renewal: 'Apr 2026' },
  { account: 'Aon', contact: 'L. Martinez', sites: 15, mrr: '$5,100', status: 'active', health: 'good', renewal: 'Aug 2026' },
  { account: 'BB&K Law', contact: 'D. Wilson', sites: 2, mrr: '$900', status: 'active', health: 'good', renewal: 'Nov 2026' },
  { account: 'Bruno Independent Living', contact: 'A. Patel', sites: 3, mrr: '$1,200', status: 'active', health: 'monitor', renewal: 'May 2026' },
]

/* ---- Analyse ----------------------------------------------------- */

export const ANALYSE_META: MetaItem[] = [
  { label: 'Ref. number', value: 'KFX/2025/10' },
  { label: 'Scorecard', value: 'Value' },
  { label: 'Total websites', value: '217' },
  { label: 'Audit date', value: 'Oct 15, 2025' },
]

export const ANALYSE_DATA: AnalyseData[] = [
  { org: 'Automation.com', suffix: ' *', exp: 'a', search: 'a', integrity: 'a', value: 'a', bars: [['grey', 60], ['green', 20], ['blue', 20]] },
  { org: 'APOK', exp: 'a', search: 'd', integrity: 'b', value: 'd', bars: [['grey', 50], ['green', 15], ['red', 15], ['blue', 20]] },
  { org: "Actors' Equity Association", exp: 'b', search: 'c', integrity: 'c', value: 'c', bars: [['grey', 55], ['green', 20], ['orange', 10], ['blue', 15]] },
  { org: 'Adecco', exp: 'b', search: 'b', integrity: 'b', value: 'b', bars: [['grey', 65], ['green', 20], ['blue', 15]] },
  { org: 'Amelia Island', exp: 'b', search: 'a', integrity: 'a', value: 'b', bars: [['grey', 70], ['green', 15], ['blue', 15]] },
  { org: 'Anglicare WA', exp: 'b', search: 'd', integrity: 'b', value: 'd', bars: [['grey', 50], ['green', 15], ['red', 20], ['blue', 15]] },
  { org: 'Aon', exp: 'b', search: 'a', integrity: 'a', value: 'b', bars: [['grey', 60], ['green', 25], ['blue', 15]] },
  { org: 'BB&K Law', exp: 'b', search: 'b', integrity: 'b', value: 'b', bars: [['grey', 65], ['green', 20], ['blue', 15]] },
  { org: 'Bruno Independent Living Aids', exp: 'b', search: 'b', integrity: 'c', value: 'b', bars: [['grey', 55], ['green', 15], ['orange', 10], ['blue', 20]] },
]

/* ---- Plan -------------------------------------------------------- */

export const PLAN_META: MetaItem[] = [
  { label: 'Plan type', value: 'Quarterly Review' },
  { label: 'Accounts in plan', value: '12' },
  { label: 'Total value', value: '$128,400' },
  { label: 'Created', value: 'Feb 1, 2026' },
]

export const PLAN_DATA: PlanData[] = [
  { account: 'APOK', action: 'Site speed audit & fix', priority: 'high', value: '$18,000', owner: 'J. Peters', due: 'Mar 15', progress: 75 },
  { account: 'Anglicare WA', action: 'SEO restructure', priority: 'high', value: '$24,000', owner: 'R. Tanaka', due: 'Mar 30', progress: 40 },
  { account: 'Automation.com', action: 'Accessibility compliance', priority: 'medium', value: '$12,600', owner: 'M. Davis', due: 'Apr 10', progress: 60 },
  { account: 'Adecco', action: 'Content strategy refresh', priority: 'medium', value: '$15,000', owner: 'S. Chen', due: 'Apr 20', progress: 25 },
  { account: 'Amelia Island', action: 'Conversion funnel review', priority: 'medium', value: '$9,800', owner: 'K. Brooks', due: 'May 1', progress: 10 },
  { account: 'Aon', action: 'Security & integrity audit', priority: 'low', value: '$21,000', owner: 'L. Martinez', due: 'May 15', progress: 90 },
  { account: 'BB&K Law', action: 'Mobile experience upgrade', priority: 'low', value: '$8,400', owner: 'D. Wilson', due: 'May 30', progress: 55 },
  { account: "Actors' Equity", action: 'Search visibility plan', priority: 'low', value: '$11,200', owner: 'A. Patel', due: 'Jun 10', progress: 5 },
  { account: 'Bruno Independent', action: 'Full site redesign proposal', priority: 'low', value: '$8,400', owner: "P. O'Brien", due: 'Jun 30', progress: 0 },
]
