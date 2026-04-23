'use client'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface TrendRow {
  date: string
  ctr: number | null
  cpl: number | null
}

interface TrendChartProps {
  data: TrendRow[]
  metricKey: 'ctr' | 'cpl'
  label: string
  color?: string
}

const CustomTooltip = ({ active, payload, label, metricKey }: any) => {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-hover)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: payload[0]?.color, fontWeight: 500 }}>
        {metricKey === 'ctr'
          ? `${(val * 100).toFixed(2)}%`
          : val !== null ? `$${val.toFixed(2)}` : '—'
        }
      </div>
    </div>
  )
}

export default function TrendChart({ data, metricKey, label, color = '#f59e0b' }: TrendChartProps) {
  const cleaned = data.filter(d => d[metricKey] !== null)
  if (cleaned.length === 0) {
    return (
      <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No {label} data for this period</span>
      </div>
    )
  }

  const formatted = cleaned.map(d => ({
    ...d,
    date: format(parseISO(d.date), 'MMM d'),
  }))

  const avg = cleaned.reduce((s, d) => s + (d[metricKey] ?? 0), 0) / cleaned.length

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
          {label} trend
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Avg:{' '}
          <span style={{ color }}>
            {metricKey === 'ctr' ? `${(avg * 100).toFixed(2)}%` : `$${avg.toFixed(2)}`}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={formatted} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => metricKey === 'ctr' ? `${(v*100).toFixed(1)}%` : `$${v.toFixed(0)}`}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} metricKey={metricKey} />} />
          <ReferenceLine
            y={avg}
            stroke={color}
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Line
            type="monotone"
            dataKey={metricKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
