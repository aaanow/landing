import type { Grade, BarSeg, MetaItem } from '@/data/scorecard-data'
import {
  ACCOUNTS_META, ACCOUNTS_DATA, HEALTH_LABELS,
  ANALYSE_META, ANALYSE_DATA,
  PLAN_META, PLAN_DATA,
} from '@/data/scorecard-data'

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */
function Meta({ items }: { items: MetaItem[] }) {
  return (
    <div className="scorecard-meta">
      {items.map(m => (
        <div key={m.label} className="scorecard-meta__item">
          <span className="scorecard-meta__label">{m.label}:</span>
          <span className="scorecard-meta__value">{m.value}</span>
        </div>
      ))}
    </div>
  )
}

function Dot() {
  return <span className="scorecard-dot" />
}

function GradeBadge({ grade, large }: { grade: Grade; large?: boolean }) {
  return (
    <span className={`scorecard-grade scorecard-grade--${grade}${large ? ' scorecard-grade--lg' : ''}`}>
      {grade.toUpperCase()}
    </span>
  )
}

function Bar({ segments }: { segments: BarSeg[] }) {
  return (
    <div className="scorecard-bar">
      {segments.map(([color, width], i) => (
        <span key={i} className={`scorecard-bar__seg scorecard-bar__seg--${color}`} style={{ width: `${width}%` }} />
      ))}
    </div>
  )
}

function Progress({ pct }: { pct: number }) {
  return (
    <div className="scorecard-progress">
      <div className="scorecard-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Accounts                                                           */
/* ------------------------------------------------------------------ */
export function AccountsPanel() {
  return (
    <>
      <Meta items={ACCOUNTS_META} />
      <div className="scorecard-table-wrap">
        <table className="scorecard-table">
          <thead>
            <tr>
              <th className="scorecard-th scorecard-th--org">Account</th>
              <th className="scorecard-th">Contact</th>
              <th className="scorecard-th scorecard-th--sort">Sites <span className="scorecard-sort">&darr;</span></th>
              <th className="scorecard-th scorecard-th--sort">MRR <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th">Status</th>
              <th className="scorecard-th scorecard-th--sort">Health <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th">Renewal</th>
            </tr>
          </thead>
          <tbody>
            {ACCOUNTS_DATA.map((r, i) => (
              <tr key={r.account} className={i === ACCOUNTS_DATA.length - 1 ? 'scorecard-tr--fade' : undefined}>
                <td className="scorecard-td scorecard-td--org"><Dot />{r.account}</td>
                <td className="scorecard-td scorecard-td--ref">{r.contact}</td>
                <td className="scorecard-td scorecard-td--center">{r.sites}</td>
                <td className="scorecard-td">{r.mrr}</td>
                <td className="scorecard-td">
                  <span className={`scorecard-status scorecard-status--${r.status}`}>
                    {r.status === 'active' ? 'Active' : 'Onboarding'}
                  </span>
                </td>
                <td className="scorecard-td">
                  <span className={`scorecard-health scorecard-health--${r.health}`}>{HEALTH_LABELS[r.health]}</span>
                </td>
                <td className="scorecard-td scorecard-td--ref">{r.renewal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="scorecard-fade" />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Analyse                                                            */
/* ------------------------------------------------------------------ */
export function AnalysePanel() {
  return (
    <>
      <div className="scorecard-meta">
        {ANALYSE_META.map(m => (
          <div key={m.label} className="scorecard-meta__item">
            <span className="scorecard-meta__label">{m.label}:</span>
            <span className="scorecard-meta__value">{m.value}</span>
          </div>
        ))}
        <div className="scorecard-meta__item">
          <span className="scorecard-meta__label">Change view:</span>
          <span className="scorecard-meta__value">
            <span className="scorecard-meta__link">Summary</span> |{' '}
            <span className="scorecard-meta__link scorecard-meta__link--active">Value &amp; Risk (by site)</span>
          </span>
        </div>
      </div>
      <div className="scorecard-table-wrap">
        <table className="scorecard-table">
          <thead>
            <tr>
              <th className="scorecard-th scorecard-th--org">Organization</th>
              <th className="scorecard-th" />
              <th className="scorecard-th scorecard-th--sort">Experience <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th scorecard-th--sort">Search <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th scorecard-th--sort">Integrity <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th" />
              <th className="scorecard-th scorecard-th--value">VALUE</th>
              <th className="scorecard-th scorecard-th--narrow">&#8645;</th>
              <th className="scorecard-th scorecard-th--narrow">&#9650;</th>
              <th className="scorecard-th scorecard-th--narrow">+/-</th>
              <th className="scorecard-th">History</th>
              <th className="scorecard-th scorecard-th--icons">&#128269; &#8853;</th>
            </tr>
          </thead>
          <tbody>
            {ANALYSE_DATA.map((r, i) => (
              <tr key={r.org} className={i === ANALYSE_DATA.length - 1 ? 'scorecard-tr--fade' : undefined}>
                <td className="scorecard-td scorecard-td--org"><Dot />{r.org}{r.suffix && <sup>{r.suffix}</sup>}</td>
                <td className="scorecard-td scorecard-td--ref">Client - Ref</td>
                <td className="scorecard-td"><GradeBadge grade={r.exp} /></td>
                <td className="scorecard-td"><GradeBadge grade={r.search} /></td>
                <td className="scorecard-td"><GradeBadge grade={r.integrity} /></td>
                <td className="scorecard-td" />
                <td className="scorecard-td"><GradeBadge grade={r.value} large /></td>
                <td className="scorecard-td scorecard-td--center">-</td>
                <td className="scorecard-td" />
                <td className="scorecard-td" />
                <td className="scorecard-td"><Bar segments={r.bars} /></td>
                <td className="scorecard-td" />
              </tr>
            ))}
          </tbody>
        </table>
        <div className="scorecard-fade" />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Plan                                                               */
/* ------------------------------------------------------------------ */
export function PlanPanel() {
  return (
    <>
      <Meta items={PLAN_META} />
      <div className="scorecard-table-wrap">
        <table className="scorecard-table">
          <thead>
            <tr>
              <th className="scorecard-th scorecard-th--org">Account</th>
              <th className="scorecard-th">Action</th>
              <th className="scorecard-th scorecard-th--sort">Priority <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th scorecard-th--sort">Est. value <span className="scorecard-sort">&#8645;</span></th>
              <th className="scorecard-th">Owner</th>
              <th className="scorecard-th">Due</th>
              <th className="scorecard-th">Progress</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_DATA.map((r, i) => (
              <tr key={r.account} className={i === PLAN_DATA.length - 1 ? 'scorecard-tr--fade' : undefined}>
                <td className="scorecard-td scorecard-td--org"><Dot />{r.account}</td>
                <td className="scorecard-td">{r.action}</td>
                <td className="scorecard-td">
                  <span className={`scorecard-priority scorecard-priority--${r.priority}`}>
                    {r.priority.charAt(0).toUpperCase() + r.priority.slice(1)}
                  </span>
                </td>
                <td className="scorecard-td">{r.value}</td>
                <td className="scorecard-td scorecard-td--ref">{r.owner}</td>
                <td className="scorecard-td scorecard-td--ref">{r.due}</td>
                <td className="scorecard-td"><Progress pct={r.progress} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="scorecard-fade" />
      </div>
    </>
  )
}
