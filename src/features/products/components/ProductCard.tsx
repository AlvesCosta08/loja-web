import { Link } from 'react-router';
import type { ProductResponse } from '@/shared/types/api';
import { Button } from '@/shared/components/ui/Button';

export function ProductCard({ product }: { product: ProductResponse }) {
  // Formata o preço para o padrão brasileiro (R$ 59,90)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Área da Imagem */}
      <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm">Sem imagem</span>
        )}
      </div>
      
      {/* Informações */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 flex-1 text-lg font-bold text-gray-800" title={product.name}>
          {product.name}
        </h3>
        
        <div className="mt-4 flex items-end justify-between">
          <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
          <Link to={`/products/${product.id}`}>
            <Button variant="secondary" className="px-3 py-1.5 text-sm">
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}