import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '@/features/products/api/api';
import { cartApi } from '@/features/cart/api/api';
import { Button } from '@/shared/components/ui/Button';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // 1. Busca o produto
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(Number(id)),
    enabled: !!id,
  });

  // 2. Mutation para adicionar ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem({ productId: Number(id), quantity: 1 }),
    onSuccess: () => {
      // Invalida o cache do carrinho para atualizar o Header e a página do carrinho
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Produto adicionado ao carrinho!');
    },
    onError: () => {
      toast.error('Erro ao adicionar ao carrinho.');
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
        Erro ao carregar o produto.
        <Link to="/products" className="mt-4 block text-brand-600 hover:underline">
          Voltar para o catálogo
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/products" className="inline-block text-sm text-brand-600 hover:underline">
        &larr; Voltar para o catálogo
      </Link>
      
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            <span>Sem imagem</span>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              {product.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <p className="mt-4 text-gray-600">
              Este é um excelente produto da categoria {product.category}. 
              Adquira já o seu!
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                Estoque: {product.stock} un.
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              className="w-full" 
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending || product.stock === 0}
            >
              {addToCartMutation.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}