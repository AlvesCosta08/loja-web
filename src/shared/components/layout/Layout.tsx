import { Outlet, Link, NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/store';
import { Button } from '@/shared/components/ui/Button';

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          
          <Link to="/" className="text-lg font-bold text-brand-700">🛒 Loja</Link>
          
          <nav className="flex items-center gap-4">
            <NavLink to="/" className="text-sm font-medium text-gray-700 hover:text-brand-600">Início</NavLink>
            <NavLink to="/products" className="text-sm font-medium text-gray-700 hover:text-brand-600">Produtos</NavLink>
          </nav>

          {/* Área de Autenticação Dinâmica */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Olá, <strong className="text-gray-900">{user?.name}</strong>
                </span>
                <Button variant="danger" onClick={handleLogout} className="px-3 py-1 text-sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" className="px-3 py-1 text-sm">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="px-3 py-1 text-sm">Criar conta</Button>
                </Link>
              </>
            )}
          </div>
          
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Loja — Alves Costa
      </footer>
    </div>
  );
}