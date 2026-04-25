'use client'
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { format, parseISO } from 'date-fns'

interface FrequencyChartProps {
  data: { date: string; reach: number; frequency: number | null }[]
}

export default function FrequencyChart({ data }: FrequencyChartProps) {
  const formatted = data.map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') }))

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Reach & frequency</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        High frequency (&gt;8) means ad fatigue — time to refresh creatives
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="reach" orientation="left" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis yAxisId="freq" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={v => v.toFixed(1)} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
            formatter={(v: any, name: string) => name === 'Reach' ? `${(v/1000).toFixed(1)}K` : v?.toFixed(2) ?? '—'}
          />
          <Area yAxisId="reach" type="monotone" dataKey="reach" name="Reach" fill="rgba(99,102,241,0.1)" stroke="var(--accent)" strokeWidth={2} />
          <Line yAxisId="freq" type="monotone" dataKey="frequency" name="Frequency" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
