import { api } from '@/shared/lib/axios';
import type { PageResponse, OrderResponse, ProductResponse, UserResponse, Role } from '@/shared/types/api';

export interface DashboardResponse {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export const adminApi = {
  getDashboard: () =>
    api.get<DashboardResponse>('/admin/dashboard').then((r) => r.data),

  getOrders: () =>
    api.get<PageResponse<OrderResponse>>('/admin/orders').then((r) => r.data),

  getLowStockProducts: () =>
    api.get<ProductResponse[]>('/admin/products/low-stock').then((r) => r.data),

  restockProduct: (id: number, quantity: number) =>
    api.post<ProductResponse>(`/admin/products/${id}/restock`, { quantity }).then((r) => r.data),

  // Adicionado para a tela AdminUsers
  getUsers: () =>
    api.get<PageResponse<UserResponse>>('/admin/users').then((r) => r.data),

  updateUserRole: (id: string, role: Role) =>
    api.patch<UserResponse>(`/admin/users/${id}/role`, { role }).then((r) => r.data),
};