import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/api';
import { Button } from '@/shared/components/ui/Button';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  CANCELED: 'bg-red-100 text-red-800',
};
const LABELS: Record<string, string> = {
  PENDING: 'Aguardando pagamento',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  CANCELED: 'Cancelado',
};

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrder(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-red-50 p-6 text-center text-red-700">
        <p className="font-semibold">Pedido não encontrado.</p>
        <Link to="/orders" className="mt-4 inline-block text-sm underline">Voltar aos pedidos</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h1>
          <p className="text-sm text-gray-500">
            Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STYLES[order.status]}`}>
          {LABELS[order.status]}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Itens
        </h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-500">{item.quantity}x {brl.format(Number(item.unitPrice))}</p>
              </div>
              <span className="font-semibold text-gray-800">{brl.format(Number(item.subtotal))}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-sm">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{brl.format(Number(order.total) - Number(order.shippingCost) + Number(order.discount))}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Desconto {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>− {brl.format(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Frete</span>
            <span>{order.shippingCost > 0 ? brl.format(Number(order.shippingCost)) : 'Grátis'}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
            <span>Total</span>
            <span className="text-brand-700">{brl.format(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link to="/orders" className="text-sm text-gray-600 hover:text-brand-600">← Voltar</Link>
        {order.status === 'PENDING' && (
          <Link to={`/orders/${order.id}/pay`}>
            <Button className="w-full px-8 py-3 sm:w-auto">Pagar agora</Button>
          </Link>
        )}
      </div>
    </div>
  );
}