import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/axios';
import { paymentApi } from './api';

vi.mock('@/shared/lib/axios', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

describe('paymentApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('createPixPayment → POST /payments?orderId=N', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    await paymentApi.createPixPayment(42);
    expect(api.post).toHaveBeenCalledWith('/payments', null, { params: { orderId: 42 } });
  });

  it('createCardPayment → POST /payments/card?orderId=N', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 2 } });
    await paymentApi.createCardPayment(9);
    expect(api.post).toHaveBeenCalledWith('/payments/card', null, { params: { orderId: 9 } });
  });

  it('getPayment → GET /payments/{id}', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 5 } });
    await paymentApi.getPayment(5);
    expect(api.get).toHaveBeenCalledWith('/payments/5');
  });

  it('getLatestByOrder → GET /payments?orderId=N', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 3, orderId: 7 } });
    const r = await paymentApi.getLatestByOrder(7);
    expect(api.get).toHaveBeenCalledWith('/payments', { params: { orderId: 7 } });
    expect(r.orderId).toBe(7);
  });
});