import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useQuery } from '@tanstack/react-query';
import PredictionResult from '../components/PredictionResult';

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState('All');
  const [searchFilename, setSearchFilename] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: statsData, isLoading: loadingStats, error: errorStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: api.getAdminStats
  });

  const { data: usersData, isLoading: loadingUsers, error: errorUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => api.getAdminUsers(10)
  });

  const { data: predsData, isLoading: loadingPreds, error: errorPreds } = useQuery({
    queryKey: ['adminPredictions'],
    queryFn: () => api.getAdminPredictions(0)
  });

  const loading = loadingStats || loadingUsers || loadingPreds;
  const errorObj = errorStats || errorUsers || errorPreds;
  const error = errorObj ? errorObj.message || 'Failed to load admin data' : '';

  const stats = statsData || null;
  const users = usersData?.users || [];
  const predictions = predsData?.predictions || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchFilename, startDate, endDate]);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const filteredPredictions = predictions.filter(p => {
    if (filter !== 'All' && p.label.toLowerCase() !== filter.toLowerCase()) return false;
    
    if (searchFilename && !p.filename?.toLowerCase().includes(searchFilename.toLowerCase())) return false;
    
    if (startDate) {
      if (new Date(p.created_at) < new Date(startDate)) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // include the entire end date
      if (new Date(p.created_at) >= end) return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadCSV = async () => {
    const headers = ['Prediction ID', 'Filename', 'User Anonymized ID', 'Date', 'Verdict', 'Confidence', 'Models Ran', 'Winning Model', 'P(Real)', 'P(Fake)', 'Processing Time (ms)'];
    
    const rows = filteredPredictions.map(p => [
      p.prediction_id,
      p.filename || 'N/A',
      p.anonymized_user_id || 'N/A',
      new Date(p.created_at).toISOString(),
      p.label.toUpperCase(),
      (p.confidence * 100).toFixed(2) + '%',
      p.models_ran,
      p.winning_model,
      (p.prob_real * 100).toFixed(2) + '%',
      (p.prob_fake * 100).toFixed(2) + '%',
      p.processing_time_ms
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try {
      await api.logAdminAction('download_audit_report', {
        filters: { filter, searchFilename, startDate, endDate },
        total_rows_exported: filteredPredictions.length
      });
    } catch (err) {
      console.error('Failed to log audit report download:', err);
    }
  };

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Prediction Logs / Audit */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Prediction History & Audit Logs</h3>
              <button className="btn btn-primary" onClick={downloadCSV}>
                📥 Download Report
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {/* Search */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search File:</label>
                <input 
                  type="text" 
                  placeholder="Enter filename..." 
                  value={searchFilename} 
                  onChange={e => setSearchFilename(e.target.value)}
                  className="input-field"
                  style={{ width: '200px', padding: '6px 12px' }}
                />
              </div>
              
              {/* Date Filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From Date:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 12px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To Date:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 12px' }}
                />
              </div>

              {/* Verdict Filters */}
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', marginBottom: '2px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.85rem', background: filter === 'All' ? 'rgba(99,102,241,0.2)' : '' }} 
                  onClick={() => setFilter('All')}
                >All</button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.85rem', background: filter === 'Real' ? 'rgba(99,102,241,0.2)' : '' }} 
                  onClick={() => setFilter('Real')}
                >Real</button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.85rem', background: filter === 'Fake' ? 'rgba(99,102,241,0.2)' : '' }} 
                  onClick={() => setFilter('Fake')}
                >Fake</button>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, overflowX: 'auto' }}>
            {filteredPredictions.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px' }}>
                <p>No predictions match your criteria.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Filename</th>
                    <th>Uploaded By (ID)</th>
                    <th>Verdict</th>
                    <th>Confidence</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPredictions.map(p => (
                    <React.Fragment key={p.prediction_id}>
                      <tr 
                        style={{ cursor: 'pointer', background: expandedRow === p.prediction_id ? 'var(--bg-subtle)' : 'transparent' }}
                        onClick={() => setExpandedRow(expandedRow === p.prediction_id ? null : p.prediction_id)}
                      >
                        <td style={{ color: 'var(--text-muted)' }}>
                          {expandedRow === p.prediction_id ? '▼' : '▶'}
                        </td>
                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.filename || '—'}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                          {p.anonymized_user_id || '—'}
                        </td>
                        <td><span className={`label-badge ${p.label}`}>{p.label}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{(p.confidence * 100).toFixed(1)}%</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(p.created_at)}</td>
                      </tr>
                      {expandedRow === p.prediction_id && (
                        <tr style={{ background: 'var(--bg-subtle)' }}>
                          <td colSpan="6" style={{ padding: '16px 48px 32px 48px', borderBottom: '1px solid var(--border)' }}>
                            <PredictionResult result={p} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }} 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(c => c - 1)}
                >Previous</button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }} 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(c => c + 1)}
                >Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h3 style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', margin: 0 }}>Recent Users</h3>
          <div style={{ overflowX: 'auto' }}>
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
        </div>

      </div>
    </div>
  );
}
