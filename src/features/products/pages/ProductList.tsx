import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productApi } from '@/features/products/api/api';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Button } from '@/shared/components/ui/Button';

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const page = Number(searchParams.get('page') || 0);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const size = 12;

  // 👇 Incluímos a categoria na busca (caso venha por URL)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', page, search, category],
    queryFn: () => productApi.list({ page, size, search, category }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (searchInput) prev.set('search', searchInput);
      else prev.delete('search');
      prev.set('page', '0'); // Sempre volta para a página 1 ao buscar
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Cabeçalho da Página e Barra de Busca */}
      <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {category ? `Categoria: ${category}` : 'Todos os Produtos'}
          </h1>
          <p className="mt-2 text-slate-500">Explore nossa seleção exclusiva de itens.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Button type="submit" className="!px-6 !py-2.5 !bg-slate-900 hover:!bg-slate-800">Buscar</Button>
        </form>
      </div>

      {/* Estados de Carregamento, Erro e Lista */}
      {isLoading ? (
        // Skeleton Loader Profissional
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
              <div className="aspect-square rounded-lg bg-slate-100 mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="text-lg font-bold text-red-600">Erro ao carregar produtos</p>
          <p className="text-sm text-red-500 mt-1">Verifique sua conexão ou se o backend está rodando.</p>
        </div>
      ) : data?.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-16 text-center">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="text-lg font-bold text-slate-900">Nenhum produto encontrado</h3>
          <p className="text-slate-500 mt-1">Tente buscar por outros termos ou categorias.</p>
          {search && (
            <Button 
              onClick={() => { setSearchInput(''); setSearchParams({}); }} 
              className="mt-6 !bg-white !text-slate-700 !border !border-slate-300 hover:!bg-slate-100"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginação */}
          {data && data.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 border-t border-slate-200 pt-8">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 0}
                className="!px-6"
              >
                &larr; Anterior
              </Button>
              
              <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                Página <span className="font-bold text-slate-900">{page + 1}</span> de {data.totalPages}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page >= data.totalPages - 1}
                className="!px-6"
              >
                Próxima &rarr;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}