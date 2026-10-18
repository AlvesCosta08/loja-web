import { useParams, Link, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '@/features/products/api/api';
import { cartApi } from '@/features/cart/api/api';
import { Button } from '@/shared/components/ui/Button';
import { useAuthStore } from '@/features/auth/store';
import { getImageUrl } from '@/shared/lib/imageUrl';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(Number(id)),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem({ productId: Number(id), quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Produto adicionado ao carrinho!');
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Sua sessão expirou. Faça login novamente.');
        navigate('/login');
      } else {
        toast.error('Erro ao adicionar ao carrinho. Verifique o estoque.');
      }
    }
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para comprar!');
      navigate('/login');
      return;
    }
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-xl bg-red-50 p-8 text-center text-red-600 border border-red-100">
        <h2 className="text-lg font-bold mb-2">Produto não encontrado</h2>
        <p className="text-sm">O link pode estar quebrado ou o produto foi removido.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-2 text-sm font-bold text-white hover:bg-red-700">
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Início</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Produtos</Link>
        <span>/</span>
        <span className="font-medium text-slate-900 line-clamp-1">{product.name}</span>
      </nav>
      
      {/* Card Principal do Produto */}
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm md:grid-cols-2">
        
        {/* Imagem — CORRIGIDA com getImageUrl */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-4">
          {product.imageUrl ? (
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="h-full w-full rounded-xl object-contain mix-blend-multiply"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-8xl opacity-40">📦</span>
          )}
        </div>

        {/* Informações e Compra */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="mt-4 text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
            
            <div className="mt-4 flex items-center gap-2 text-orange-400">
              {'★'.repeat(5)}
              <span className="text-sm text-slate-400 ml-1">(42 avaliações)</span>
            </div>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Este é um excelente produto da categoria {product.category}. 
              Adquira já o seu e aproveite a entrega rápida para todo o Brasil.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-slate-900">{formattedPrice}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-green-600">
              12x de {(Number(product.price) / 12).toFixed(2).replace('.', ',')} sem juros
            </p>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              {product.stock > 0 ? `${product.stock} unidades em estoque` : 'Produto esgotado'}
            </div>

            <div className="mt-8">
              <Button 
                className="w-full !py-4 !text-base !bg-orange-500 hover:!bg-orange-600" 
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
              >
                {addToCartMutation.isPending ? 'Adicionando...' : product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1">🔒 Compra Segura</span>
                <span className="flex items-center gap-1">🚚 Frete Rápido</span>
                <span className="flex items-center gap-1">↩️ Troca Grátis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}