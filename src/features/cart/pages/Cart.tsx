import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { cartApi } from '@/features/cart/api/api';
import { Button } from '@/shared/components/ui/Button';

export function Cart() {
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
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
      <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
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
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
      
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              Imagem
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.productName}</h3>
              <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <span className="text-lg font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-bold text-brand-700">{formattedTotal}</span>
      </div>

      <div className="flex justify-end">
        <Button className="px-8 py-3 text-lg">Finalizar Compra</Button>
      </div>
    </div>
  );
}