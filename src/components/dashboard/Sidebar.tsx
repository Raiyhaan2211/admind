'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, Users, FileText,
  Link2, Settings, Zap, Bell
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { label: 'Overview',    href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Campaigns',   href: '/dashboard/campaigns',  icon: TrendingUp },
  { label: 'Creatives',   href: '/dashboard/creatives',  icon: Zap },
  { label: 'CRM',         href: '/dashboard/crm',        icon: Users },
  { label: 'Reports',     href: '/dashboard/reports',    icon: FileText },
  { label: 'Alerts',      href: '/dashboard/alerts',     icon: Bell },
  { label: 'Connections', href: '/dashboard/connections',icon: Link2 },
  { label: 'Settings',    href: '/dashboard/settings',   icon: Settings },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          Ad<span style={{ color: 'var(--accent)' }}>Mind</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.04em' }}>
          UNIFIED INTELLIGENCE
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                transition: 'all 0.15s',
                cursor: 'pointer',
                border: active ? '1px solid var(--accent-glow)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--bg-hover)'
                  el.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--text-muted)'
                }
              }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: '11px',
        color: 'var(--text-dim)',
      }}>
        v0.1 · Demo mode
      </div>
    </aside>
  )
}
