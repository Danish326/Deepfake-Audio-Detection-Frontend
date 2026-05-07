import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;
  }

  // Allow access only to staff or superusers
  if (!user || !(user.is_staff || user.is_superuser)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
