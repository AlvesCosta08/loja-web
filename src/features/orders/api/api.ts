import { api } from '@/shared/lib/axios';
import type { OrderResponse } from '@/shared/types/api';

export const orderApi = {
  createOrder: (cep: string, couponCode?: string) =>
    api.post<OrderResponse>('/orders', null, {
      params: { cep, couponCode }
    }).then((r) => r.data),
    
  getOrders: () => api.get<OrderResponse[]>('/orders').then((r) => r.data),
};