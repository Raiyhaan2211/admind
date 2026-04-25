import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 10,
    desc: 'Perfect for freelancers and solo marketers.',
    accounts: 5,
    color: 'var(--border)',
    features: [
      'Up to 5 ad accounts total',
      'All 5 platforms supported',
      'Unified dashboard',
      'Creative group tracking',
      'Basic reports (PDF)',
      'Email alerts',
      '7-day data history',
    ],
  },
  {
    name: 'Pro',
    price: 30,
    desc: 'For growing teams managing multiple clients.',
    accounts: 10,
    color: 'var(--accent)',
    popular: true,
    features: [
      'Up to 10 ad accounts total',
      'All 5 platforms supported',
      'Unified dashboard',
      'Creative group tracking',
      'Advanced reports (PDF + PPT)',
      'Email + in-app alerts',
      '30-day data history',
      'CRM lead tracking',
      'AI recommendations (AdLab)',
    ],
  },
  {
    name: 'Agency',
    price: 50,
    desc: 'For agencies managing large client portfolios.',
    accounts: 15,
    color: '#a78bfa',
    features: [
      'Up to 15 ad accounts total',
      'All 5 platforms supported',
      'Unified dashboard',
      'Creative group tracking',
      'Full reports suite',
      'All alert types',
      '90-day data history',
      'CRM lead tracking',
      'AI recommendations (AdLab)',
      'Multi-workspace support',
      'Team member access',
      'Priority support',
    ],
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', textDecoration: 'none', color: 'var(--text-primary)' }}>
          Ad<span style={{ color: 'var(--accent)' }}>Mind</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login"  style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '13px', textDecoration: 'none' }}>Log in</Link>
          <Link href="/signup" style={{ padding: '8px 18px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Get started</Link>
        </div>
      </nav>

      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '60px' }}>
          Start free. Upgrade as you grow. Cancel anytime.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '960px', margin: '0 auto', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
              transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 600,
                  padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
                }}>Most popular</div>
              )}
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{plan.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>{plan.desc}</div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)' }}>${plan.price}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <div style={{ fontSize: '12px', color: plan.popular ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '24px', padding: '6px 12px', background: plan.popular ? 'var(--accent-dim)' : 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                Up to {plan.accounts} ad accounts
              </div>
              <Link href="/signup" style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px',
                background: plan.popular ? 'var(--accent)' : 'transparent',
                border: `1px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
                color: plan.popular ? '#fff' : 'var(--text-primary)',
                fontSize: '14px', fontWeight: 500, textDecoration: 'none', marginBottom: '24px',
              }}>
                Get started
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <Check size={13} style={{ color: 'var(--green)', flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '40px' }}>
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </section>
    </div>
  )
}
