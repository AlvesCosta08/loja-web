import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminOrders } from './AdminOrders';
import { adminApi } from '../api/api';
import { orderApi } from '@/features/orders/api/api';

vi.mock('../api/api', () => ({
  adminApi: { getOrders: vi.fn() },
}));
vi.mock('@/features/orders/api/api', () => ({
  orderApi: { updateStatus: vi.fn() },
}));

const fakeOrders = [
  { id: 1, userId: 10, status: 'PENDING', total: 150.0, createdAt: '2026-10-18T10:00:00Z', items: [] },
  { id: 2, userId: 11, status: 'PAID',    total: 200.0, createdAt: '2026-10-18T11:00:00Z', items: [] },
];

describe('AdminOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ✅ resposta fixa para TODAS as chamadas (inclusive o refetch pós-mutação)
    vi.mocked(adminApi.getOrders).mockResolvedValue({ content: fakeOrders } as any);
  });

  it('renderiza a lista de todos os pedidos do sistema', async () => {
    renderWithProviders(<AdminOrders />);

    expect(await screen.findByText(/pedidos/i)).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
  });

  it('permite alterar o status de um pedido', async () => {
    vi.mocked(orderApi.updateStatus).mockResolvedValueOnce({
      ...fakeOrders[0],
      status: 'SHIPPED',
    } as any);

    const user = userEvent.setup();
    renderWithProviders(<AdminOrders />);

    const select = await screen.findByRole('combobox', { name: /status do pedido 1/i });
    await user.selectOptions(select, 'SHIPPED');

    expect(orderApi.updateStatus).toHaveBeenCalledWith(1, 'SHIPPED');
  });
});