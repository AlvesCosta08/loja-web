import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '../api/api';
import { productApi } from '@/features/products/api/api';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function AdminProducts() {
  const queryClient = useQueryClient();
  const [restockValues, setRestockValues] = useState<Record<number, string>>({});

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.list({ page: 0, size: 50 }),
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      adminApi.restockProduct(id, quantity),
    onSuccess: () => {
      toast.success('Estoque reposto com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setRestockValues({});
    },
    onError: () => toast.error('Erro ao repor o estoque.'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const products = pageData?.content || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Produto</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Preço</th>
              <th className="px-6 py-3">Estoque</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const lowStock = product.stock <= 5;
              const value = restockValues[product.id] || '';
              
              return (
                <tr key={product.id} className={lowStock ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{brl.format(Number(product.price))}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${lowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qtd"
                        value={value}
                        onChange={(e) => setRestockValues({ ...restockValues, [product.id]: e.target.value })}
                        aria-label={`Repor quantidade do produto ${product.id}`}
                        className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const qty = parseInt(value, 10);
                          if (isNaN(qty) || qty <= 0) {
                            toast.error('Digite uma quantidade válida.');
                            return;
                          }
                          restockMutation.mutate({ id: product.id, quantity: qty });
                        }}
                        disabled={restockMutation.isPending || !value}
                        aria-label={`Repor estoque do produto ${product.id}`}
                        className="rounded-md bg-brand-600 px-3 py-1 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                      >
                        Repor
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}