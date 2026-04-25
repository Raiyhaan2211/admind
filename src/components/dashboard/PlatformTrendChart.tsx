'use client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'
import { Platform, platformLabel, platformColor } from '@/lib/metrics'

interface PlatformTrendChartProps {
  data: { date: string; [platform: string]: number | string }[]
  platforms: Platform[]
  metric: string
  metricLabel: string
  formatter?: (v: number) => string
}

export default function PlatformTrendChart({ data, platforms, metricLabel, formatter }: PlatformTrendChartProps) {
  const formatted = data.map(d => ({ ...d, date: format(parseISO(d.date as string), 'MMM d') }))

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{metricLabel} over time</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>Per platform trend</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={formatter} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
            formatter={(v: any) => formatter ? formatter(v) : v}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          {platforms.map(p => (
            <Line key={p} type="monotone" dataKey={p} name={platformLabel[p]} stroke={platformColor[p]} strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
