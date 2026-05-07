import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      api.getAdminStats(),
      api.getAdminUsers(10),
      api.getAdminPredictions(0)
    ]).then(([statsData, usersData, predsData]) => {
      setStats(statsData);
      setUsers(usersData.users || []);
      setPredictions(predsData.predictions || []);
    }).catch(err => {
      setError(err.message || 'Failed to load admin data');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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

  if (loading) {
    return (
      <div className="page fade-in">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="grid-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Global system overview and management</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats?.total_users || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🎧</div>
          <div className="stat-value">{stats?.total_predictions || 0}</div>
          <div className="stat-label">Total Predictions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">Active</div>
          <div className="stat-label">System Status</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h3 style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', margin: 0 }}>Recent Users</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(u.created_at)}</td>
                  <td>
                    <span className="label-badge" style={{ background: u.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: u.is_active ? 'var(--success)' : 'var(--danger)' }}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>All Predictions</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '0.75rem', background: filter === 'All' ? 'rgba(99,102,241,0.2)' : '' }} 
                onClick={() => setFilter('All')}
              >All</button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '0.75rem', background: filter === 'Real' ? 'rgba(99,102,241,0.2)' : '' }} 
                onClick={() => setFilter('Real')}
              >Real</button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '0.75rem', background: filter === 'Fake' ? 'rgba(99,102,241,0.2)' : '' }} 
                onClick={() => setFilter('Fake')}
              >Fake</button>
            </div>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Verdict</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.map(p => (
                  <tr key={p.prediction_id}>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.filename || '—'}
                    </td>
                    <td><span className={`label-badge ${p.label}`}>{p.label}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
