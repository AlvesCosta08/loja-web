import { api } from '@/shared/lib/axios';
import type { PaymentResponse } from '@/shared/types/api';

export const paymentApi = {
  createPixPayment: (orderId: number) =>
    api.post<PaymentResponse>('/payments', null, { params: { orderId } }).then((r) => r.data),

  createCardPayment: (orderId: number) =>
    api.post<PaymentResponse>('/payments/card', null, { params: { orderId } }).then((r) => r.data),

  getPayment: (id: number) =>
    api.get<PaymentResponse>(`/payments/${id}`).then((r) => r.data),

  getLatestByOrder: (orderId: number) =>
    api.get<PaymentResponse>('/payments', { params: { orderId } }).then((r) => r.data),
};