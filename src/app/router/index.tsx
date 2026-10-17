import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '@/shared/components/layout/Layout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { GuestRoute } from '@/features/auth/components/GuestRoute';

// Lazy loading das páginas
const Home = lazy(() => import('@/features/home/pages/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('@/features/auth/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/pages/Register').then(m => ({ default: m.Register })));
const ProductList = lazy(() => import('@/features/products/pages/ProductList').then(m => ({ default: m.ProductList })));

const PageLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Rota Pública
      { path: '/', element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      
      // Rotas de Autenticação (Apenas para quem NÃO está logado)
      { 
        path: '/login', 
        element: (
          <GuestRoute>
            <Suspense fallback={<PageLoader />}><Login /></Suspense>
          </GuestRoute>
        ) 
      },
      { 
        path: '/register', 
        element: (
          <GuestRoute>
            <Suspense fallback={<PageLoader />}><Register /></Suspense>
          </GuestRoute>
        ) 
      },

      // Rotas Protegidas (Apenas para quem ESTÁ logado)
      { 
        path: '/products', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><ProductList /></Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/cart', 
        element: (
          <ProtectedRoute>
            <div className="p-10 text-center border-2 border-dashed rounded-xl">Carrinho em breve (Fase 5)</div>
          </ProtectedRoute>
        ) 
      },

      // Rota de fallback para 404
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);