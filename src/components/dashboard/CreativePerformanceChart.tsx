'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'

interface CreativePerformanceChartProps {
  data: { name: string; roas: number; leads: number; spend: number; cpl: number | null }[]
}

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ec4899','#06b6d4']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px' }}>
      <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '6px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.fill || 'var(--text-muted)', marginBottom: '2px' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? (p.name === 'ROAS' ? `${p.value.toFixed(2)}x` : p.name === 'Leads' ? p.value : `$${p.value.toFixed(0)}`) : '—'}</strong>
        </div>
      ))}
    </div>
  )
}

export default function CreativePerformanceChart({ data }: CreativePerformanceChartProps) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Creative performance</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>ROAS by creative group</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}x`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="roas" name="ROAS" radius={[4,4,0,0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
