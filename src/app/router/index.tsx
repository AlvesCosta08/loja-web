import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '@/shared/components/layout/Layout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { GuestRoute } from '@/features/auth/components/GuestRoute';
import { AdminRoute } from '@/features/auth/components/AdminRoute'; // 👈 NOVO IMPORT

// Lazy loading das páginas
const Home = lazy(() => import('@/features/home/pages/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('@/features/auth/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/pages/Register').then(m => ({ default: m.Register })));
const ProductList = lazy(() => import('@/features/products/pages/ProductList').then(m => ({ default: m.ProductList })));
const ProductDetail = lazy(() => import('@/features/products/pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const NotFound = lazy(() => import('@/shared/pages/NotFound').then(m => ({ default: m.NotFound })));
const Cart = lazy(() => import('@/features/cart/pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/features/checkout/pages/Checkout').then(m => ({ default: m.Checkout })));

// Pedidos
const OrderList = lazy(() => import('@/features/orders/pages/OrderList').then(m => ({ default: m.OrderList })));
const OrderDetail = lazy(() => import('@/features/orders/pages/OrderDetail').then(m => ({ default: m.OrderDetail })));
const PayOrder    = lazy(() => import('@/features/payments/pages/PayOrder').then(m => ({ default: m.PayOrder })));

// 👇 NOVOS IMPORTS DO PAINEL ADMIN
const AdminLayout = lazy(() => import('@/features/admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminOrders = lazy(() => import('@/features/admin/pages/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminProducts = lazy(() => import('@/features/admin/pages/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminUsers = lazy(() => import('@/features/admin/pages/AdminUsers').then(m => ({ default: m.AdminUsers })));

const PageLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
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

      // ROTAS DE PRODUTOS (Públicas)
      {
        path: '/products',
        element: (
          <Suspense fallback={<PageLoader />}><ProductList /></Suspense>
        )
      },
      {
        path: '/products/:id',
        element: (
          <Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>
        )
      },

      // ROTAS PROTEGIDAS (Usuário logado)
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><Cart /></Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><Checkout /></Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><OrderList /></Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: '/orders/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><OrderDetail /></Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: '/orders/:id/pay',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><PayOrder /></Suspense>
          </ProtectedRoute>
        )
      },

      // 👇 ROTAS DO ADMIN (Protegidas por AdminRoute)
      {
        path: '/admin',
        element: (
          <AdminRoute>
            <Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>
          </AdminRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
          { path: 'orders', element: <Suspense fallback={<PageLoader />}><AdminOrders /></Suspense> },
          { path: 'products', element: <Suspense fallback={<PageLoader />}><AdminProducts /></Suspense> },
          { path: 'users', element: <Suspense fallback={<PageLoader />}><AdminUsers /></Suspense> },
        ]
      },

      // Rota 404 (NotFound)
      {
        path: '/404',
        element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
      },

      // Rota de fallback (redireciona qualquer URL desconhecida para 404)
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);