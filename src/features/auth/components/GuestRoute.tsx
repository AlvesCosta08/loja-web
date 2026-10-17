import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/store';

export function GuestRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}