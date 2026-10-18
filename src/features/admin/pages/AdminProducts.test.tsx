import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminProducts } from './AdminProducts';
import { adminApi } from '../api/api';
import { productApi } from '@/features/products/api/api';

vi.mock('../api/api', () => ({
  adminApi: { restockProduct: vi.fn() },
}));

vi.mock('@/features/products/api/api', () => ({
  productApi: { list: vi.fn(), create: vi.fn() },
}));

const fakeProducts = [
  { id: 1, name: 'Caneta Azul', price: 2.50, stock: 50, category: 'Papelaria' },
  { id: 2, name: 'Caderno', price: 15.00, stock: 2, category: 'Papelaria' },
];

describe('AdminProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza a tabela de produtos', async () => {
    vi.mocked(productApi.list).mockResolvedValueOnce({
      content: fakeProducts,
      totalElements: 2, totalPages: 1, number: 0, size: 10,
    });
    
    renderWithProviders(<AdminProducts />);

    expect(await screen.findByText('Caneta Azul')).toBeInTheDocument();
    expect(screen.getByText('Caderno')).toBeInTheDocument();
  });

  it('permite repor o estoque de um produto', async () => {
    vi.mocked(productApi.list).mockResolvedValueOnce({
      content: fakeProducts,
      totalElements: 2, totalPages: 1, number: 0, size: 10,
    });
    vi.mocked(adminApi.restockProduct).mockResolvedValueOnce({ ...fakeProducts[1], stock: 12 });

    const user = userEvent.setup();
    renderWithProviders(<AdminProducts />);

    // 1. Busca o input com o novo label
    const input = await screen.findByLabelText(/repor quantidade do produto 2/i);
    await user.type(input, '10');
    
    // 2. Busca o botão
    const button = screen.getByRole('button', { name: /repor estoque do produto 2/i });
    
    // 3. A MÁGICA: Espera o botão habilitar (o estado do input foi atualizado)
    await waitFor(() => expect(button).toBeEnabled());
    
    // 4. Clica
    await user.click(button);

    expect(adminApi.restockProduct).toHaveBeenCalledWith(2, 10);
  });
});