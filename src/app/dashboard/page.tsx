'use client'
import { useMemo, useState } from 'react'
import { subDays, format, parseISO, isWithinInterval } from 'date-fns'
import { RefreshCw, Calendar, ChevronDown } from 'lucide-react'

import {
  computeMetrics, aggregateMetrics, getKpisForObjectives,
  platformLabel, fmt, fmtChange,
  type Platform, type Objective, type DailyMetric, type RawMetrics
} from '@/lib/metrics'
import { demoCampaigns, generateDailyMetrics, demoCreativeGroups } from '@/lib/demoData'

import KpiCard            from '@/components/dashboard/KpiCard'
import SpendResultsChart  from '@/components/dashboard/SpendResultsChart'
import PlatformChart      from '@/components/dashboard/PlatformChart'
import TrendChart         from '@/components/dashboard/TrendChart'
import CreativeTable      from '@/components/dashboard/CreativeTable'

// ── Stable demo data (generated once) ────────────────────────────────────────
const allMetrics = generateDailyMetrics(30)

// ── Date range options ────────────────────────────────────────────────────────
const ranges = [
  { label: 'Last 7 days',  days: 7  },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
]

// ── Filter metrics to a date window ─────────────────────────────────────────
function filterByDays(rows: DailyMetric[], days: number): DailyMetric[] {
  const end   = new Date()
  const start = subDays(end, days - 1)
  return rows.filter(r => {
    const d = parseISO(r.date)
    return isWithinInterval(d, { start, end })
  })
}

// ── Sum metrics by campaign ids ───────────────────────────────────────────────
function sumMetrics(rows: DailyMetric[]): RawMetrics {
  return aggregateMetrics(rows.map(r => ({
    impressions: r.impressions,
    reach:       r.reach,
    clicks:      r.clicks,
    spend:       r.spend,
    leads:       r.leads,
    conversions: r.conversions,
    revenue:     r.revenue,
    engagements: r.engagements,
    video_views: 0,
  })))
}

