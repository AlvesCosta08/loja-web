import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/axios';
import { adminApi } from './api';

vi.mock('@/shared/lib/axios', () => ({
  api: { get: vi.fn() },
}));

describe('adminApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getDashboard → GET /admin/dashboard', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { totalOrders: 10 } });
    const r = await adminApi.getDashboard();
    expect(api.get).toHaveBeenCalledWith('/admin/dashboard');
    expect(r.totalOrders).toBe(10);
  });
});