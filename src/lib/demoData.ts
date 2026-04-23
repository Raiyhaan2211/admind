import { Campaign, DailyMetric, CreativeGroup, Platform } from './metrics'
import { subDays, format } from 'date-fns'

// ── Campaigns ─────────────────────────────────────────────────────────────────

export const demoCampaigns: Campaign[] = [
  { id:'c1', name:'Summer Sale — EN',     platform:'meta',     objective:'lead_gen',    status:'active', start_date:'2025-06-01', budget:3000 },
  { id:'c2', name:'Summer Sale — EN',     platform:'google',   objective:'lead_gen',    status:'active', start_date:'2025-06-01', budget:2500 },
  { id:'c3', name:'Summer Sale — AR',     platform:'meta',     objective:'lead_gen',    status:'active', start_date:'2025-06-01', budget:1500 },
  { id:'c4', name:'Brand Awareness Q2',   platform:'tiktok',   objective:'awareness',   status:'active', start_date:'2025-05-15', budget:2000 },
  { id:'c5', name:'Brand Awareness Q2',   platform:'snapchat', objective:'awareness',   status:'active', start_date:'2025-05-15', budget:800  },
  { id:'c6', name:'Retargeting — Cart',   platform:'meta',     objective:'conversions', status:'active', start_date:'2025-06-10', budget:1200 },
  { id:'c7', name:'Retargeting — Cart',   platform:'google',   objective:'conversions', status:'active', start_date:'2025-06-10', budget:900  },
  { id:'c8', name:'Product Demo — B2B',   platform:'linkedin', objective:'lead_gen',    status:'active', start_date:'2025-06-05', budget:1800 },
  { id:'c9', name:'Traffic — Blog',       platform:'google',   objective:'traffic',     status:'paused', start_date:'2025-05-01', budget:500  },
  { id:'c10',name:'Engagement — Ramadan', platform:'meta',     objective:'engagement',  status:'ended',  start_date:'2025-03-01', budget:2200 },
]

// ── Daily metrics generator ───────────────────────────────────────────────────

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randF(min: number, max: number) { return Math.random() * (max - min) + min }

const campaignProfiles: Record<string, {
  impressions: [number,number], clicks: [number,number], spend: [number,number],
  leads: [number,number], conversions: [number,number], revenue_mult: number
}> = {
  c1:  { impressions:[8000,15000], clicks:[400,800],   spend:[80,140],  leads:[18,40],  conversions:[0,0],   revenue_mult:0 },
  c2:  { impressions:[6000,12000], clicks:[500,900],   spend:[70,130],  leads:[14,32],  conversions:[0,0],   revenue_mult:0 },
  c3:  { impressions:[5000,10000], clicks:[280,550],   spend:[45,90],   leads:[10,25],  conversions:[0,0],   revenue_mult:0 },
  c4:  { impressions:[25000,50000],clicks:[300,700],   spend:[55,110],  leads:[0,0],    conversions:[0,0],   revenue_mult:0 },
  c5:  { impressions:[18000,35000],clicks:[150,350],   spend:[22,45],   leads:[0,0],    conversions:[0,0],   revenue_mult:0 },
  c6:  { impressions:[3000,6000],  clicks:[200,450],   spend:[60,120],  leads:[0,0],    conversions:[8,22],  revenue_mult:85 },
  c7:  { impressions:[2500,5000],  clicks:[180,380],   spend:[50,95],   leads:[0,0],    conversions:[6,18],  revenue_mult:90 },
  c8:  { impressions:[4000,8000],  clicks:[120,280],   spend:[90,160],  leads:[5,15],   conversions:[0,0],   revenue_mult:0 },
  c9:  { impressions:[3000,7000],  clicks:[400,900],   spend:[20,40],   leads:[0,0],    conversions:[0,0],   revenue_mult:0 },
  c10: { impressions:[12000,22000],clicks:[800,1800],  spend:[65,120],  leads:[0,0],    conversions:[0,0],   revenue_mult:0 },
}

export function generateDailyMetrics(days = 30): DailyMetric[] {
  const rows: DailyMetric[] = []
  const today = new Date()

  demoCampaigns.forEach(c => {
    const profile = campaignProfiles[c.id]
    if (!profile) return
    const activeDays = c.status === 'ended' ? Math.min(days, 14) : days

    for (let i = activeDays - 1; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd')
      const impressions = rand(...profile.impressions)
      const reach       = Math.floor(impressions * randF(0.72, 0.88))
      const clicks      = rand(...profile.clicks)
      const spend       = parseFloat(randF(profile.spend[0], profile.spend[1]).toFixed(2))
      const leads       = rand(...profile.leads)
      const conversions = rand(...profile.conversions)
      const revenue     = parseFloat((conversions * profile.revenue_mult * randF(0.8, 1.2)).toFixed(2))
      const engagements = c.objective === 'engagement' ? rand(500, 2000) : rand(20, 120)
      const video_views = ['tiktok','snapchat'].includes(c.platform) ? Math.floor(impressions * randF(0.4, 0.7)) : 0

      rows.push({ date, campaign_id:c.id, platform:c.platform, impressions, reach, clicks, spend, leads, conversions, revenue, engagements })
    }
  })
  return rows
}

// ── Creative groups ───────────────────────────────────────────────────────────

export const demoCreativeGroups: CreativeGroup[] = [
  {
    id: 'cg1', name: 'Summer Sale 2025', language: 'EN',
    ads: [
      { platform:'meta',   ad_name:'Summer Sale — EN' },
      { platform:'google', ad_name:'Summer Sale — EN' },
    ]
  },
  {
    id: 'cg2', name: 'Summer Sale 2025', language: 'AR',
    ads: [{ platform:'meta', ad_name:'Summer Sale — AR' }]
  },
  {
    id: 'cg3', name: 'Brand Awareness Q2', language: 'EN',
    ads: [
      { platform:'tiktok',   ad_name:'Brand Awareness Q2' },
      { platform:'snapchat', ad_name:'Brand Awareness Q2' },
    ]
  },
  {
    id: 'cg4', name: 'Retargeting — Cart', language: 'EN',
    ads: [
      { platform:'meta',   ad_name:'Retargeting — Cart' },
      { platform:'google', ad_name:'Retargeting — Cart' },
    ]
  },
  {
    id: 'cg5', name: 'Product Demo B2B', language: 'EN',
    ads: [{ platform:'linkedin', ad_name:'Product Demo — B2B' }]
  },
]
