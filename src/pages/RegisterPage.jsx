import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter (a-z)');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter (A-Z)');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number (0-9)');
      return;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h1>Create Account</h1>
          <p>Start detecting deepfake audio for free</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>Account Created Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your account has been created and the Free plan has been assigned.
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Proceed to Login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  className="form-input"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  className="form-input"
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <button
                id="register-submit"
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? <><div className="spinner" /> Creating account...</> : 'Create Account'}
              </button>
            </form>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
              Free plan includes 5 predictions/month
            </p>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
