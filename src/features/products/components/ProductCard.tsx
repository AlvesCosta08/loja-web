import { Link } from 'react-router';
import type { ProductResponse } from '@/shared/types/api';
import { Button } from '@/shared/components/ui/Button';
import { getImageUrl } from '@/shared/lib/imageUrl';

export function ProductCard({ product }: { product: ProductResponse }) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Área da Imagem */}
      <div className="relative flex h-48 items-center justify-center bg-slate-50">
        {product.imageUrl ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="h-full w-full object-contain p-2"
            onError={(e) => {
              // Se a imagem falhar, esconde e mostra o fallback
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-6xl opacity-40">📦</span>
        )}
      </div>

      {/* Informações */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 flex-1 text-base font-bold text-slate-900" title={product.name}>
          {product.name}
        </h3>

        <div className="mt-4 flex items-end justify-between gap-2">
          <span className="text-xl font-black text-slate-900">{formattedPrice}</span>
          <Link to={`/products/${product.id}`}>
            <Button className="!bg-blue-600 !px-3 !py-1.5 !text-sm hover:!bg-blue-700">
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}