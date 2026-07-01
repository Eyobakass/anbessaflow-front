import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const role = (user.role || user.user?.role || '').replace('ROLE_', '');
    if (!allowedRoles.includes(role)) {
      // Redirect to the correct dashboard
      if (role === 'ADMIN') return <Navigate to="/admin" replace />;
      if (role === 'OPERATOR') return <Navigate to="/operator" replace />;
      return <Navigate to="/passenger" replace />;
    }
  }

  return <Outlet />;
}
