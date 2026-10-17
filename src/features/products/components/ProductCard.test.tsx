import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductCard } from './ProductCard';
import type { ProductResponse } from '@/shared/types/api';

const mockProduct: ProductResponse = {
  id: 1, // <-- Agora é número, não string
  name: 'Camiseta Dev',
  price: 59.90,
  stock: 10,
  category: 'Vestuário',
  // Removemos description e stockQuantity, que não existem no banco
};

describe('ProductCard', () => {
  it('deve renderizar o nome, categoria e preço formatado', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    expect(screen.getByText('Camiseta Dev')).toBeInTheDocument();
    expect(screen.getByText('Vestuário')).toBeInTheDocument();
    expect(screen.getByText('R$ 59,90')).toBeInTheDocument();
  });

  it('deve ter um link para a página de detalhes do produto', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /ver detalhes/i });
    expect(link).toHaveAttribute('href', '/products/1'); // <-- Agora é /1 e não /1 (string)
  });
});