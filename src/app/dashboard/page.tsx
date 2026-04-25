'use client'
import { useMemo, useState } from 'react'
import { subDays, format, parseISO, isWithinInterval } from 'date-fns'
import { Calendar } from 'lucide-react'
import {
  computeMetrics, aggregateMetrics, getKpisForObjectives, fmt,
  type Platform, type Objective, type DailyMetric, type RawMetrics
} from '@/lib/metrics'
import { demoCampaigns, generateDailyMetrics, demoCreativeGroups } from '@/lib/demoData'
import KpiCard            from '@/components/dashboard/KpiCard'
import SpendResultsChart  from '@/components/dashboard/SpendResultsChart'
import PlatformChart      from '@/components/dashboard/PlatformChart'
import TrendChart         from '@/components/dashboard/TrendChart'
import CreativeTable      from '@/components/dashboard/CreativeTable'
import FilterBar, { FilterState, demoAdAccounts, demoCampaignsByAccount } from '@/components/dashboard/FilterBar'
import CreativePerformanceChart from '@/components/dashboard/CreativePerformanceChart'
import PlatformTrendChart from '@/components/dashboard/PlatformTrendChart'
import FrequencyChart     from '@/components/dashboard/FrequencyChart'

const allMetrics = generateDailyMetrics(30)

function filterMetrics(rows: DailyMetric[], filters: FilterState): DailyMetric[] {
  const today = new Date()
  const start = subDays(today, filters.days - 1)

  return rows.filter(r => {
    const d = parseISO(r.date)
    if (!isWithinInterval(d, { start, end: today })) return false
    if (filters.platforms.length > 0 && !filters.platforms.includes(r.platform)) return false
    const campaign = demoCampaigns.find(c => c.id === r.campaign_id)
    if (!campaign) return false
    if (filters.accounts.length > 0) {
      const accountsForPlatform = demoAdAccounts[r.platform]?.map(a => a.id) ?? []
      const selectedAccountsForPlatform = filters.accounts.filter(a => accountsForPlatform.includes(a))
      if (selectedAccountsForPlatform.length > 0) {
        const campaignNames = selectedAccountsForPlatform.flatMap(a => demoCampaignsByAccount[a] ?? [])
        if (!campaignNames.includes(campaign.name)) return false
      }
    }
    if (filters.campaigns.length > 0 && !filters.campaigns.includes(campaign.name)) return false
    return true
  })
}

function sumMetrics(rows: DailyMetric[]): RawMetrics {
  return aggregateMetrics(rows.map(r => ({
    impressions: r.impressions, reach: r.reach, clicks: r.clicks, spend: r.spend,
    leads: r.leads, conversions: r.conversions, revenue: r.revenue, engagements: r.engagements, video_views: 0,
  })))
}

