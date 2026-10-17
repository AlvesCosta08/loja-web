import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductDetail } from './ProductDetail';
import { vi } from 'vitest';
import { productApi } from '@/features/products/api/api';

// 1. Mock da API de produtos
vi.mock('@/features/products/api/api', () => ({
  productApi: {
    getById: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('ProductDetail', () => {
  it('deve renderizar as informações do produto e o botão de adicionar ao carrinho', async () => {
    // 2. Configura o mock para retornar um produto falso
    vi.mocked(productApi.getById).mockResolvedValue({
      id: 1,
      name: 'Camiseta Dev',
      price: 59.90,
      stock: 10,
      category: 'Vestuário',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // 3. O componente deve renderizar o produto falso
    expect(await screen.findByText(/Camiseta Dev/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
  });
});