import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/store';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}