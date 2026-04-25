'use client'
import { useState } from 'react'
import { demoCreativeGroups } from '@/lib/demoData'
import { generateDailyMetrics } from '@/lib/demoData'
import { demoCampaigns } from '@/lib/demoData'
import { computeMetrics, aggregateMetrics, platformLabel, platformColor, fmt, type Platform } from '@/lib/metrics'
import { Plus, Layers, X } from 'lucide-react'

const allMetrics = generateDailyMetrics(30)

function groupMetrics(adNames: string[]) {
  const rows = allMetrics.filter(r => demoCampaigns.find(c => c.id === r.campaign_id && adNames.includes(c.name)))
  const raw = aggregateMetrics(rows.map(r => ({ impressions:r.impressions, reach:r.reach, clicks:r.clicks, spend:r.spend, leads:r.leads, conversions:r.conversions, revenue:r.revenue, engagements:r.engagements, video_views:0 })))
  return computeMetrics(raw)
}

const LANGS = ['EN','AR','SI','FR','DE']

export default function CreativesPage() {
  const [groups, setGroups] = useState(demoCreativeGroups)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLang, setNewLang] = useState('EN')

  function addGroup() {
    if (!newName.trim()) return
    setGroups(g => [...g, { id:`cg${Date.now()}`, name:newName, language:newLang, ads:[] }])
    setNewName(''); setShowNew(false)
  }

  const inputStyle = { padding:'9px 12px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text-primary)', fontSize:'13px', outline:'none', fontFamily:'var(--font-body)', width:'100%' }

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Creative groups</h1>
        <button onClick={()=>setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 16px', borderRadius:'8px', background:'var(--accent)', color:'#fff', fontSize:'13px', fontWeight:500, border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
          <Plus size={14} /> New group
        </button>
      </div>
      <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'28px' }}>
        Group the same creative running across multiple platforms to see unified performance.
      </p>

      {showNew && (
        <div className="card" style={{ padding:'20px', marginBottom:'20px', border:'1px solid var(--accent)' }}>
          <div style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)', marginBottom:'14px' }}>New creative group</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 120px auto', gap:'10px', alignItems:'flex-end' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--text-muted)', display:'block', marginBottom:'5px' }}>Group name</label>
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Summer Sale 2025" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--text-muted)', display:'block', marginBottom:'5px' }}>Language</label>
              <select value={newLang} onChange={e=>setNewLang(e.target.value)} style={{ ...inputStyle, width:'100%' }}>
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={addGroup} style={{ padding:'9px 16px', borderRadius:'8px', background:'var(--accent)', color:'#fff', fontSize:'13px', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>Create</button>
              <button onClick={()=>setShowNew(false)} style={{ padding:'9px 12px', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text-muted)', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-body)' }}><X size={14}/></button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'16px' }}>
        {groups.map(cg => {
          const m = groupMetrics(cg.ads.map(a => a.ad_name))
          return (
            <div key={cg.id} className="card" style={{ padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--accent-dim)', border:'1px solid var(--accent-glow)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Layers size={16} style={{ color:'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'var(--text-primary)' }}>{cg.name}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{cg.ads.length} ad{cg.ads.length !== 1 ? 's' : ''} · {cg.language}</div>
                  </div>
                </div>
                <span style={{ padding:'3px 8px', borderRadius:'10px', background:'var(--accent-dim)', color:'var(--accent)', fontSize:'11px', fontWeight:500 }}>{cg.language}</span>
              </div>

              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
                {cg.ads.map(a => (
                  <span key={`${a.platform}-${a.ad_name}`} style={{ fontSize:'11px', padding:'3px 8px', borderRadius:'6px', background:`${platformColor[a.platform]}15`, color:platformColor[a.platform], border:`1px solid ${platformColor[a.platform]}30` }}>
                    {platformLabel[a.platform]}
                  </span>
                ))}
                {cg.ads.length === 0 && <span style={{ fontSize:'12px', color:'var(--text-dim)' }}>No ads linked yet</span>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
                {[['Spend', fmt('spend', m.spend)], ['Leads', fmt('leads', m.leads)], ['ROAS', fmt('roas', m.roas)]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px' }}>{label}</div>
                    <div style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
