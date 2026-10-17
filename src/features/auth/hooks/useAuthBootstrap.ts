import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { authApi } from '@/features/auth/api/api';

export function useAuthBootstrap() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const user = await authApi.me();
        if (!cancelled) setUser(user);
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token, setUser, clearAuth]);

  return { isBootstrapping };
}