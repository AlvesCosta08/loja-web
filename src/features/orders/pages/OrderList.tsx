import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { orderApi } from '@/features/orders/api/api';
import { Button } from '@/shared/components/ui/Button';
import type { PageResponse, OrderResponse } from '@/shared/types/api';

export function OrderList() {
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 rounded-xl bg-red-50 p-6 text-center text-red-600">
        Erro ao carregar os pedidos. Verifique se o backend está rodando.
      </div>
    );
  }

  // O backend retorna Page<OrderResponse>, então os itens ficam em .content
  const orders: OrderResponse[] = Array.isArray(rawData) 
    ? rawData 
    : (rawData as unknown as PageResponse<OrderResponse>)?.content || [];

  if (orders.length === 0) {
    return (
      <div className="mt-10 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <h2 className="text-xl font-bold text-gray-700">Você ainda não fez nenhum pedido</h2>
        <p className="mt-2 text-gray-500">Explore nossa loja e encontre o que precisa.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });

          const formattedTotal = new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL',
          }).format(Number(order.total));

          const statusColor = 
            order.status === 'PAID' ? 'bg-green-100 text-green-700' : 
            order.status === 'CANCELED' ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700';

          return (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Pedido <span className="font-bold text-gray-800">#{order.id}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Realizado em {orderDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-brand-700">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      <span className="font-medium text-gray-800">{item.quantity}x</span> {item.productName}
                    </span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.subtotal))}
                    </span>
                  </div>
                ))}
              </div>

              {/* BOTÃO NOVO AQUI */}
              <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="secondary" className="text-sm">Ver detalhes</Button>
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}