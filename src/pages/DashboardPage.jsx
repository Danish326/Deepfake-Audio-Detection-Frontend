import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import QuotaCard from '../components/QuotaCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [quota, setQuota] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getQuotaStatus().catch(() => null),
      api.getHealth().catch(() => null),
    ]).then(([q, h]) => {
      setQuota(q);
      setHealth(h);
    }).finally(() => setLoading(false));
  }, []);

  const modelCount = health?.models
    ? Object.values(health.models).filter(Boolean).length
    : 0;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.first_name || user?.username}</h1>
        <p>Deepfake Audio Detection Dashboard</p>
      </div>

      {/* Status Bar */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-value">{modelCount}/8</div>
          <div className="stat-label">Models Loaded</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{quota?.usage?.predictions_used ?? '—'}</div>
          <div className="stat-label">Predictions Used</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <span className={`status-dot ${health?.status || 'degraded'}`} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
            {health?.status || 'Checking...'}
          </div>
          <div className="stat-label">System Status</div>
        </div>
      </div>

      {/* Quota */}
      <QuotaCard quota={quota} loading={loading} />

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/predict" className="card action-card">
          <div className="action-icon">🔍</div>
          <div className="action-label">Analyze Audio</div>
          <div className="action-desc">Upload and detect deepfakes</div>
        </Link>
        <Link to="/history" className="card action-card">
          <div className="action-icon">📋</div>
          <div className="action-label">View History</div>
          <div className="action-desc">Review past analyses</div>
        </Link>
        <Link to="/profile" className="card action-card">
          <div className="action-icon">⚙️</div>
          <div className="action-label">Account</div>
          <div className="action-desc">Manage your profile</div>
        </Link>
      </div>
    </div>
  );
}
