import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../LoadingSpinner';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const location = useLocation();

  if (authLoading || adminLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is an admin and trying to access non-admin routes, redirect to admin dashboard
  if (isAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/analytics" replace />;
  }

  // If user is not an admin and trying to access admin routes, redirect to dashboard
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}