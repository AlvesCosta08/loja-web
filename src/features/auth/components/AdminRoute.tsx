import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/store';

export function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  // Lemos a store inteira para compatibilidade com o mock do teste
  const { isAuthenticated, isAdmin } = useAuthStore();

  // Se não está logado, manda para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está logado mas não é admin, manda para a home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}