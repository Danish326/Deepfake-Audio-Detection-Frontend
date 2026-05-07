import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import QuotaCard from '../components/QuotaCard';

export default function ProfilePage() {
  const { user } = useAuth();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getQuotaStatus()
      .then(setQuota)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const initials = user
    ? (user.first_name && user.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`
        : user.username?.substring(0, 2) || '??'
      ).toUpperCase()
    : '??';

  const joinDate = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your account details and subscription</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="profile-fields">
          <div className="profile-field">
            <div className="field-label">Username</div>
            <div className="field-value">{user?.username}</div>
          </div>
          <div className="profile-field">
            <div className="field-label">Email</div>
            <div className="field-value">{user?.email}</div>
          </div>
          <div className="profile-field">
            <div className="field-label">Member Since</div>
            <div className="field-value">{joinDate}</div>
          </div>
          <div className="profile-field">
            <div className="field-label">Account Status</div>
            <div className="field-value" style={{ color: user?.is_active ? 'var(--success)' : 'var(--danger)' }}>
              {user?.is_active ? '● Active' : '● Inactive'}
            </div>
          </div>
        </div>
      </div>

      <QuotaCard quota={quota} loading={loading} />
    </div>
  );
}
