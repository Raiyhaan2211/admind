'use client'
import {
  ResponsiveContainer, ComposedChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface ChartRow {
  date: string
  spend: number
  leads: number
  conversions: number
  clicks: number
  impressions: number
}

interface SpendResultsChartProps {
  data: ChartRow[]
  resultKey: 'leads' | 'conversions' | 'clicks' | 'impressions'
  resultLabel: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-hover)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: '2px' }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.name === 'Spend'
            ? `$${p.value.toFixed(0)}`
            : p.value?.toLocaleString()
          }</strong>
        </div>
      ))}
    </div>
  )
}

export default function SpendResultsChart({ data, resultKey, resultLabel }: SpendResultsChartProps) {
  const formatted = data.map(d => ({
    ...d,
    date: format(parseISO(d.date), 'MMM d'),
  }))

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
        Spend vs {resultLabel}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="spend"
            orientation="left"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${v}`}
          />
          <YAxis
            yAxisId="result"
            orientation="right"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: 'var(--text-muted)' }}
          />
          <Bar
            yAxisId="spend"
            dataKey="spend"
            name="Spend"
            fill="var(--accent)"
            opacity={0.35}
            radius={[3,3,0,0]}
          />
          <Line
            yAxisId="result"
            type="monotone"
            dataKey={resultKey}
            name={resultLabel}
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
