import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { cartApi } from '@/features/cart/api/api';
import { shippingApi } from '@/features/shipping/api/api';
import { orderApi } from '@/features/orders/api/api';
import { Button } from '@/shared/components/ui/Button';
import type { ShippingOption } from '@/shared/types/api';

export function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cep, setCep] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // 1. Busca o carrinho
  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  });

  // 2. Mutation para calcular o frete
  const quoteMutation = useMutation({
    mutationFn: (searchCep: string) => shippingApi.quote({ cep: searchCep, subtotal: cart?.total || 0 }),
    onSuccess: (data) => {
      if (data.options && data.options.length > 0) {
        const firstOption = data.options[0];
        const displayCost = firstOption.cost ?? (firstOption as any).price ?? (firstOption as any).value ?? 0;
        // Se não houver dias, define como undefined
        const displayDays = firstOption.deliveryDays ?? (firstOption as any).estimatedDays ?? undefined;
        
        setSelectedShipping({
          ...firstOption,
          cost: displayCost,
          deliveryDays: displayDays ? Number(displayDays) : undefined
        } as ShippingOption);
      } else {
        toast.error('Nenhuma opção de frete disponível para este CEP.');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Erro ao calcular o frete.');
    },
  });

  // 3. Mutation para criar o pedido
  const orderMutation = useMutation({
    mutationFn: () => orderApi.createOrder(cep),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Pedido realizado com sucesso!');
      navigate('/');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Erro ao criar o pedido.');
    },
  });

  if (isCartLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center mt-10">Seu carrinho está vazio. Volte ao catálogo.</div>;
  }

  const totalWithShipping = cart.total + (selectedShipping?.cost || 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800">Finalizar Compra</h1>

      {/* Resumo do Carrinho */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumo do Pedido</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 text-sm text-gray-600">
            <span>{item.quantity}x {item.productName}</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-bold text-gray-800">
          <span>Subtotal</span>
          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.total)}</span>
        </div>
      </div>

      {/* Frete */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Calcular Frete</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite seu CEP (ex: 01001000)"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          <Button
            onClick={() => quoteMutation.mutate(cep)}
            disabled={quoteMutation.isPending || cep.length < 8}
          >
            {quoteMutation.isPending ? 'Calculando...' : 'Calcular'}
          </Button>
        </div>

        {quoteMutation.data?.options && (
          <div className="mt-4 space-y-2">
            {quoteMutation.data.options.map((option) => {
              const displayCost = option.cost ?? (option as any).price ?? (option as any).value ?? 0;
              const displayDays = option.deliveryDays ?? (option as any).estimatedDays ?? (option as any).days ?? null;
              const displayName = option.name || option.type;

              return (
                <label key={option.type} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping?.type === option.type}
                      onChange={() => {
                        setSelectedShipping({
                          ...option,
                          cost: displayCost,
                          deliveryDays: displayDays ? Number(displayDays) : undefined
                        } as ShippingOption);
                      }}
                      className="h-4 w-4 text-brand-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{displayName}</p>
                      {/* Renderiza os dias apenas se existir */}
                      {displayDays && (
                        <p className="text-xs text-gray-500">Até {displayDays} dias úteis</p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayCost)}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Total e Finalizar */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total com frete</span>
          <span className="text-brand-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalWithShipping)}
          </span>
        </div>
        <Button
          className="mt-6 w-full py-3 text-lg"
          onClick={() => orderMutation.mutate()}
          disabled={orderMutation.isPending || !selectedShipping}
        >
          {orderMutation.isPending ? 'Processando...' : 'Confirmar Pedido'}
        </Button>
      </div>
    </div>
  );
}