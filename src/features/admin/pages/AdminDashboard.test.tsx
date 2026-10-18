import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminDashboard } from './AdminDashboard';
import { adminApi } from '../api/api';

vi.mock('../api/api', () => ({
  adminApi: { getDashboard: vi.fn() },
}));

describe('AdminDashboard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza os cards com os dados da API', async () => {
    vi.mocked(adminApi.getDashboard).mockResolvedValueOnce({
      totalOrders: 150,
      totalRevenue: 15000.50,
      averageTicket: 100.00,
      pendingOrders: 5,
      lowStockProducts: 3,
    });

    renderWithProviders(<AdminDashboard />);

    // Verifica se o título renderizou
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();

    // Verifica os valores formatados
    expect(screen.getByText('150')).toBeInTheDocument(); // totalOrders
    expect(screen.getByText('R$ 15.000,50')).toBeInTheDocument(); // totalRevenue
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument(); // averageTicket
  });

  it('mostra estado de loading enquanto busca os dados', () => {
    vi.mocked(adminApi.getDashboard).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<AdminDashboard />);
    
    // O spinner deve aparecer
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });
});