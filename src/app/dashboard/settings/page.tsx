'use client'
import { useState } from 'react'
import { User, CreditCard, Bell, Shield, ChevronRight, Check } from 'lucide-react'

const sections = ['Profile', 'Billing', 'Notifications', 'Security'] as const
type Section = typeof sections[number]

const plans = [
  { id: 'starter', name: 'Starter', price: '$20/mo', accounts: 5,  desc: 'Perfect for freelancers' },
  { id: 'pro',     name: 'Pro',     price: '$30/mo', accounts: 10, desc: 'For growing agencies'    },
  { id: 'agency',  name: 'Agency',  price: '$50/mo', accounts: 15, desc: 'For large teams'         },
]

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('Profile')
  const [name, setName] = useState('Raiyhaan')
  const [email, setEmail] = useState('raiyhaan@example.com')
  const [company, setCompany] = useState('Blue Topaz')
  const [saved, setSaved] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('starter')
  const [notifs, setNotifs] = useState({ email: true, inapp: true, sms: false, weekly: true })

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-body)',
    outline: 'none',
  }

  const labelStyle = { fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }

  const icons: Record<Section, React.ReactNode> = {
    Profile:       <User size={15} />,
    Billing:       <CreditCard size={15} />,
    Notifications: <Bell size={15} />,
    Security:      <Shield size={15} />,
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage your account, billing and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <div className="card" style={{ padding: '8px', height: 'fit-content' }}>
          {sections.map(s => (
            <button key={s} onClick={() => setSection(s)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none',
              background: section === s ? 'var(--accent-dim)' : 'transparent',
              color: section === s ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: section === s ? 500 : 400,
              cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left',
              borderLeft: section === s ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              {icons[s]} {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>

          {section === 'Profile' && (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '20px' }}>Profile information</div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company / Agency name</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Timezone</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Asia/Colombo (UTC+5:30)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>Asia/Dubai (UTC+4)</option>
                  </select>
                </div>
              </div>
              <button onClick={save} style={{
                marginTop: '20px', padding: '10px 20px', borderRadius: '8px',
                background: saved ? 'var(--green)' : 'var(--accent)',
                color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {saved ? <><Check size={14} /> Saved</> : 'Save changes'}
              </button>
            </div>
          )}

          {section === 'Billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Current plan</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Your next billing date is May 23, 2025</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                  {plans.map(p => (
                    <div key={p.id} onClick={() => setCurrentPlan(p.id)} style={{
                      padding: '16px', borderRadius: '10px', cursor: 'pointer',
                      border: currentPlan === p.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: currentPlan === p.id ? 'var(--accent-dim)' : 'var(--bg)',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{p.name}</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: currentPlan === p.id ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{p.price}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{p.desc}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Up to {p.accounts} ad accounts</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>Payment method</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <CreditCard size={18} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Visa ending in 4242</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Expires 12/2027</div>
                  </div>
                  <button style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Update</button>
                </div>
              </div>
            </div>
          )}

          {section === 'Notifications' && (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '20px' }}>Notification preferences</div>
              {[
                { key: 'email',  label: 'Email alerts',         desc: 'Receive alert notifications via email' },
                { key: 'inapp',  label: 'In-app notifications',  desc: 'Show alerts inside the dashboard' },
                { key: 'sms',    label: 'SMS alerts',            desc: 'Critical alerts via SMS (coming soon)' },
                { key: 'weekly', label: 'Weekly digest',         desc: 'Summary of weekly performance every Monday' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <div onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} style={{ width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer', background: notifs[item.key as keyof typeof notifs] ? 'var(--accent)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', left: notifs[item.key as keyof typeof notifs] ? '21px' : '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>Change password</div>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div><label style={labelStyle}>Current password</label><input type="password" style={inputStyle} placeholder="••••••••" /></div>
                  <div><label style={labelStyle}>New password</label><input type="password" style={inputStyle} placeholder="••••••••" /></div>
                  <div><label style={labelStyle}>Confirm new password</label><input type="password" style={inputStyle} placeholder="••••••••" /></div>
                </div>
                <button style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Update password</button>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Two-factor authentication</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Add an extra layer of security to your account</div>
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--accent)', background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Enable 2FA</button>
              </div>
              <div className="card" style={{ padding: '24px', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#ef4444', marginBottom: '4px' }}>Danger zone</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Permanently delete your account and all data. This cannot be undone.</div>
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Delete account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
