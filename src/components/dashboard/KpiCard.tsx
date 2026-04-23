'use client'
import { KpiKey, kpiLabel, fmt } from '@/lib/metrics'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  kpiKey: KpiKey
  value: number | null
  prevValue?: number | null
  index?: number
}

export default function KpiCard({ kpiKey, value, prevValue, index = 0 }: KpiCardProps) {
  const label = kpiLabel[kpiKey] ?? kpiKey
  const formatted = fmt(kpiKey, value)

  let changePct: number | null = null
  let changeDir: 'up' | 'down' | 'flat' = 'flat'
  if (prevValue !== undefined && prevValue !== null && prevValue !== 0 && value !== null) {
    changePct = ((value - prevValue) / prevValue) * 100
    changeDir = changePct > 0.5 ? 'up' : changePct < -0.5 ? 'down' : 'flat'
  }

  // For CPL/CPA/CPC/CPM — lower is better (invert colour)
  const lowerIsBetter = ['cpl','cpa','cpc','cpm'].includes(kpiKey)
  const positiveColor = lowerIsBetter ? 'var(--red)' : 'var(--green)'
  const negativeColor = lowerIsBetter ? 'var(--green)' : 'var(--red)'

  const changeColor = changeDir === 'up'
    ? positiveColor
    : changeDir === 'down'
    ? negativeColor
    : 'var(--text-muted)'

  return (
    <div
      className="card animate-slide"
      style={{
        padding: '20px',
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'both',
        opacity: 0,
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
        {label}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        marginBottom: '10px',
      }}>
        {formatted}
      </div>

      {changePct !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: changeColor }}>
          {changeDir === 'up'   && <TrendingUp  size={12} />}
          {changeDir === 'down' && <TrendingDown size={12} />}
          {changeDir === 'flat' && <Minus        size={12} />}
          <span>{changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}% vs prior period</span>
        </div>
      )}

      {changePct === null && (
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          No comparison data
        </div>
      )}
    </div>
  )
}
