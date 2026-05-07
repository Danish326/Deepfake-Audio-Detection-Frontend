import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 48px', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 800, color: '#fff'
          }}>DA</div>
          <div style={{ lineHeight: 1.2 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>DeepAudio</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Detection Suite</span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Home</Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section style={{ padding: '80px 20px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>Simple, Transparent Pricing</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Choose the plan that fits your audio analysis needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '40px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="grid-3" style={{ alignItems: 'start' }}>
          
          {/* Free Plan */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$0 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '12px' }}>✅ 5 Predictions / month</li>
              <li style={{ marginBottom: '12px' }}>✅ 60s Max Audio Duration</li>
              <li style={{ marginBottom: '12px' }}>✅ 20 MB Max File Size</li>
              <li style={{ marginBottom: '12px' }}>❌ Per-Model Breakdown</li>
            </ul>
            <Link to="/register" className="btn btn-secondary btn-full">Get Started</Link>
          </div>

          {/* Analyst Plan */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-secondary)', transform: 'scale(1.05)', boxShadow: 'var(--shadow-glow)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-gradient)', padding: '4px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Most Popular</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Analyst</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$49 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '12px' }}>✅ 100 Predictions / month</li>
              <li style={{ marginBottom: '12px' }}>✅ 300s Max Audio Duration</li>
              <li style={{ marginBottom: '12px' }}>✅ 50 MB Max File Size</li>
              <li style={{ marginBottom: '12px' }}>✅ Per-Model Breakdown</li>
            </ul>
            <Link to="/register" className="btn btn-primary btn-full">Start Analyst Plan</Link>
          </div>

          {/* Corporate Plan */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-emerald)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Corporate</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$299 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '12px' }}>✅ Unlimited Predictions</li>
              <li style={{ marginBottom: '12px' }}>✅ 3600s Max Audio Duration</li>
              <li style={{ marginBottom: '12px' }}>✅ 100 MB Max File Size</li>
              <li style={{ marginBottom: '12px' }}>✅ Priority Processing</li>
            </ul>
            <a href="mailto:sales@example.com" className="btn btn-secondary btn-full">Contact Sales</a>
          </div>

        </div>
      </section>
    </div>
  );
}
