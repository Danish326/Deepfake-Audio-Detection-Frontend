import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 48px', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 800, color: '#fff'
          }}>DA</div>
          <div style={{ lineHeight: 1.2 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>DeepAudio</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Detection Suite</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Pricing</Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Detect Deepfake Audio with Precision
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.8 }}>
          Empower your security with our state-of-the-art AI detection suite. Analyze audio files instantly and identify synthetic manipulation using advanced ensemble models.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          Get Started for Free
        </Link>
      </section>

      {/* Vision & Mission */}
      <section style={{ padding: '80px 48px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="grid-2">
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>👁️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              To create a digital world where authenticity can be verified instantly. We envision a future where malicious deepfakes and synthetic audio can no longer be used for fraud, misinformation, or identity theft.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Provide an accessible, highly accurate, and scalable deepfake audio detection platform. We leverage cutting-edge deep learning techniques to empower analysts, businesses, and individuals to protect themselves.
            </p>
          </div>
        </div>
      </section>

      {/* Developers Info */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>Meet the Developers</h2>
        <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Example Developer 1 */}
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍💻</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Lead ML Engineer</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI Architecture & Modeling</p>
          </div>
          {/* Example Developer 2 */}
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,211,238,0.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👩‍💻</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Backend Specialist</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>API & Infrastructure</p>
          </div>
          {/* Example Developer 3 */}
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍🎨</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Frontend Developer</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>UI/UX & Integration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; 2026 DeepAudio Detection Suite. All rights reserved.
      </footer>
    </div>
  );
}
