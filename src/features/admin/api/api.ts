import { api } from '@/shared/lib/axios';
import type {
  Role,
  UserResponse,
  PageResponse,
  OrderResponse,
  OrderStatus,
  ProductResponse,
  DashboardStats,
} from '@/shared/types/api';

export const adminApi = {
  getUsers: async (): Promise<PageResponse<UserResponse>> => {
    const { data } = await api.get<PageResponse<UserResponse>>('/admin/users');
    return data;
  },

  updateUserRole: async (id: number, role: Role): Promise<UserResponse> => {
    const { data } = await api.patch<UserResponse>(`/admin/users/${id}/role`, { role });
    return data;
  },

  getOrders: async (): Promise<PageResponse<OrderResponse>> => {
    const { data } = await api.get<PageResponse<OrderResponse>>('/admin/orders');
    return data;
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<OrderResponse> => {
    const { data } = await api.patch<OrderResponse>(`/admin/orders/${id}/status`, { status });
    return data;
  },

  getProducts: async (): Promise<PageResponse<ProductResponse>> => {
    const { data } = await api.get<PageResponse<ProductResponse>>('/admin/products');
    return data;
  },

  restockProduct: async (id: number, quantity: number): Promise<ProductResponse> => {
    const { data } = await api.patch<ProductResponse>(`/admin/products/${id}/restock`, { quantity });
    return data;
  },

  // 👇 ADICIONADO: faltava este método
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/admin/dashboard');
    return data;
  },
};