// ── Group daily totals for charts ─────────────────────────────────────────────
function groupByDate(rows: DailyMetric[]) {
  const map = new Map<string, RawMetrics & { date: string }>()
  rows.forEach(r => {
    const existing = map.get(r.date)
    if (existing) {
      existing.impressions += r.impressions
      existing.reach       += r.reach
      existing.clicks      += r.clicks
      existing.spend       += r.spend
      existing.leads       += r.leads
      existing.conversions += r.conversions
      existing.revenue     += r.revenue
      existing.engagements += r.engagements
    } else {
      map.set(r.date, {
        date: r.date,
        impressions: r.impressions,
        reach:       r.reach,
        clicks:      r.clicks,
        spend:       r.spend,
        leads:       r.leads,
        conversions: r.conversions,
        revenue:     r.revenue,
        engagements: r.engagements,
        video_views: 0,
      })
    }
  })
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

// ── Group by platform ─────────────────────────────────────────────────────────
function groupByPlatform(rows: DailyMetric[]) {
  const map = new Map<Platform, RawMetrics>()
  rows.forEach(r => {
    const existing = map.get(r.platform)
    if (existing) {
      existing.spend       += r.spend
      existing.impressions += r.impressions
      existing.clicks      += r.clicks
      existing.leads       += r.leads
      existing.conversions += r.conversions
      existing.revenue     += r.revenue
    } else {
      map.set(r.platform, {
        impressions: r.impressions, reach: r.reach,
        clicks: r.clicks, spend: r.spend, leads: r.leads,
        conversions: r.conversions, revenue: r.revenue,
        engagements: r.engagements, video_views: 0,
      })
    }
  })
  return Array.from(map.entries()).map(([platform, m]) => ({ platform, ...m }))
}

export default function DashboardPage() {
  const [rangeIdx, setRangeIdx] = useState(2)         // default: 30 days
  const [activeTab, setActiveTab] = useState<'creatives' | 'platform' | 'trends'>('creatives')

  const { days } = ranges[rangeIdx]

  // Current & prior period metrics
  const currentRows = useMemo(() => filterByDays(allMetrics, days), [days])
  const priorRows   = useMemo(() => {
    const end   = subDays(new Date(), days)
    const start = subDays(end, days - 1)
    return allMetrics.filter(r => {
      const d = parseISO(r.date)
      return isWithinInterval(d, { start, end })
    })
  }, [days])

  const currentRaw  = useMemo(() => sumMetrics(currentRows), [currentRows])
  const priorRaw    = useMemo(() => sumMetrics(priorRows),   [priorRows])
  const current     = useMemo(() => computeMetrics(currentRaw), [currentRaw])
  const prior       = useMemo(() => computeMetrics(priorRaw),   [priorRaw])

  // Determine active objectives from campaigns
  const activeObjectives = useMemo(() =>
    Array.from(new Set(demoCampaigns.filter(c => c.status === 'active').map(c => c.objective))) as Objective[],
  [])
  const kpis = useMemo(() => getKpisForObjectives(activeObjectives), [activeObjectives])

  // Chart data
  const dailyData   = useMemo(() => groupByDate(currentRows), [currentRows])
  const platformData = useMemo(() => groupByPlatform(currentRows), [currentRows])

  // CTR & CPL trend (daily computed)
  const trendData = useMemo(() =>
    dailyData.map(d => {
      const m = computeMetrics(d)
      return { date: d.date, ctr: m.ctr, cpl: m.cpl }
    }),
  [dailyData])

  // Creative group metrics
  const creativeRows = useMemo(() => {
    return demoCreativeGroups.map(cg => {
      const platformNames = cg.ads.map(a => a.ad_name)
      const rows = currentRows.filter(r =>
        demoCampaigns.find(c => c.id === r.campaign_id && platformNames.includes(c.name))
      )
      const raw = sumMetrics(rows)
      return { ...cg, metrics: computeMetrics(raw) }
    })
  }, [currentRows])

  // Primary result key for spend chart
  const primaryResult = activeObjectives.includes('lead_gen')       ? 'leads'
                      : activeObjectives.includes('conversions')     ? 'conversions'
                      : activeObjectives.includes('traffic')         ? 'clicks'
                      : 'impressions'
  const primaryLabel  = primaryResult === 'leads'       ? 'Leads'
                      : primaryResult === 'conversions' ? 'Conversions'
                      : primaryResult === 'clicks'      ? 'Clicks'
                      : 'Impressions'

  const today = format(new Date(), 'MMMM d, yyyy')

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1400px' }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '4px',
          }}>
            Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <Calendar size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
            {today} · All platforms · Demo data
          </p>
        </div>

        {/* Date range selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {ranges.map((r, i) => (
            <button
              key={i}
              onClick={() => setRangeIdx(i)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: rangeIdx === i ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: rangeIdx === i ? 'var(--accent-dim)' : 'transparent',
                color: rangeIdx === i ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: rangeIdx === i ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="stagger" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {kpis.map((k, i) => (
          <KpiCard
            key={k}
            kpiKey={k}
            value={current[k] as number | null}
            prevValue={prior[k] as number | null}
            index={i}
          />
        ))}
      </div>

      {/* ── Spend vs Results Chart ── */}
      <div style={{ marginBottom: '16px' }}>
        <SpendResultsChart
          data={dailyData}
          resultKey={primaryResult as any}
          resultLabel={primaryLabel}
        />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {([
          { key: 'creatives', label: 'Creative groups' },
          { key: 'platform',  label: 'By platform'    },
          { key: 'trends',    label: 'Trends'          },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Creative Groups ── */}
      {activeTab === 'creatives' && (
        <div className="animate-fade">
          <CreativeTable rows={creativeRows} />
        </div>
      )}

      {/* ── Tab: Platform ── */}
      {activeTab === 'platform' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <PlatformChart data={platformData} metricKey="spend"  metricLabel="Spend"  />
          <PlatformChart data={platformData} metricKey="leads"  metricLabel="Leads"  />
          <PlatformChart data={platformData} metricKey="clicks" metricLabel="Clicks" />
          <PlatformChart data={platformData} metricKey="impressions" metricLabel="Impressions" />
        </div>
      )}

      {/* ── Tab: Trends ── */}
      {activeTab === 'trends' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <TrendChart data={trendData} metricKey="ctr" label="CTR"  color="#6366f1" />
          <TrendChart data={trendData} metricKey="cpl" label="CPL"  color="#f59e0b" />
        </div>
      )}

      {/* ── Summary strip ── */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px',
      }}>
        {[
          { label: 'Active campaigns', value: demoCampaigns.filter(c=>c.status==='active').length.toString() },
          { label: 'Active platforms', value: [...new Set(demoCampaigns.filter(c=>c.status==='active').map(c=>c.platform))].length.toString() },
          { label: 'Creative groups',  value: demoCreativeGroups.length.toString() },
          { label: 'Total spend',      value: fmt('spend', current.spend) },
          { label: 'Total leads',      value: fmt('leads', current.leads) },
          { label: 'Blended ROAS',     value: fmt('roas',  current.roas)  },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
