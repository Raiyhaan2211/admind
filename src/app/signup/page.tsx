'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Chrome, Check } from 'lucide-react'

const plans = [
  { id: 'starter', name: 'Starter', price: '$10/mo', accounts: 5 },
  { id: 'pro',     name: 'Pro',     price: '$30/mo', accounts: 10 },
  { id: 'agency',  name: 'Agency',  price: '$50/mo', accounts: 15 },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep]         = useState<'plan' | 'account'>('plan')
  const [plan, setPlan]         = useState('pro')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, plan } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else setDone(true)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text-primary)', fontSize: '14px',
    outline: 'none', fontFamily: 'var(--font-body)',
  }

  if (done) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: '48px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={24} style={{ color: 'var(--green)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Check your email</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Click it to activate your account.</p>
        <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '14px', textDecoration: 'none' }}>Go to login</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: '40px 20px' }}>
      <Link href="/" style={{ marginBottom: '32px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>Ad<span style={{ color: 'var(--accent)' }}>Mind</span></span>
      </Link>

      {step === 'plan' && (
        <div style={{ width: '100%', maxWidth: '680px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '8px' }}>Choose your plan</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>You can change or cancel anytime.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }}>
            {plans.map(p => (
              <div key={p.id} onClick={() => setPlan(p.id)} style={{
                border: `1px solid ${plan === p.id ? 'var(--accent)' : 'var(--border)'}`,
                background: plan === p.id ? 'var(--accent-dim)' : 'var(--bg-card)',
                borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: plan === p.id ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '8px' }}>{p.price}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Up to {p.accounts} ad accounts</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('account')} style={{ width: '100%', padding: '13px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Continue with {plans.find(p => p.id === plan)?.name}
          </button>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      )}

      {step === 'account' && (
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <button onClick={() => setStep('plan')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontFamily: 'var(--font-body)' }}>← Back to plans</button>
          <div className="card" style={{ padding: '36px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', textAlign: 'center' }}>Create your account</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
              Plan: <strong style={{ color: 'var(--accent)' }}>{plans.find(p => p.id === plan)?.name}</strong>
            </p>

            <button onClick={handleGoogle} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'var(--font-body)', marginBottom: '20px' }}>
              <Chrome size={16} /> Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" minLength={8} style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: 'var(--red)' }}>{error}</div>
              )}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
