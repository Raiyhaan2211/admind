'use client'
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import { Platform, platformLabel, platformColor, fmt, KpiKey } from '@/lib/metrics'

interface PlatformRow {
  platform: Platform
  spend: number
  leads: number
  conversions: number
  clicks: number
  impressions: number
  reach: number
}

interface PlatformChartProps {
  data: PlatformRow[]
  metricKey: KpiKey
  metricLabel: string
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-hover)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
        {platformLabel[d.platform as Platform]}
      </div>
      <div style={{ color: payload[0].color }}>
        {payload[0].name}: <strong>{payload[0].value?.toLocaleString()}</strong>
      </div>
    </div>
  )
}

export default function PlatformChart({ data, metricKey, metricLabel }: PlatformChartProps) {
  const formatted = data.map(d => ({
    ...d,
    name: platformLabel[d.platform],
    value: d[metricKey as keyof PlatformRow] as number ?? 0,
  }))

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
        {metricLabel} by platform
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="value" name={metricLabel} radius={[4, 4, 0, 0]}>
            {formatted.map((entry, i) => (
              <Cell
                key={i}
                fill={platformColor[entry.platform as Platform] ?? '#6366f1'}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
