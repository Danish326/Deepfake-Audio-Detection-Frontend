import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAdvancedUser, setIsAdvancedUser] = useState(false);

  useEffect(() => {
    if (user?.is_staff || user?.is_superuser) {
      setIsAdvancedUser(true);
    } else {
      api.getQuotaStatus().then(quota => {
        if (quota?.plan?.name && quota.plan.name !== 'free') {
          setIsAdvancedUser(true);
        }
      }).catch(() => {});
    }

    api.getHistory(0)
      .then((data) => setPredictions(data.predictions || []))
      .catch((err) => setError(err.message || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const filteredPredictions = predictions.filter(p => {
    if (filter === 'All') return true;
    return p.label.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Prediction History</h1>
          <p>Review your past audio analyses</p>
        </div>
        {isAdvancedUser && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 16px', background: filter === 'All' ? 'rgba(99,102,241,0.2)' : '' }} 
              onClick={() => setFilter('All')}
            >All</button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 16px', background: filter === 'Real' ? 'rgba(99,102,241,0.2)' : '' }} 
              onClick={() => setFilter('Real')}
            >Real</button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 16px', background: filter === 'Fake' ? 'rgba(99,102,241,0.2)' : '' }} 
              onClick={() => setFilter('Fake')}
            >Fake</button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />
            ))}
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>{error}</h3>
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No predictions found</h3>
            <p>Try adjusting your filter or upload a new audio file</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Verdict</th>
                <th>Confidence</th>
                <th>Model</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPredictions.map((p) => (
                <tr key={p.prediction_id}>
                  <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.filename || '—'}
                  </td>
                  <td><span className={`label-badge ${p.label}`}>{p.label}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{(p.confidence * 100).toFixed(1)}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{p.winning_model}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{p.processing_time_ms?.toFixed(0)}ms</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
