import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { OrderDetail } from './OrderDetail';
import { orderApi } from '../api/api';
import type { OrderResponse } from '@/shared/types/api';

vi.mock('../api/api', () => ({ orderApi: { getOrder: vi.fn() } }));

const order = (s: OrderResponse['status'] = 'PENDING'): OrderResponse => ({
  id: 12, userId: 1, status: s, total: 179.8, discount: 0, shippingCost: 20,
  couponCode: null, createdAt: '2025-01-15T10:00:00Z',
  items: [{ id: 1, productId: 10, productName: 'Camiseta', unitPrice: 79.9, quantity: 2, subtotal: 159.8 }],
});

const renderPage = () =>
  renderWithProviders(<OrderDetail />, { route: '/orders/12', path: '/orders/:id' });

describe('OrderDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza ID, itens e valor', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order());
    renderPage();
    expect(await screen.findByText(/pedido #12/i)).toBeInTheDocument();
    expect(screen.getByText('Camiseta')).toBeInTheDocument();
    expect(screen.getByText(/2x/i)).toBeInTheDocument();
  });

  it('mostra "Pagar agora" quando PENDING', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order('PENDING'));
    renderPage();
    expect(await screen.findByRole('link', { name: /pagar agora/i })).toBeInTheDocument();
  });

  it('NÃO mostra "Pagar agora" quando PAID', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order('PAID'));
    renderPage();
    await screen.findByText(/pedido #12/i);
    expect(screen.queryByRole('link', { name: /pagar agora/i })).not.toBeInTheDocument();
  });

  it('mostra erro se pedido não existe', async () => {
    vi.mocked(orderApi.getOrder).mockRejectedValueOnce(new Error('404'));
    renderPage();
    expect(await screen.findByText(/pedido não encontrado/i)).toBeInTheDocument();
  });
});