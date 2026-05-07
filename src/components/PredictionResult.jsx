export default function PredictionResult({ result, isAdvancedUser = true }) {
  if (!result) return null;

  const isReal = result.label === 'real';
  const confidencePct = (result.confidence * 100).toFixed(1);
  const hasPerModel = result.per_model && Object.keys(result.per_model).length > 0;

  return (
    <div className="card result-card">
      <div className={`result-verdict ${result.label}`}>
        <div className="verdict-label">{result.label}</div>
        <div className="verdict-confidence">
          Confidence: <strong>{confidencePct}%</strong>
        </div>
      </div>

      <div className="result-details">
        <div className="result-detail-item">
          <div className="detail-label">P(Real)</div>
          <div className="detail-value" style={{ color: 'var(--success)' }}>
            {(result.prob_real * 100).toFixed(2)}%
          </div>
        </div>
        <div className="result-detail-item">
          <div className="detail-label">P(Fake)</div>
          <div className="detail-value" style={{ color: 'var(--danger)' }}>
            {(result.prob_fake * 100).toFixed(2)}%
          </div>
        </div>
        <div className="result-detail-item">
          <div className="detail-label">Winning Model</div>
          <div className="detail-value">{result.winning_model}</div>
        </div>
        <div className="result-detail-item">
          <div className="detail-label">Processing</div>
          <div className="detail-value">{result.processing_time_ms?.toFixed(0)}ms</div>
        </div>
      </div>

      {result.filename && (
        <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          📁 {result.filename} &nbsp;·&nbsp; {result.models_ran} models evaluated
          {result.prediction_id && <> &nbsp;·&nbsp; ID: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{result.prediction_id.substring(0, 8)}…</code></>}
        </p>
      )}

      {hasPerModel && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Per-Model Breakdown
          </h4>
          {isAdvancedUser ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Label</th>
                  <th>Confidence</th>
                  <th>P(Real)</th>
                  <th>P(Fake)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.per_model).map(([name, m]) => (
                  <tr key={name}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{name}</td>
                    <td><span className={`label-badge ${m.label}`}>{m.label}</span></td>
                    <td>{(m.confidence * 100).toFixed(1)}%</td>
                    <td style={{ color: 'var(--success)' }}>{(m.prob_real * 100).toFixed(2)}%</td>
                    <td style={{ color: 'var(--danger)' }}>{(m.prob_fake * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔒</div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Upgrade to Analyst or Corporate plan to view detailed per-model metrics.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
