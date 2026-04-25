'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Calendar, X } from 'lucide-react'
import { Platform, platformLabel } from '@/lib/metrics'

export interface FilterState {
  days: number
  platforms: Platform[]
  accounts: string[]
  campaigns: string[]
}

// Demo ad accounts per platform
export const demoAdAccounts: Record<Platform, { id: string; name: string }[]> = {
  google:   [{ id:'ga1', name:'Google — Main Account' }, { id:'ga2', name:'Google — Brand Account' }],
  meta:     [{ id:'ma1', name:'Meta — Business Page' }, { id:'ma2', name:'Meta — E-commerce' }, { id:'ma3', name:'Meta — Retargeting' }],
  tiktok:   [{ id:'tt1', name:'TikTok — Creator Account' }, { id:'tt2', name:'TikTok — Brand Account' }],
  linkedin: [{ id:'li1', name:'LinkedIn — Company Page' }],
  snapchat: [{ id:'sc1', name:'Snapchat — Awareness' }],
}

export const demoCampaignsByAccount: Record<string, string[]> = {
  ga1: ['Summer Sale — EN', 'Traffic — Blog', 'Retargeting — Cart'],
  ga2: ['Brand Awareness Q2', 'Product Demo — B2B'],
  ma1: ['Summer Sale — EN', 'Summer Sale — AR', 'Retargeting — Cart'],
  ma2: ['Engagement — Ramadan', 'Summer Sale — EN'],
  ma3: ['Retargeting — Cart'],
  tt1: ['Brand Awareness Q2'],
  tt2: ['Summer Sale — TikTok'],
  li1: ['Product Demo — B2B'],
  sc1: ['Brand Awareness Q2'],
}

const allPlatforms: Platform[] = ['google','meta','tiktok','linkedin','snapchat']
const dateRanges = [
  { label: '7 days',  days: 7  },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
]

interface DropdownProps {
  label: string
  count?: number
  children: React.ReactNode
}

function Dropdown({ label, count, children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 12px', borderRadius: '8px',
        border: `1px solid ${open || (count && count > 0) ? 'var(--accent)' : 'var(--border)'}`,
        background: open || (count && count > 0) ? 'var(--accent-dim)' : 'var(--bg-card)',
        color: open || (count && count > 0) ? 'var(--accent)' : 'var(--text-muted)',
        fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap', transition: 'all 0.15s',
      }}>
        {label}
        {count !== undefined && count > 0 && (
          <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '10px', fontSize: '10px', padding: '1px 6px', fontWeight: 600 }}>{count}</span>
        )}
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '8px', minWidth: '220px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

interface FilterBarProps {
  filters: FilterState
  onChange: (f: FilterState) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {

  function togglePlatform(p: Platform) {
    const next = filters.platforms.includes(p)
      ? filters.platforms.filter(x => x !== p)
      : [...filters.platforms, p]
    // Reset accounts/campaigns if platform removed
    const validAccounts = next.flatMap(pl => demoAdAccounts[pl].map(a => a.id))
    const accounts = filters.accounts.filter(a => validAccounts.includes(a))
    const validCampaigns = accounts.flatMap(a => demoCampaignsByAccount[a] ?? [])
    const campaigns = filters.campaigns.filter(c => validCampaigns.includes(c))
    onChange({ ...filters, platforms: next, accounts, campaigns })
  }

  function toggleAccount(id: string) {
    const next = filters.accounts.includes(id)
      ? filters.accounts.filter(x => x !== id)
      : [...filters.accounts, id]
    const validCampaigns = next.flatMap(a => demoCampaignsByAccount[a] ?? [])
    const campaigns = filters.campaigns.filter(c => validCampaigns.includes(c))
    onChange({ ...filters, accounts: next, campaigns })
  }

  function toggleCampaign(name: string) {
    const next = filters.campaigns.includes(name)
      ? filters.campaigns.filter(x => x !== name)
      : [...filters.campaigns, name]
    onChange({ ...filters, campaigns: next })
  }

  // Available accounts based on selected platforms
  const availableAccounts = filters.platforms.flatMap(p => demoAdAccounts[p])

  // Available campaigns based on selected accounts
  const availableCampaigns = filters.accounts.length > 0
    ? [...new Set(filters.accounts.flatMap(a => demoCampaignsByAccount[a] ?? []))]
    : [...new Set(availableAccounts.flatMap(a => demoCampaignsByAccount[a.id] ?? []))]

  const checkStyle = (active: boolean) => ({
    width: '14px', height: '14px', borderRadius: '4px', flexShrink: 0,
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent)' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  const optionStyle = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '7px 8px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', color: 'var(--text-muted)',
    transition: 'background 0.1s',
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px', padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginRight: '4px' }}>FILTERS</span>

      {/* Date range */}
      <Dropdown label={`Last ${filters.days} days`}>
        {dateRanges.map(r => (
          <div key={r.days} onClick={() => onChange({ ...filters, days: r.days })}
            style={{ ...optionStyle, color: filters.days === r.days ? 'var(--text-primary)' : 'var(--text-muted)', background: filters.days === r.days ? 'var(--accent-dim)' : 'transparent' }}>
            <Calendar size={13} /> {r.label}
          </div>
        ))}
      </Dropdown>

      {/* Platforms */}
      <Dropdown label="Platform" count={filters.platforms.length}>
        {allPlatforms.map(p => (
          <div key={p} onClick={() => togglePlatform(p)} style={optionStyle}>
            <div style={checkStyle(filters.platforms.includes(p))}>
              {filters.platforms.includes(p) && <span style={{ color: '#fff', fontSize: '9px', fontWeight: 800 }}>✓</span>}
            </div>
            <span style={{ color: 'var(--text-primary)' }}>{platformLabel[p]}</span>
          </div>
        ))}
      </Dropdown>

      {/* Ad Accounts — only enabled if platforms selected */}
      <Dropdown label="Ad account" count={filters.accounts.length}>
        {availableAccounts.length === 0 ? (
          <div style={{ padding: '10px 8px', fontSize: '12px', color: 'var(--text-dim)' }}>Select a platform first</div>
        ) : (
          availableAccounts.map(a => (
            <div key={a.id} onClick={() => toggleAccount(a.id)} style={optionStyle}>
              <div style={checkStyle(filters.accounts.includes(a.id))}>
                {filters.accounts.includes(a.id) && <span style={{ color: '#fff', fontSize: '9px', fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{a.name}</span>
            </div>
          ))
        )}
      </Dropdown>

      {/* Campaigns */}
      <Dropdown label="Campaign" count={filters.campaigns.length}>
        {availableCampaigns.length === 0 ? (
          <div style={{ padding: '10px 8px', fontSize: '12px', color: 'var(--text-dim)' }}>Select accounts first</div>
        ) : (
          availableCampaigns.map(c => (
            <div key={c} onClick={() => toggleCampaign(c)} style={optionStyle}>
              <div style={checkStyle(filters.campaigns.includes(c))}>
                {filters.campaigns.includes(c) && <span style={{ color: '#fff', fontSize: '9px', fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{c}</span>
            </div>
          ))
        )}
      </Dropdown>

      {/* Active filter pills */}
      {filters.platforms.map(p => (
        <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)', fontSize: '12px', color: 'var(--accent)' }}>
          {platformLabel[p]}
          <X size={11} style={{ cursor: 'pointer' }} onClick={() => togglePlatform(p)} />
        </div>
      ))}
    </div>
  )
}
