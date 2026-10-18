import { Outlet, NavLink, Link } from 'react-router';

export function AdminLayout() {
  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      
      {/* Sidebar (Menu Lateral) */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Painel Administrativo
          </h2>
          <nav className="flex flex-col gap-1">
            <NavLink to="/admin/dashboard" className={menuClass}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </NavLink>
            <NavLink to="/admin/orders" className={menuClass}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Pedidos
            </NavLink>
            <NavLink to="/admin/products" className={menuClass}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Produtos
            </NavLink>
            <NavLink to="/admin/users" className={menuClass}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Usuários
            </NavLink>
            
            <div className="my-2 border-t border-slate-100"></div>
            
            <Link to="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar para a Loja
            </Link>
          </nav>
        </div>
      </aside>

      {/* Área de Conteúdo (Onde as páginas filhas serão renderizadas) */}
      <main className="flex-1">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}