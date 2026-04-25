'use client'
import { useState, useMemo } from 'react'
import { demoCampaigns, generateDailyMetrics } from '@/lib/demoData'
import { computeMetrics, aggregateMetrics, platformLabel, platformColor, objectiveLabel, fmt, type Platform } from '@/lib/metrics'
import { Pause, Play, Square } from 'lucide-react'

const allMetrics = generateDailyMetrics(30)

function getMetrics(id: string) {
  const rows = allMetrics.filter(r => r.campaign_id === id)
  const raw = aggregateMetrics(rows.map(r => ({ impressions:r.impressions, reach:r.reach, clicks:r.clicks, spend:r.spend, leads:r.leads, conversions:r.conversions, revenue:r.revenue, engagements:r.engagements, video_views:0 })))
  return computeMetrics(raw)
}

const statusColor = { active:'var(--green)', paused:'var(--amber)', ended:'var(--text-muted)' }

export default function CampaignsPage() {
  const [pf, setPf] = useState<Platform|'all'>('all')
  const [sf, setSf] = useState<'all'|'active'|'paused'|'ended'>('all')
  const platforms = Array.from(new Set(demoCampaigns.map(c => c.platform))) as Platform[]
  const filtered  = useMemo(() => demoCampaigns.filter(c => (pf === 'all' || c.platform === pf) && (sf === 'all' || c.status === sf)), [pf, sf])
  const pill = (active: boolean) => ({ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', border:`1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent-dim)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text-muted)', fontFamily:'var(--font-body)' })

  return (
    <div style={{ padding:'28px 32px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', marginBottom:'20px' }}>Campaigns</h1>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
        <button style={pill(pf==='all')} onClick={()=>setPf('all')}>All platforms</button>
        {platforms.map(p => <button key={p} style={pill(pf===p)} onClick={()=>setPf(p)}>{platformLabel[p]}</button>)}
        <div style={{ width:'1px', background:'var(--border)', margin:'0 4px' }} />
        {(['all','active','paused','ended'] as const).map(s => <button key={s} style={pill(sf===s)} onClick={()=>setSf(s)}>{s==='all'?'All status':s.charAt(0).toUpperCase()+s.slice(1)}</button>)}
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 100px 130px 90px 90px 90px 90px 80px', padding:'10px 16px', background:'var(--bg)', fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid var(--border)' }}>
          <div>Campaign</div><div>Platform</div><div>Objective</div><div>Spend</div><div>Leads</div><div>CPL</div><div>ROAS</div><div>Status</div>
        </div>
        {filtered.map(c => {
          const m = getMetrics(c.id)
          return (
            <div key={c.id} style={{ display:'grid', gridTemplateColumns:'2fr 100px 130px 90px 90px 90px 90px 80px', padding:'14px 16px', borderBottom:'1px solid var(--border)', alignItems:'center', cursor:'pointer' }}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-hover)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)', marginBottom:'2px' }}>{c.name}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>Budget: {fmt('spend', c.budget)}/mo</div>
              </div>
              <div><span style={{ fontSize:'11px', padding:'3px 8px', borderRadius:'6px', background:`${platformColor[c.platform]}18`, color:platformColor[c.platform] }}>{platformLabel[c.platform]}</span></div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{objectiveLabel[c.objective]}</div>
              <div style={{ fontSize:'13px', color:'var(--text-primary)' }}>{fmt('spend', m.spend)}</div>
              <div style={{ fontSize:'13px', color:'var(--text-primary)' }}>{fmt('leads', m.leads)}</div>
              <div style={{ fontSize:'13px', color: m.cpl !== null && m.cpl < 15 ? 'var(--green)' : 'var(--amber)' }}>{fmt('cpl', m.cpl)}</div>
              <div style={{ fontSize:'13px', color: m.roas !== null && m.roas > 3 ? 'var(--green)' : 'var(--text-primary)' }}>{fmt('roas', m.roas)}</div>
              <div style={{ fontSize:'12px', color:statusColor[c.status] }}>{c.status}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
