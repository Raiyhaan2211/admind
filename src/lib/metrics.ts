// ── Types ─────────────────────────────────────────────────────────────────────

export type Platform = 'google' | 'meta' | 'tiktok' | 'linkedin' | 'snapchat'
export type Objective = 'awareness' | 'traffic' | 'engagement' | 'lead_gen' | 'conversions'
export type CampaignStatus = 'active' | 'paused' | 'ended'

export interface RawMetrics {
  impressions: number
  reach: number
  clicks: number
  spend: number
  leads: number
  conversions: number
  revenue: number
  engagements: number
  video_views: number
}

export interface ComputedMetrics extends RawMetrics {
  cpm: number | null
  ctr: number | null
  cpc: number | null
  cpl: number | null
  cpa: number | null
  roas: number | null
  frequency: number | null
}

export interface Campaign {
  id: string
  name: string
  platform: Platform
  objective: Objective
  status: CampaignStatus
  start_date: string
  budget: number
}

export interface DailyMetric {
  date: string
  campaign_id: string
  platform: Platform
  impressions: number
  reach: number
  clicks: number
  spend: number
  leads: number
  conversions: number
  revenue: number
  engagements: number
}

export interface CreativeGroup {
  id: string
  name: string
  language: string
  ads: { platform: Platform; ad_name: string }[]
}

// ── Safe metric computation ───────────────────────────────────────────────────

function safe(num: number, den: number): number | null {
  if (!den || !isFinite(den) || !isFinite(num)) return null
  return num / den
}

export function computeMetrics(r: RawMetrics): ComputedMetrics {
  return {
    ...r,
    cpm:       r.impressions > 0 ? safe(r.spend, r.impressions / 1000) : null,
    ctr:       r.impressions > 0 ? safe(r.clicks, r.impressions)       : 0,
    cpc:       r.clicks > 0      ? safe(r.spend, r.clicks)             : null,
    cpl:       r.leads > 0       ? safe(r.spend, r.leads)              : null,
    cpa:       r.conversions > 0 ? safe(r.spend, r.conversions)        : null,
    roas:      r.spend > 0       ? safe(r.revenue, r.spend)            : null,
    frequency: r.reach > 0       ? safe(r.impressions, r.reach)        : null,
  }
}

export function aggregateMetrics(rows: RawMetrics[]): RawMetrics {
  const base: RawMetrics = { impressions:0, reach:0, clicks:0, spend:0, leads:0, conversions:0, revenue:0, engagements:0, video_views:0 }
  rows.forEach(r => {
    base.impressions  += r.impressions
    base.reach        += r.reach
    base.clicks       += r.clicks
    base.spend        += r.spend
    base.leads        += r.leads
    base.conversions  += r.conversions
    base.revenue      += r.revenue
    base.engagements  += r.engagements
    base.video_views  += r.video_views
  })
  return base
}

// ── KPI card configuration per objective ─────────────────────────────────────

export type KpiKey = keyof ComputedMetrics

export const objectiveKpis: Record<Objective, KpiKey[]> = {
  awareness:   ['impressions', 'reach', 'cpm', 'frequency'],
  traffic:     ['clicks', 'ctr', 'cpc', 'spend'],
  engagement:  ['engagements', 'impressions', 'ctr', 'spend'],
  lead_gen:    ['leads', 'cpl', 'clicks', 'spend'],
  conversions: ['conversions', 'roas', 'cpa', 'spend'],
}

export function getKpisForObjectives(objectives: Objective[]): KpiKey[] {
  const seen = new Set<KpiKey>()
  objectives.forEach(o => objectiveKpis[o].forEach(k => seen.add(k)))
  return Array.from(seen).slice(0, 8)
}

// ── Labels & colours ──────────────────────────────────────────────────────────

export const kpiLabel: Partial<Record<KpiKey, string>> = {
  impressions:'Impressions', reach:'Reach',        clicks:'Clicks',
  spend:'Total spend',       leads:'Leads',        conversions:'Conversions',
  revenue:'Revenue',         cpm:'CPM',            ctr:'CTR',
  cpc:'CPC',                 cpl:'CPL',            cpa:'CPA',
  roas:'ROAS',               frequency:'Frequency',engagements:'Engagements',
}

export const platformLabel: Record<Platform, string> = {
  google:'Google', meta:'Meta', tiktok:'TikTok', linkedin:'LinkedIn', snapchat:'Snapchat',
}

export const platformColor: Record<Platform, string> = {
  google:'#4285F4', meta:'#1877F2', tiktok:'#00f2ea', linkedin:'#0A66C2', snapchat:'#FFFC00',
}

export const objectiveLabel: Record<Objective, string> = {
  awareness:'Awareness', traffic:'Traffic', engagement:'Engagement',
  lead_gen:'Lead generation', conversions:'Conversions',
}

// ── Format helpers ────────────────────────────────────────────────────────────

export function fmt(key: KpiKey, value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  switch (key) {
    case 'spend': case 'cpc': case 'cpl': case 'cpa':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    case 'cpm':
      return `$${value.toFixed(2)}`
    case 'roas':
      return `${value.toFixed(2)}x`
    case 'ctr':
      return `${(value * 100).toFixed(2)}%`
    case 'frequency':
      return value.toFixed(2)
    case 'impressions': case 'reach': case 'clicks':
    case 'leads': case 'conversions': case 'engagements': case 'video_views':
      return value >= 1_000_000 ? `${(value/1_000_000).toFixed(1)}M`
           : value >= 1_000     ? `${(value/1_000).toFixed(1)}K`
           : value.toLocaleString()
    default:
      return value.toLocaleString()
  }
}

export function fmtChange(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
}
