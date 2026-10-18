// src/shared/components/layout/Layout.tsx
import { Outlet, Link, NavLink, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import { cartApi } from '@/features/cart/api/api';
import { Button } from '@/shared/components/ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { ChatWidget } from '../ui/ChatWidget';

export function Layout() {
  const navigate = useNavigate();
  // 👇 Adicionamos o isAdmin na desestruturação
  const { isAuthenticated, isAdmin, user, clearAuth } = useAuthStore();
  
  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart, enabled: isAuthenticated });

  const handleLogout = () => { clearAuth(); navigate('/login'); };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-semibold transition-colors py-2 ${
      isActive 
        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600' 
        : 'text-slate-600 hover:text-blue-600'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      
      {/* TOP BAR */}
      <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        🚚 Frete grátis em compras acima de R$ 150 | 📦 Entrega em até 3 dias úteis
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2 text-2xl font-black tracking-tighter text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white shadow-sm">
              <span className="text-lg">L</span>
            </div>
            Loja.
          </Link>
          
          {/* Barra de Busca */}
          <div className="hidden flex-1 items-center md:flex">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* Navegação */}
          <nav className="hidden items-center gap-8 lg:flex">
            <NavLink to="/products" className={navLinkClass}>Produtos</NavLink>
            {isAuthenticated && <NavLink to="/orders" className={navLinkClass}>Pedidos</NavLink>}
          </nav>

          {/* Ações do Usuário */}
          <div className="flex shrink-0 items-center gap-5">
            {isAuthenticated ? (
              <>
                <div className="group relative flex cursor-pointer items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-xs text-slate-500">Bem-vindo,</span>
                    <span className="text-sm font-bold text-slate-900 leading-none">{user?.name?.split(' ')[0]}</span>
                  </div>
                  
                  {/* 👇 DROPDOWN ATUALIZADO COM O LINK ADMIN */}
                  <div className="absolute right-0 top-full mt-2 hidden w-48 flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:flex">
                    
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className="mb-1 rounded-md border-b border-slate-100 px-3 py-2 text-left text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        ⚡ Painel Admin
                      </Link>
                    )}

                    <button onClick={handleLogout} className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Sair da conta
                    </button>
                  </div>
                </div>

                <Link to="/cart" className="relative flex items-center justify-center rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-blue-600 hover:bg-blue-50">
                  <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {cart && cart.itemCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {cart.itemCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600">Entrar</Link>
                <Link to="/register">
                  <Button className="!px-6 !py-2.5 !text-sm">Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full flex-1 pb-20">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="flex items-center justify-center gap-2 text-xl font-black text-slate-900">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white"><span className="text-xs">L</span></div>
            Loja.
          </div>
          <p className="mt-4 text-sm text-slate-500">© {new Date().getFullYear()} Loja Inc. Todos os direitos reservados.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600">Termos de Uso</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600">Privacidade</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600">Central de Ajuda</a>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}