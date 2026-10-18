// src/features/home/pages/Home.tsx
import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/Button';
import { productApi } from '@/features/products/api/api';
import { getImageUrl } from '@/shared/lib/imageUrl';

export function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.list({ page: 0, size: 4 }),
  });

  const featuredProducts = productsData?.content || [];

  const slides = [
    {
      id: 1,
      badge: 'Nova Coleção',
      title: 'Eleve suas compras ao próximo nível.',
      desc: 'Produtos selecionados, pagamento seguro via Pix e entrega ultrarrápida.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      badge: 'Tech Week',
      title: 'Tecnologia que transforma.',
      desc: 'Os melhores gadgets com até 30% de desconto. Aproveite enquanto durar o estoque.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      badge: 'Casa & Estilo',
      title: 'Renove o seu ambiente.',
      desc: 'Frete grátis para todo o Brasil em compras acima de R$ 150.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
    }
  ];

  return (
    <div className="flex flex-col pb-20">
      
      {/* 1. CARROSSEL FULL WIDTH */}
      <section className="relative w-full overflow-hidden bg-slate-900 h-[350px] md:h-[450px]">
        <div className="embla h-full w-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {slides.map((slide) => (
              <div key={slide.id} className="relative min-w-0 flex-[0_0_100%] h-full">
                <img src={slide.image} alt="Banner" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

                <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 ring-1 ring-blue-400/30">
                      {slide.badge}
                    </span>
                    <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-lg text-base text-slate-300 md:text-lg">
                      {slide.desc}
                    </p>
                    <div className="flex gap-4 pt-2">
                      <Link to="/products">
                        <Button className="!px-6 !py-3 !text-sm md:!px-8 md:!py-4 md:!text-base">Explorar Produtos</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:flex z-10" aria-label="Anterior">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:flex z-10" aria-label="Próximo">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </section>

      {/* 2. RESTO DA HOME */}
      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        
        {/* CATEGORIAS */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Navegue por Categorias</h2>
              <p className="mt-2 text-slate-500">Encontre exatamente o que você precisa.</p>
            </div>
            <Link to="/products" className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 sm:block">Ver todas →</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'Eletrônicos', emoji: '💻', color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
              { name: 'Roupas', emoji: '👕', color: 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' },
              { name: 'Acessórios', emoji: '⌚', color: 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' },
              { name: 'Casa', emoji: '🏠', color: 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' },
            ].map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`} className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-colors ${cat.color}`}>
                  {cat.emoji}
                </div>
                <span className="text-base font-bold text-slate-800">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUTOS EM DESTAQUE */}
        <section>
          <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900">Destaques da Loja</h2>
            <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700">Ver todos os produtos →</Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                  <div className="aspect-square rounded-lg bg-slate-200 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
                  <div className="relative aspect-square bg-slate-100 flex items-center justify-center p-4">
                    {/* 👇 CORRIGIDO: getImageUrl em vez de product.imageUrl direto */}
                    {product.imageUrl ? (
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="h-full w-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-6xl opacity-40">📦</span>
                    )}
                    <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Oferta</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-medium text-slate-700 line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto pt-4">
                      <p className="text-xl font-black text-slate-900">
                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-xs font-medium text-green-600 mb-4">
                        12x de R$ {(Number(product.price) / 12).toFixed(2).replace('.', ',')} sem juros
                      </p>
                      
                      <Link to={`/products/${product.id}`} className="block">
                        <Button className="w-full !py-2.5">Ver Produto</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 border border-dashed rounded-xl">
              Nenhum produto cadastrado ainda. Vá no Painel Admin e crie um produto!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}