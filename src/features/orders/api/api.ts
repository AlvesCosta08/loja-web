import { api } from '@/shared/lib/axios';
import type { OrderResponse, OrderStatus } from '@/shared/types/api';

export const orderApi = {
  createOrder: (cep: string, couponCode?: string) =>
    api.post<OrderResponse>('/orders', null, {
      params: { cep, couponCode }
    }).then((r) => r.data),
    
  getOrders: () => api.get<OrderResponse[]>('/orders').then((r) => r.data),

  getOrder: (id: number) =>
    api.get<OrderResponse>(`/orders/${id}`).then((r) => r.data),

  updateStatus: (id: number, status: OrderStatus) =>
    api.patch<OrderResponse>(`/orders/${id}/status`, { status }).then((r) => r.data),
};