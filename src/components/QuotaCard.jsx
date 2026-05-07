import { useState } from 'react';

export default function QuotaCard({ quota, loading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="card quota-card">
        <div className="skeleton" style={{ height: 20, width: 120, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 8, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 60 }} />
      </div>
    );
  }

  if (!quota) return null;

  const { plan, usage } = quota;
  const isUnlimited = plan.max_predictions_per_month === -1;
  const usedPercent = isUnlimited ? 0 : Math.min((usage.predictions_used / plan.max_predictions_per_month) * 100, 100);
  const isWarning = usedPercent >= 80;
  const periodEnd = new Date(usage.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="card quota-card">
        <div className="quota-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="card-title" style={{ margin: 0, marginRight: '12px' }}>Subscription</span>
            <span className={`plan-badge ${plan.name}`}>{plan.display_name}</span>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '4px 12px', fontSize: '0.8rem' }} 
            onClick={() => setIsModalOpen(true)}
          >
            Change Plan
          </button>
        </div>

        <div className="quota-progress">
          <div className="progress-header">
            <span>Predictions Used</span>
            <span>
              {usage.predictions_used} / {isUnlimited ? '∞' : plan.max_predictions_per_month}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isWarning ? 'warning' : ''}`}
              style={{ width: isUnlimited ? '0%' : `${usedPercent}%` }}
            />
          </div>
        </div>

        <div className="quota-details">
          <div className="quota-detail-item">
            <div className="detail-label">Remaining</div>
            <div className="detail-value" style={{ color: isWarning ? 'var(--warning)' : 'var(--accent-emerald)' }}>
              {isUnlimited ? '∞' : usage.predictions_remaining}
            </div>
          </div>
          <div className="quota-detail-item">
            <div className="detail-label">Resets On</div>
            <div className="detail-value">{periodEnd}</div>
          </div>
          <div className="quota-detail-item">
            <div className="detail-label">Max Duration</div>
            <div className="detail-value">{plan.max_audio_duration_seconds}s</div>
          </div>
          <div className="quota-detail-item">
            <div className="detail-label">Max Upload</div>
            <div className="detail-value">{plan.max_upload_size_mb} MB</div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card fade-in" style={{ maxWidth: '900px', width: '100%', position: 'relative', overflowY: 'auto', maxHeight: '90vh', padding: '40px' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Change Your Plan</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Select the plan that best fits your audio analysis needs.</p>
            </div>

            <div className="grid-3" style={{ alignItems: 'start', gap: '24px' }}>
              {/* Free Plan */}
              <div className="card" style={{ borderTop: '4px solid var(--accent-cyan)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Free</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>$0 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <li style={{ marginBottom: '8px' }}>✅ 5 Predictions / month</li>
                  <li style={{ marginBottom: '8px' }}>✅ 60s Max Audio Duration</li>
                  <li style={{ marginBottom: '8px' }}>✅ 20 MB Max File Size</li>
                  <li style={{ marginBottom: '8px' }}>❌ Per-Model Breakdown</li>
                </ul>
                <button className="btn btn-secondary btn-full" disabled={plan.name === 'free'}>
                  {plan.name === 'free' ? 'Current Plan' : 'Downgrade (Coming Soon)'}
                </button>
              </div>

              {/* Analyst Plan */}
              <div className="card" style={{ borderTop: '4px solid var(--accent-secondary)', padding: '24px', position: 'relative', boxShadow: 'var(--shadow-glow)' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-gradient)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Popular</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Analyst</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>$49 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <li style={{ marginBottom: '8px' }}>✅ 100 Predictions / month</li>
                  <li style={{ marginBottom: '8px' }}>✅ 300s Max Audio Duration</li>
                  <li style={{ marginBottom: '8px' }}>✅ 50 MB Max File Size</li>
                  <li style={{ marginBottom: '8px' }}>✅ Per-Model Breakdown</li>
                </ul>
                <button className="btn btn-primary btn-full" disabled={plan.name === 'analyst' || plan.name !== 'analyst'}>
                  {plan.name === 'analyst' ? 'Current Plan' : 'Upgrade (Coming Soon)'}
                </button>
              </div>

              {/* Corporate Plan */}
              <div className="card" style={{ borderTop: '4px solid var(--accent-emerald)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Corporate</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>$299 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <li style={{ marginBottom: '8px' }}>✅ Unlimited Predictions</li>
                  <li style={{ marginBottom: '8px' }}>✅ 3600s Max Audio Duration</li>
                  <li style={{ marginBottom: '8px' }}>✅ 100 MB Max File Size</li>
                  <li style={{ marginBottom: '8px' }}>✅ Priority Processing</li>
                </ul>
                <button className="btn btn-secondary btn-full" disabled={plan.name === 'corporate' || plan.name !== 'corporate'}>
                  {plan.name === 'corporate' ? 'Current Plan' : 'Upgrade (Coming Soon)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
