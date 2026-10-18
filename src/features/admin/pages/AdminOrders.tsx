import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '../api/api';
import { orderApi } from '@/features/orders/api/api';
import type { OrderStatus } from '@/shared/types/api';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: adminApi.getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error('Erro ao atualizar o status.'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const orders = pageData?.content || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Pedido</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 font-medium text-brand-700">
                  {brl.format(Number(order.total))}
                </td>
                <td className="px-6 py-4">
                  <select
                    aria-label={`Status do pedido ${order.id}`}
                    value={order.status}
                    disabled={updateStatusMutation.isPending}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: order.id,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="CANCELED">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}