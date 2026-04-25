'use client'
import { useState } from 'react'
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react'

type AlertSeverity = 'critical' | 'warning' | 'info'
type AlertStatus = 'active' | 'resolved'

interface AlertRule { id: string; name: string; condition: string; platform: string; enabled: boolean }
interface AlertEvent { id: string; title: string; desc: string; severity: AlertSeverity; status: AlertStatus; time: string; platform: string }

const defaultRules: AlertRule[] = [
  { id:'r1', name:'CPL spike',        condition:'CPL increases by more than 30%',         platform:'All',      enabled: true  },
  { id:'r2', name:'No delivery',      condition:'0 impressions for more than 2 hours',     platform:'All',      enabled: true  },
  { id:'r3', name:'High frequency',   condition:'Frequency exceeds 8',                     platform:'Meta',     enabled: true  },
  { id:'r4', name:'Budget overspend', condition:'Daily spend exceeds budget by 20%',        platform:'All',      enabled: false },
  { id:'r5', name:'Low ROAS',         condition:'ROAS drops below 1.5x',                   platform:'Google',   enabled: true  },
  { id:'r6', name:'CTR drop',         condition:'CTR drops more than 40% day-over-day',    platform:'All',      enabled: false },
]

const alertEvents: AlertEvent[] = [
  { id:'e1', title:'CPL spike detected',      desc:'Meta — Summer Sale EN CPL rose from $8.20 to $13.40 (+63%)',    severity:'critical', status:'active',   time:'2h ago',    platform:'Meta'     },
  { id:'e2', title:'High frequency warning',  desc:'Meta — Brand Awareness Q2 frequency reached 9.2',               severity:'warning',  status:'active',   time:'5h ago',    platform:'Meta'     },
  { id:'e3', title:'Budget pacing warning',   desc:'LinkedIn — Product Demo B2B is 35% over daily budget',          severity:'warning',  status:'active',   time:'3h ago',    platform:'LinkedIn' },
  { id:'e4', title:'No delivery — TikTok',    desc:'TikTok — Brand Awareness Q2 had 0 impressions for 3 hours',     severity:'critical', status:'resolved', time:'Yesterday', platform:'TikTok'   },
  { id:'e5', title:'ROAS recovered',          desc:'Google — Retargeting Cart ROAS back above 3x',                   severity:'info',     status:'resolved', time:'Yesterday', platform:'Google'   },
]

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>(defaultRules)
  const [tab, setTab] = useState<'events'|'rules'>('events')
  function toggleRule(id: string) { setRules(r => r.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x)) }

  const activeCount   = alertEvents.filter(e => e.status === 'active').length
  const criticalCount = alertEvents.filter(e => e.status === 'active' && e.severity === 'critical').length

  const severityStyle = (s: AlertSeverity, resolved: boolean) => {
    if (resolved) return { bg: 'var(--bg-card)', border: 'var(--border)', color: 'var(--text-muted)' }
    if (s === 'critical') return { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', color: '#ef4444' }
    if (s === 'warning')  return { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b' }
    return { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)', color: '#6366f1' }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Alerts</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Real-time monitoring for CPL spikes, delivery issues and budget problems</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {criticalCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
              <AlertTriangle size={14} /> {criticalCount} critical
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '13px' }}>
            <Bell size={14} /> {activeCount} active
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {(['events','rules'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', background: 'transparent', border: 'none',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: tab === t ? 500 : 400,
            cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: '-1px', textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alertEvents.map(e => {
            const s = severityStyle(e.severity, e.status === 'resolved')
            return (
              <div key={e.id} style={{ padding: '16px 18px', borderRadius: '10px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'flex-start', gap: '14px', opacity: e.status === 'resolved' ? 0.6 : 1 }}>
                <div style={{ color: s.color, marginTop: '2px', flexShrink: 0 }}>
                  {e.status === 'resolved' ? <CheckCircle size={16} /> : e.severity === 'critical' ? <AlertTriangle size={16} /> : <TrendingUp size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{e.title}</span>
                    <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '10px', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>{e.platform}</span>
                    {e.status === 'resolved' && <span style={{ fontSize: '11px', color: 'var(--green)' }}>✓ Resolved</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{e.desc}</div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{e.time}</div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'rules' && (
        <div>
          <div className="card" style={{ overflow: 'hidden', marginBottom: '14px' }}>
            {rules.map((rule, i) => (
              <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: i < rules.length - 1 ? '1px solid var(--border)' : 'none', opacity: rule.enabled ? 1 : 0.5 }}>
                <div onClick={() => toggleRule(rule.id)} style={{ width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer', flexShrink: 0, background: rule.enabled ? 'var(--accent)' : 'var(--border)', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', left: rule.enabled ? '19px' : '3px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{rule.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rule.condition}</div>
                </div>
                <div style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>{rule.platform}</div>
                <Trash2 size={14} style={{ color: 'var(--text-dim)', cursor: 'pointer' }} />
              </div>
            ))}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <Plus size={14} /> Add alert rule
          </button>
        </div>
      )}
    </div>
  )
}