function groupByDate(rows: DailyMetric[]) {
  const map = new Map<string, RawMetrics & { date: string }>()
  rows.forEach(r => {
    const e = map.get(r.date)
    if (e) { e.impressions+=r.impressions; e.reach+=r.reach; e.clicks+=r.clicks; e.spend+=r.spend; e.leads+=r.leads; e.conversions+=r.conversions; e.revenue+=r.revenue; e.engagements+=r.engagements }
    else map.set(r.date, { date: r.date, impressions: r.impressions, reach: r.reach, clicks: r.clicks, spend: r.spend, leads: r.leads, conversions: r.conversions, revenue: r.revenue, engagements: r.engagements, video_views: 0 })
  })
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function groupByPlatform(rows: DailyMetric[]) {
  const map = new Map<Platform, RawMetrics>()
  rows.forEach(r => {
    const e = map.get(r.platform)
    if (e) { e.spend+=r.spend; e.impressions+=r.impressions; e.clicks+=r.clicks; e.leads+=r.leads; e.conversions+=r.conversions; e.revenue+=r.revenue; e.reach+=r.reach; e.engagements+=r.engagements }
    else map.set(r.platform, { impressions: r.impressions, reach: r.reach, clicks: r.clicks, spend: r.spend, leads: r.leads, conversions: r.conversions, revenue: r.revenue, engagements: r.engagements, video_views: 0 })
  })
  return Array.from(map.entries()).map(([platform, m]) => ({ platform, ...m }))
}

type TabKey = 'creatives' | 'platform' | 'trends' | 'creative-perf' | 'frequency'

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({ days: 30, platforms: [], accounts: [], campaigns: [] })
  const [activeTab, setActiveTab] = useState<TabKey>('creatives')

  const currentRows = useMemo(() => filterMetrics(allMetrics, filters), [filters])
  const priorRows = useMemo(() => {
    const today = new Date()
    const end   = subDays(today, filters.days)
    const start = subDays(end, filters.days - 1)
    return allMetrics.filter(r => {
      const d = parseISO(r.date)
      return isWithinInterval(d, { start, end })
    })
  }, [filters.days])

  const currentRaw = useMemo(() => sumMetrics(currentRows), [currentRows])
  const priorRaw   = useMemo(() => sumMetrics(priorRows),   [priorRows])
  const current    = useMemo(() => computeMetrics(currentRaw), [currentRaw])
  const prior      = useMemo(() => computeMetrics(priorRaw),   [priorRaw])

  const activeObjectives = useMemo(() =>
    Array.from(new Set(demoCampaigns.filter(c => c.status === 'active').map(c => c.objective))) as Objective[],
  [])
  const kpis = useMemo(() => getKpisForObjectives(activeObjectives), [activeObjectives])

  const dailyData    = useMemo(() => groupByDate(currentRows), [currentRows])
  const platformData = useMemo(() => groupByPlatform(currentRows), [currentRows])
  const trendData    = useMemo(() => dailyData.map(d => { const m = computeMetrics(d); return { date: d.date, ctr: m.ctr, cpl: m.cpl } }), [dailyData])

  const creativeRows = useMemo(() => demoCreativeGroups.map(cg => {
    const names = cg.ads.map(a => a.ad_name)
    const rows  = currentRows.filter(r => { const c = demoCampaigns.find(x => x.id === r.campaign_id); return c && names.includes(c.name) })
    return { ...cg, metrics: computeMetrics(sumMetrics(rows)) }
  }), [currentRows])

  const primaryResult = activeObjectives.includes('lead_gen') ? 'leads' : activeObjectives.includes('conversions') ? 'conversions' : activeObjectives.includes('traffic') ? 'clicks' : 'impressions'
  const primaryLabel  = primaryResult === 'leads' ? 'Leads' : primaryResult === 'conversions' ? 'Conversions' : primaryResult === 'clicks' ? 'Clicks' : 'Impressions'

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'creatives',    label: 'Creative groups'    },
    { key: 'creative-perf',label: 'Creative performance'},
    { key: 'platform',     label: 'By platform'        },
    { key: 'trends',       label: 'CTR & CPL trends'   },
    { key: 'frequency',    label: 'Reach & frequency'  },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Overview</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <Calendar size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
          {format(new Date(), 'MMMM d, yyyy')} · All platforms · Demo data
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {kpis.map((k, i) => (
          <KpiCard key={k} kpiKey={k} value={current[k] as number | null} prevValue={prior[k] as number | null} index={i} />
        ))}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <SpendResultsChart data={dailyData} resultKey={primaryResult as any} resultLabel={primaryLabel} />
      </div>

      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '8px 16px', background: 'transparent', border: 'none',
            borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '12px', fontWeight: activeTab === tab.key ? 500 : 400,
            cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: '-1px', whiteSpace: 'nowrap',
          }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'creatives'     && <div className="animate-fade"><CreativeTable rows={creativeRows} /></div>}
      {activeTab === 'creative-perf' && <div className="animate-fade"><CreativePerformanceChart data={creativeRows.map(r => ({ name: r.name + ' (' + r.language + ')', roas: r.metrics.roas ?? 0, leads: r.metrics.leads ?? 0, spend: r.metrics.spend ?? 0, cpl: r.metrics.cpl }))} /></div>}
      {activeTab === 'platform' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <PlatformChart data={platformData} metricKey="spend"       metricLabel="Spend"       />
          <PlatformChart data={platformData} metricKey="leads"       metricLabel="Leads"       />
          <PlatformChart data={platformData} metricKey="clicks"      metricLabel="Clicks"      />
          <PlatformChart data={platformData} metricKey="impressions" metricLabel="Impressions" />
        </div>
      )}
      {activeTab === 'trends' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <TrendChart data={trendData} metricKey="ctr" label="CTR" color="#6366f1" />
          <TrendChart data={trendData} metricKey="cpl" label="CPL" color="#f59e0b" />
          <PlatformTrendChart rows={currentRows} metric="spend" label="Spend by platform over time" />
          <PlatformTrendChart rows={currentRows} metric="leads" label="Leads by platform over time" />
        </div>
      )}
      {activeTab === 'frequency' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FrequencyChart data={dailyData} />
          <PlatformChart data={platformData} metricKey="reach" metricLabel="Reach by platform" />
        </div>
      )}

      <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active campaigns', value: demoCampaigns.filter(c=>c.status==='active').length.toString() },
          { label: 'Active platforms', value: Array.from(new Set(demoCampaigns.filter(c=>c.status==='active').map(c=>c.platform))).length.toString() },
          { label: 'Creative groups',  value: demoCreativeGroups.length.toString() },
          { label: 'Total spend',      value: fmt('spend', current.spend) },
          { label: 'Total leads',      value: fmt('leads', current.leads) },
          { label: 'Blended ROAS',     value: fmt('roas',  current.roas)  },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
