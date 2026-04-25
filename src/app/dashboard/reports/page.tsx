'use client'
import { useState, useMemo } from 'react'
import { generateDailyMetrics } from '@/lib/demoData'
import { computeMetrics, aggregateMetrics, fmt } from '@/lib/metrics'
import { FileText, Download, Plus } from 'lucide-react'

const allMetrics = generateDailyMetrics(30)

const reportTemplates = [
  { id: 'weekly',   name: 'Weekly performance',  desc: 'KPIs, spend, leads and ROAS for the last 7 days' },
  { id: 'creative', name: 'Creative analysis',   desc: 'Which creatives drove the best results this month' },
  { id: 'platform', name: 'Platform comparison', desc: 'Side-by-side metrics across all connected platforms' },
  { id: 'leads',    name: 'Lead gen report',      desc: 'CPL, lead volume, and quality breakdown by source' },
]

const previousReports = [
  { name: 'Weekly Report — Apr 14–20',  date: 'Apr 21, 2025', size: '1.2 MB' },
  { name: 'Creative Analysis — April',  date: 'Apr 15, 2025', size: '2.4 MB' },
  { name: 'Platform Comparison — Q1',   date: 'Apr 1, 2025',  size: '980 KB' },
  { name: 'Lead Gen Report — March',    date: 'Mar 31, 2025', size: '740 KB' },
]

export default function ReportsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const totals = useMemo(() => computeMetrics(aggregateMetrics(allMetrics.map(r => ({
    impressions: r.impressions, reach: r.reach, clicks: r.clicks, spend: r.spend,
    leads: r.leads, conversions: r.conversions, revenue: r.revenue, engagements: r.engagements, video_views: 0,
  })))), [])

  function generate() {
    if (!selected) return
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setDone(true) }, 2200)
    setTimeout(() => setDone(false), 5000)
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Reports</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Generate and export performance reports as PDF or PPT</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total spend',  value: fmt('spend', totals.spend) },
          { label: 'Total leads',  value: fmt('leads', totals.leads) },
          { label: 'Blended ROAS', value: fmt('roas',  totals.roas)  },
          { label: 'Avg CPL',      value: fmt('cpl',   totals.cpl)   },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '14px' }}>Generate new report</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {reportTemplates.map(t => (
              <div key={t.id} onClick={() => setSelected(t.id)} className="card" style={{
                padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '14px',
                border: selected === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: selected === t.id ? 'var(--accent-dim)' : 'var(--bg-card)', transition: 'all 0.15s',
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0, border: '1px solid var(--accent-glow)' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={!selected || generating} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: done ? 'var(--green)' : selected ? 'var(--accent)' : 'var(--bg-hover)',
            color: selected ? '#fff' : 'var(--text-dim)', border: 'none',
            fontSize: '14px', fontWeight: 500, cursor: selected ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-body)', transition: 'all 0.2s',
          }}>
            {generating ? 'Generating...' : done ? '✓ Report ready' : '+ Generate report'}
          </button>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '14px' }}>Previous reports</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {previousReports.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < previousReports.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.date} · {r.size}</div>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <Download size={12} /> PPT
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
