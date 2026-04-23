'use client'
import { CreativeGroup, Platform, platformLabel, fmt, ComputedMetrics } from '@/lib/metrics'
import { Layers } from 'lucide-react'

interface CreativeGroupRow extends CreativeGroup {
  metrics: ComputedMetrics
}

interface CreativeTableProps {
  rows: CreativeGroupRow[]
}

const platformInitial: Record<Platform, string> = {
  google: 'G', meta: 'M', tiktok: 'T', linkedin: 'L', snapchat: 'S'
}

const platformBg: Record<Platform, string> = {
  google: 'rgba(66,133,244,0.15)', meta: 'rgba(24,119,242,0.15)',
  tiktok: 'rgba(0,242,234,0.12)', linkedin: 'rgba(10,102,194,0.15)',
  snapchat: 'rgba(255,252,0,0.10)',
}

const platformFg: Record<Platform, string> = {
  google: '#7ab4f8', meta: '#6fa8f8', tiktok: '#5de8e2',
  linkedin: '#6aaee8', snapchat: '#f5ef6a',
}

function PlatformDot({ platform }: { platform: Platform }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      borderRadius: '5px',
      background: platformBg[platform],
      color: platformFg[platform],
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.01em',
    }}>
      {platformInitial[platform]}
    </span>
  )
}

function roasColor(roas: number | null) {
  if (roas === null) return 'var(--text-muted)'
  if (roas >= 4) return 'var(--green)'
  if (roas >= 2) return 'var(--amber)'
  return 'var(--red)'
}

export default function CreativeTable({ rows }: CreativeTableProps) {
  if (rows.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <Layers size={24} style={{ color: 'var(--text-dim)', margin: '0 auto 10px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No creative groups yet</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 120px 90px 80px 80px 80px',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        <div>Creative group</div>
        <div>Platforms</div>
        <div style={{ textAlign: 'right' }}>Spend</div>
        <div style={{ textAlign: 'right' }}>ROAS</div>
        <div style={{ textAlign: 'right' }}>CPL</div>
        <div style={{ textAlign: 'right' }}>Leads</div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={row.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 120px 90px 80px 80px 80px',
          padding: '12px 16px',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          alignItems: 'center',
          transition: 'background 0.1s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          {/* Name + language */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {row.name}
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '10px',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                fontWeight: 500,
              }}>
                {row.language}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {row.ads.length} ad{row.ads.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Platform dots */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {row.ads.map((ad, j) => (
              <PlatformDot key={j} platform={ad.platform} />
            ))}
          </div>

          {/* Metrics */}
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-primary)' }}>
            {fmt('spend', row.metrics.spend)}
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 500, color: roasColor(row.metrics.roas) }}>
            {fmt('roas', row.metrics.roas)}
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-primary)' }}>
            {fmt('cpl', row.metrics.cpl)}
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-primary)' }}>
            {fmt('leads', row.metrics.leads)}
          </div>
        </div>
      ))}
    </div>
  )
}
