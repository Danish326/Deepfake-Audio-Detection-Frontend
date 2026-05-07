import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? (user.first_name && user.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`
        : user.username?.substring(0, 2) || '??'
      ).toUpperCase()
    : '??';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">DA</div>
        <div className="brand-text">
          <h2>DeepAudio</h2>
          <span>Detection Suite</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/predict" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🔍</span> Analyze Audio
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📋</span> History
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">👤</span> Profile
        </NavLink>
        {(user?.is_staff || user?.is_superuser) && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">⚙️</span> Admin Panel
          </NavLink>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={handleLogout}>
          <span className="nav-icon">🚪</span> Sign Out
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <div className="user-name">{user?.username || 'User'}</div>
          <div className="user-email">{user?.email || ''}</div>
        </div>
      </div>
    </aside>
  );
}
