export default function QuotaCard({ quota, loading }) {
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
    <div className="card quota-card">
      <div className="quota-header">
        <span className="card-title" style={{ margin: 0 }}>Subscription</span>
        <span className={`plan-badge ${plan.name}`}>{plan.display_name}</span>
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
  );
}
