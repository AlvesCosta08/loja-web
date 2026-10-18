import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminProducts } from './AdminProducts';
import { productApi } from '@/features/products/api/api';

// 1. O componente agora usa productApi, então mockamos ele.
vi.mock('@/features/products/api/api', () => ({
  productApi: {
    list: vi.fn(),
    delete: vi.fn(),
    // create e update são usados pelo modal, mas não precisam ser mockados aqui
    // se o teste não abrir o modal.
  },
}));

const fakeProducts = [
  { id: 1, name: 'Camiseta', price: 59.9, stock: 10, category: 'Roupas', imageUrl: null },
  { id: 2, name: 'Calça', price: 129.9, stock: 5, category: 'Roupas', imageUrl: null },
];

describe('AdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Configura o mock do list para retornar a estrutura de PageResponse
    vi.mocked(productApi.list).mockResolvedValue({
      content: fakeProducts,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 100,
    } as any);
  });

  it('renderiza a lista de produtos', async () => {
    renderWithProviders(<AdminProducts />);

    // Verifica se os produtos aparecem na tabela
    expect(await screen.findByText('Camiseta')).toBeInTheDocument();
    expect(screen.getByText('Calça')).toBeInTheDocument();
    
    // Verifica se os botões de ação aparecem
    expect(screen.getAllByText('Editar')).toHaveLength(2);
    expect(screen.getAllByText('Excluir')).toHaveLength(2);
  });

  it('exibe o botão de criar novo produto', async () => {
    renderWithProviders(<AdminProducts />);
    
    // O botão "+ Novo Produto" deve estar visível
    expect(await screen.findByRole('button', { name: /novo produto/i })).toBeInTheDocument();
  });
});