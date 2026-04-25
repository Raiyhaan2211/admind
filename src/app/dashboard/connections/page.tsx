'use client'
import { useState } from 'react'
import { Link2, CheckCircle, Plus, RefreshCw, Trash2, AlertCircle } from 'lucide-react'

type ConnStatus = 'connected' | 'disconnected' | 'error'

interface Connection {
  id: string; platform: string; accountName: string; accountId: string
  status: ConnStatus; lastSync: string; spend: string
}

const platformColors: Record<string, string> = {
  Google: '#4285F4', Meta: '#1877F2', TikTok: '#00f2ea',
  LinkedIn: '#0A66C2', Snapchat: '#FFFC00',
}

const platformTextColors: Record<string, string> = {
  Google: '#4285F4', Meta: '#1877F2', TikTok: '#00b8b3',
  LinkedIn: '#0A66C2', Snapchat: '#b8a800',
}

const defaultConnections: Connection[] = [
  { id:'c1', platform:'Google',   accountName:'Main Google Account',    accountId:'AW-123-456-7890', status:'connected',    lastSync:'2 min ago',  spend:'$4,800' },
  { id:'c2', platform:'Google',   accountName:'Brand Google Account',   accountId:'AW-987-654-3210', status:'connected',    lastSync:'2 min ago',  spend:'$1,200' },
  { id:'c3', platform:'Meta',     accountName:'Meta Business Page',     accountId:'act_112233445',   status:'connected',    lastSync:'5 min ago',  spend:'$3,920' },
  { id:'c4', platform:'Meta',     accountName:'Meta E-commerce',        accountId:'act_556677889',   status:'error',        lastSync:'2h ago',     spend:'—'      },
  { id:'c5', platform:'TikTok',   accountName:'TikTok Creator Account', accountId:'TT-8877665544',   status:'connected',    lastSync:'10 min ago', spend:'$2,100' },
  { id:'c6', platform:'LinkedIn', accountName:'LinkedIn Company Page',  accountId:'LI-44332211',     status:'connected',    lastSync:'15 min ago', spend:'$960'   },
  { id:'c7', platform:'Snapchat', accountName:'Snapchat Awareness',     accountId:'SC-99887766',     status:'disconnected', lastSync:'Never',      spend:'—'      },
]

const availablePlatforms = [
  { name: 'Google',   desc: 'Google Ads & Display Network',     limit: 5  },
  { name: 'Meta',     desc: 'Facebook & Instagram Ads',          limit: 5  },
  { name: 'TikTok',   desc: 'TikTok for Business',              limit: 5  },
  { name: 'LinkedIn', desc: 'LinkedIn Marketing Solutions',      limit: 5  },
  { name: 'Snapchat', desc: 'Snapchat Ads Manager',              limit: 5  },
]

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(defaultConnections)
  const [syncing, setSyncing] = useState<string | null>(null)

  function syncAccount(id: string) {
    setSyncing(id)
    setTimeout(() => setSyncing(null), 2000)
  }

  function removeAccount(id: string) {
    setConnections(c => c.filter(x => x.id !== id))
  }

  const connectedCount = connections.filter(c => c.status === 'connected').length
  const planLimit = 5

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Connections</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Connect and manage your ad accounts across all platforms</p>
        </div>
        <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>{connectedCount} / {planLimit} accounts</div>
          <div style={{ fontSize: '11px' }}>Starter plan limit</div>
        </div>
      </div>

      {/* Plan limit bar */}
      <div style={{ marginBottom: '24px', padding: '14px 18px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Account slots used</span>
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{connectedCount} of {planLimit}</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(connectedCount/planLimit)*100}%`, borderRadius: '3px', background: connectedCount >= planLimit ? '#ef4444' : 'var(--accent)', transition: 'width 0.3s' }} />
        </div>
        {connectedCount >= planLimit && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#f59e0b' }}>⚠ Account limit reached — upgrade to Pro for 10 accounts</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        {/* Connected accounts */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Connected accounts ({connections.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {connections.map(conn => (
              <div key={conn.id} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Platform dot */}
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${platformColors[conn.platform]}18`, border: `1px solid ${platformColors[conn.platform]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: platformTextColors[conn.platform] }}>
                    {conn.platform.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{conn.accountName}</span>
                    {conn.status === 'connected'    && <span style={{ fontSize: '10px', color: 'var(--green)',   display: 'flex', alignItems: 'center', gap: '3px' }}><CheckCircle size={11} /> Connected</span>}
                    {conn.status === 'error'        && <span style={{ fontSize: '10px', color: '#ef4444',        display: 'flex', alignItems: 'center', gap: '3px' }}><AlertCircle size={11} /> Auth error</span>}
                    {conn.status === 'disconnected' && <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Disconnected</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    ID: {conn.accountId} · Last sync: {conn.lastSync} · Spend: {conn.spend}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {conn.status === 'error' && (
                    <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      Reconnect
                    </button>
                  )}
                  <button onClick={() => syncAccount(conn.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <RefreshCw size={13} style={{ animation: syncing === conn.id ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                  <button onClick={() => removeAccount(conn.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new account */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>Add new account</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availablePlatforms.map(p => {
              const existing = connections.filter(c => c.platform === p.name).length
              const atLimit  = connectedCount >= planLimit
              return (
                <div key={p.name} className="card" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${platformColors[p.name]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: platformTextColors[p.name] }}>{p.name.slice(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{existing} connected</div>
                      </div>
                    </div>
                    <button
                      disabled={atLimit}
                      style={{
                        padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: atLimit ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--border)', background: atLimit ? 'transparent' : 'var(--accent-dim)',
                        color: atLimit ? 'var(--text-dim)' : 'var(--accent)', fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <Plus size={12} /> Connect
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Upgrade nudge */}
          <div style={{ marginTop: '14px', padding: '16px', borderRadius: '10px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Upgrade for more accounts</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Pro: 10 accounts · Agency: 15 accounts</div>
            <button style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Upgrade plan
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
