import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu role cụ thể
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.VAITRO || !allowedRoles.includes(user.VAITRO)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
