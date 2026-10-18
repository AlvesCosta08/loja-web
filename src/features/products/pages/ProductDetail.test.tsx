import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductDetail } from './ProductDetail';
import { vi, describe, it, expect } from 'vitest';
import { productApi } from '@/features/products/api/api';

// 1. Mock da API de produtos
vi.mock('@/features/products/api/api', () => ({
  productApi: {
    getById: vi.fn(),
  },
}));

// 2. Mock do useAuthStore (evita erro de "is not a function")
vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

// 3. Mock do cartApi (para evitar erro na criação do mutation)
vi.mock('@/features/cart/api/api', () => ({
  cartApi: {
    addItem: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('ProductDetail', () => {
  it('deve renderizar as informações do produto e o botão de adicionar ao carrinho', async () => {
    // 4. Configura o mock para retornar um produto falso
    vi.mocked(productApi.getById).mockResolvedValue({
      id: 1,
      name: 'Camiseta Dev',
      price: 59.90,
      stock: 10,
      category: 'Vestuário',
      imageUrl: null,
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

    // 5. Busca pelo heading (h1), pois o nome aparece 2x na tela (breadcrumb + título)
    expect(
      await screen.findByRole('heading', { name: /Camiseta Dev/i })
    ).toBeInTheDocument();

    // Verifica se o botão de adicionar ao carrinho está na tela
    expect(
      screen.getByRole('button', { name: /adicionar ao carrinho/i })
    ).toBeInTheDocument();
  });
});