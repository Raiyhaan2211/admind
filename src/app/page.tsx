import Link from 'next/link'
import { ArrowRight, BarChart3, Layers, Zap, Shield, Globe, TrendingUp } from 'lucide-react'

const features = [
  { icon: 'Globe',      title: 'All platforms, one view',       desc: 'Connect Google, Meta, TikTok, LinkedIn and Snapchat. See everything in one unified dashboard.' },
  { icon: 'Layers',     title: 'Creative intelligence',         desc: 'Group the same creative running across platforms and see blended ROAS, reach and CPL per creative.' },
  { icon: 'BarChart3',  title: 'Dynamic KPI cards',             desc: 'Cards adapt to your campaign objective. Awareness shows CPM. Lead gen shows CPL. Always relevant.' },
  { icon: 'Zap',        title: 'Smart alerts',                  desc: 'Get notified when CPL spikes, frequency goes too high, or a campaign stops delivering.' },
  { icon: 'TrendingUp', title: 'AI recommendations',            desc: 'AdLab analyses your data and tells you where to shift budget and which creative to scale.' },
  { icon: 'Shield',     title: 'Built for agencies',            desc: 'Multi-account workspaces, client-level reporting, and role-based access for your whole team.' },
]

const platforms = ['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'Snapchat Ads']
const stats = [{ val: '5', label: 'Ad platforms' }, { val: '2.3K', label: 'Leads tracked' }, { val: '3.1x', label: 'Avg ROAS' }, { val: '$21K+', label: 'Spend managed' }]

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Ad<span style={{ color: 'var(--accent)' }}>Mind</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/pricing" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Pricing</Link>
          <Link href="#features" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Features</Link>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '13px', textDecoration: 'none' }}>Log in</Link>
          <Link href="/signup" style={{ padding: '8px 18px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Get started</Link>
        </div>
      </nav>

      <section style={{ padding: '100px 48px 80px', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)', fontSize: '12px', color: 'var(--accent)', marginBottom: '28px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Now supporting 5 ad platforms
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '64px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '24px' }}>
          One dashboard.<br /><span style={{ color: 'var(--accent)' }}>Every ad platform.</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
          AdMind connects all your ad accounts and shows you exactly which creatives, platforms and audiences are driving results.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '10px', background: 'var(--accent)', color: '#fff', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
            Start free trial <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '15px', textDecoration: 'none' }}>
            View pricing
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {platforms.map(p => (
            <div key={p} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: '12px', color: 'var(--text-muted)' }}>{p}</div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 48px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '48px' }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ padding: '60px 48px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>Everything a performance marketer needs</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Built for the way modern ad teams actually work</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {features.map(({ title, desc }) => (
            <div key={title} className="card" style={{ padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 48px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '60px 40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>Ready to unify your ads?</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '28px' }}>Start your free trial. No credit card required.</p>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '10px', background: 'var(--accent)', color: '#fff', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer style={{ padding: '32px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800 }}>Ad<span style={{ color: 'var(--accent)' }}>Mind</span></div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>© 2025 AdMind. All rights reserved.</div>
      </footer>
    </div>
  )
}
