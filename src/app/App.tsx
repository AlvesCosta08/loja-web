import { RouterProvider } from 'react-router';
import { AppProviders } from './providers/AppProviders';
import { router } from './router';
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap';
import type { ReactNode } from 'react';

function Bootstrapper({ children }: { children: ReactNode }) {
  const { isBootstrapping } = useAuthBootstrap();

  // Enquanto o backend valida o token do localStorage, mostramos um loading
  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  // Token validado (ou não existia), libera a renderização das rotas
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProviders>
      <Bootstrapper>
        <RouterProvider router={router} />
      </Bootstrapper>
    </AppProviders>
  );
}