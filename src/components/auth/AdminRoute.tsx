import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../LoadingSpinner';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const location = useLocation();

  if (authLoading || adminLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}