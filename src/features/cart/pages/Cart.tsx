import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router'; // <-- useNavigate importado
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { cartApi } from '@/features/cart/api/api';
import { Button } from '@/shared/components/ui/Button';

export function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // <-- Hook instanciado

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  });

  // Mutation para atualizar a quantidade
  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.updateItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Erro ao atualizar a quantidade.';
      toast.error(message);
    },
  });

  // Mutation para remover o item
  const removeItemMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removido do carrinho.');
    },
    onError: () => toast.error('Erro ao remover o item.'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mt-10 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <h2 className="text-xl font-bold text-gray-700">Seu carrinho está vazio</h2>
        <p className="mt-2 text-gray-500">Adicione produtos para continuar comprando.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cart.total);

  return (
    <div className="mx-auto mt-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
      
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {cart.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 border-b border-gray-100 p-4 last:border-0 sm:flex-row sm:items-center">
            
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              Imagem
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.productName}</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)} / un.
              </p>
            </div>
            
            {/* Controles de Quantidade e Remoção */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-gray-300 bg-white">
                <button
                  onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity - 1 })}
                  disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-medium text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                  disabled={updateQuantityMutation.isPending}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <Button
                variant="danger"
                className="px-3 py-1 text-sm"
                onClick={() => removeItemMutation.mutate(item.id)}
                disabled={removeItemMutation.isPending}
              >
                Remover
              </Button>
            </div>

            <div className="text-right sm:w-24">
              <p className="font-bold text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row">
        <span className="text-lg font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-bold text-brand-700">{formattedTotal}</span>
      </div>

      <div className="flex justify-end">
        {/* O onClick navega para o checkout */}
        <Button 
          className="w-full px-8 py-3 text-lg sm:w-auto"
          onClick={() => navigate('/checkout')}
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}