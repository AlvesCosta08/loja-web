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
  const size = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productApi.list({ page, size, search }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.set('search', searchInput);
      prev.set('page', '0');
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
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row">
        <h1 className="text-2xl font-bold text-gray-800">Nossos Produtos</h1>
        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          <Button type="submit">Buscar</Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
          Erro ao carregar os produtos. Verifique se o backend está rodando.
        </div>
      ) : data?.content.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button variant="secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {page + 1} de {data.totalPages}
              </span>
              <Button variant="secondary" onClick={() => handlePageChange(page + 1)} disabled={page >= data.totalPages - 1}>
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}