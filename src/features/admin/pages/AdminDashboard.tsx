import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/api';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Pedidos Totais */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pedidos Totais</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data?.totalOrders ?? 0}</p>
        </div>

        {/* Card 2: Receita Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Receita Total</p>
          <p className="mt-2 text-3xl font-bold text-brand-700">
            {brl.format(data?.totalRevenue ?? 0)}
          </p>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Ticket Médio</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {brl.format(data?.averageTicket ?? 0)}
          </p>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-yellow-800">Pedidos Pendentes</p>
          <p className="mt-2 text-2xl font-bold text-yellow-900">{data?.pendingOrders ?? 0}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-800">Produtos com Estoque Baixo</p>
          <p className="mt-2 text-2xl font-bold text-red-900">{data?.lowStockProducts ?? 0}</p>
        </div>
      </div>
    </div>
  );
}