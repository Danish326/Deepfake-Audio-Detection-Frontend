import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import PredictionResult from '../components/PredictionResult';

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [searchFilename, setSearchFilename] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isAdvancedUser, setIsAdvancedUser] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: quotaData } = useQuery({
    queryKey: ['quotaStatus'],
    queryFn: api.getQuotaStatus,
    enabled: !!user && !user.is_staff && !user.is_superuser,
    retry: false
  });

  useEffect(() => {
    if (user?.is_staff || user?.is_superuser) {
      setIsAdvancedUser(true);
    } else if (quotaData?.plan?.name && quotaData.plan.name !== 'free') {
      setIsAdvancedUser(true);
    } else {
      setIsAdvancedUser(false);
    }
  }, [user, quotaData]);

  const { data: historyData, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.getHistory(0), // Fetch all history to allow client-side pagination and CSV export
    enabled: !!user
  });

  const predictions = historyData?.predictions || [];
  const error = queryError?.message || '';

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

  const downloadCSV = () => {
    const headers = ['Prediction ID', 'Filename', 'Date', 'Verdict', 'Confidence', 'Models Ran', 'Winning Model', 'P(Real)', 'P(Fake)', 'Processing Time (ms)'];
    
    const rows = filteredPredictions.map(p => [
      p.prediction_id,
      p.filename || 'N/A',
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
    link.setAttribute("download", `prediction_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Prediction History</h1>
          <p>Review and download your past audio analyses</p>
        </div>
        <button className="btn btn-primary" onClick={downloadCSV} disabled={filteredPredictions.length === 0}>
          📥 Download Report
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Filters Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
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
          <>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>File</th>
                    <th>Verdict</th>
                    <th>Confidence</th>
                    <th>Model</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPredictions.map((p) => (
                    <React.Fragment key={p.prediction_id}>
                      <tr 
                        style={{ cursor: 'pointer', background: expandedRow === p.prediction_id ? 'var(--bg-subtle)' : 'transparent' }}
                        onClick={() => setExpandedRow(expandedRow === p.prediction_id ? null : p.prediction_id)}
                      >
                        <td style={{ color: 'var(--text-muted)' }}>
                          {expandedRow === p.prediction_id ? '▼' : '▶'}
                        </td>
                        <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.filename || '—'}
                        </td>
                        <td><span className={`label-badge ${p.label}`}>{p.label}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{(p.confidence * 100).toFixed(1)}%</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{p.winning_model}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{p.processing_time_ms?.toFixed(0)}ms</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(p.created_at)}</td>
                      </tr>
                      {expandedRow === p.prediction_id && (
                        <tr style={{ background: 'var(--bg-subtle)' }}>
                          <td colSpan="7" style={{ padding: '16px 48px 32px 48px', borderBottom: '1px solid var(--border)' }}>
                            <PredictionResult result={p} isAdvancedUser={isAdvancedUser} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 16px', fontSize: '0.85rem' }} 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                  >Previous</button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 16px', fontSize: '0.85rem' }} 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => c + 1)}
                  >Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
