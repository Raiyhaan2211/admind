'use client'
import { useState } from 'react'
import { User, Phone, Mail, Tag, ChevronRight } from 'lucide-react'

type Status = 'new'|'working'|'potential'|'converted'|'lost'

interface Lead {
  id: string; name: string; phone: string; email: string
  status: Status; source: string; cpl: number; date: string; duplicate: boolean
}

const demoLeads: Lead[] = [
  { id:'l1',  name:'Ahmed Al-Rashid',   phone:'+971501234567', email:'ahmed@email.com',   status:'converted', source:'Meta',     cpl:8.40,  date:'2025-06-18', duplicate:false },
  { id:'l2',  name:'Sara Johnson',      phone:'+1234567890',   email:'sara@email.com',    status:'working',   source:'Google',   cpl:11.20, date:'2025-06-17', duplicate:false },
  { id:'l3',  name:'Mohammed Hassan',   phone:'+971551234567', email:'moh@email.com',     status:'new',       source:'TikTok',   cpl:6.80,  date:'2025-06-17', duplicate:false },
  { id:'l4',  name:'Emma Williams',     phone:'+441234567890', email:'emma@email.com',    status:'potential', source:'Meta',     cpl:9.50,  date:'2025-06-16', duplicate:false },
  { id:'l5',  name:'Khalid Al-Mansoori',phone:'+971561234567', email:'khalid@email.com',  status:'lost',      source:'LinkedIn', cpl:22.00, date:'2025-06-16', duplicate:false },
  { id:'l6',  name:'Ahmed Al-Rashid',   phone:'+971501234567', email:'ahmed@email.com',   status:'new',       source:'Google',   cpl:12.10, date:'2025-06-15', duplicate:true  },
  { id:'l7',  name:'Priya Sharma',      phone:'+919876543210', email:'priya@email.com',   status:'working',   source:'Meta',     cpl:7.30,  date:'2025-06-15', duplicate:false },
  { id:'l8',  name:'Carlos Rodriguez',  phone:'+34612345678',  email:'carlos@email.com',  status:'converted', source:'Google',   cpl:10.80, date:'2025-06-14', duplicate:false },
  { id:'l9',  name:'Fatima Al-Zahra',   phone:'+212612345678', email:'fatima@email.com',  status:'new',       source:'TikTok',   cpl:5.90,  date:'2025-06-14', duplicate:false },
  { id:'l10', name:'James Chen',        phone:'+85291234567',  email:'james@email.com',   status:'potential', source:'Meta',     cpl:13.40, date:'2025-06-13', duplicate:false },
]

const statusConfig: Record<Status, { label:string; color:string; bg:string }> = {
  new:       { label:'New',       color:'#6366f1', bg:'rgba(99,102,241,0.12)'  },
  working:   { label:'Working',   color:'#f59e0b', bg:'rgba(245,158,11,0.12)'  },
  potential: { label:'Potential', color:'#06b6d4', bg:'rgba(6,182,212,0.12)'   },
  converted: { label:'Converted', color:'#22c55e', bg:'rgba(34,197,94,0.12)'   },
  lost:      { label:'Lost',      color:'#6b6b82', bg:'rgba(107,107,130,0.12)' },
}

const stages: Status[] = ['new','working','potential','converted','lost']

export default function CrmPage() {
  const [leads, setLeads]   = useState(demoLeads)
  const [view, setView]     = useState<'list'|'kanban'>('list')
  const [filter, setFilter] = useState<Status|'all'>('all')

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const total    = leads.length
  const converted= leads.filter(l => l.status === 'converted').length
  const convRate = total > 0 ? ((converted/total)*100).toFixed(1) : '0'
  const dupes    = leads.filter(l => l.duplicate).length

  function updateStatus(id: string, status: Status) {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
  }

  const pill = (active: boolean) => ({ padding:'5px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', border:`1px solid ${active?'var(--accent)':'var(--border)'}`, background: active ? 'var(--accent-dim)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text-muted)', fontFamily:'var(--font-body)' })

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>CRM — Lead tracking</h1>
        <div style={{ display:'flex', gap:'6px' }}>
          {(['list','kanban'] as const).map(v => (
            <button key={v} style={pill(view===v)} onClick={()=>setView(v)}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Total leads',    value:total.toString()  },
          { label:'Converted',      value:converted.toString() },
          { label:'Conv. rate',     value:`${convRate}%`   },
          { label:'Duplicates',     value:dupes.toString(), warn:dupes > 0 },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:'16px' }}>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px' }}>{s.label}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:800, color: s.warn ? 'var(--amber)' : 'var(--text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
        <button style={pill(filter==='all')} onClick={()=>setFilter('all')}>All ({leads.length})</button>
        {stages.map(s => <button key={s} style={pill(filter===s)} onClick={()=>setFilter(s)}>{statusConfig[s].label} ({leads.filter(l=>l.status===s).length})</button>)}
      </div>

      {view === 'list' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 120px 100px 80px 80px 120px', padding:'10px 16px', background:'var(--bg)', fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid var(--border)' }}>
            <div>Lead</div><div>Source</div><div>CPL</div><div>Dupe</div><div>Date</div><div>Status</div>
          </div>
          {filtered.map(lead => (
            <div key={lead.id} style={{ display:'grid', gridTemplateColumns:'2fr 120px 100px 80px 80px 120px', padding:'14px 16px', borderBottom:'1px solid var(--border)', alignItems:'center' }}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-hover)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)', marginBottom:'2px' }}>{lead.name}</div>
                <div style={{ display:'flex', gap:'10px', fontSize:'11px', color:'var(--text-muted)' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Phone size={10}/>{lead.phone}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Mail size={10}/>{lead.email}</span>
                </div>
              </div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{lead.source}</div>
              <div style={{ fontSize:'13px', color:'var(--text-primary)' }}>${lead.cpl.toFixed(2)}</div>
              <div>{lead.duplicate && <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'10px', background:'rgba(245,158,11,0.12)', color:'var(--amber)' }}>Dupe</span>}</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{lead.date}</div>
              <div>
                <select value={lead.status} onChange={e=>updateStatus(lead.id, e.target.value as Status)}
                  style={{ padding:'4px 8px', borderRadius:'6px', border:`1px solid ${statusConfig[lead.status].color}40`, background:statusConfig[lead.status].bg, color:statusConfig[lead.status].color, fontSize:'12px', cursor:'pointer', fontFamily:'var(--font-body)', outline:'none' }}>
                  {stages.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'kanban' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'14px' }}>
          {stages.map(stage => {
            const stageleads = leads.filter(l => l.status === stage)
            const cfg = statusConfig[stage]
            return (
              <div key={stage}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:cfg.color }} />
                  <span style={{ fontSize:'12px', fontWeight:500, color:'var(--text-primary)' }}>{cfg.label}</span>
                  <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>({stageleads.length})</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {stageleads.map(lead => (
                    <div key={lead.id} className="card" style={{ padding:'12px' }}>
                      <div style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)', marginBottom:'4px' }}>{lead.name}</div>
                      <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px' }}>{lead.source} · ${lead.cpl.toFixed(2)}</div>
                      {lead.duplicate && <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'10px', background:'rgba(245,158,11,0.12)', color:'var(--amber)' }}>Duplicate</span>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
