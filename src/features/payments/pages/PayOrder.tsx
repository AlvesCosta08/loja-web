import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { orderApi } from '@/features/orders/api/api';
import { paymentApi } from '../api/api';
import { usePaymentPolling } from '../hooks/usePaymentPolling';
import { Button } from '@/shared/components/ui/Button';
import type { PaymentResponse } from '@/shared/types/api';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
type Tab = 'PIX' | 'CREDIT_CARD';

export function PayOrder() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [tab, setTab] = useState<Tab>('PIX');
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading: loadingOrder } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrder(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  // F5-safe: busca pagamento existente. 404 é esperado quando não há.
  const { data: existingPayment } = useQuery({
    queryKey: ['paymentByOrder', orderId],
    queryFn: () => paymentApi.getLatestByOrder(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
    retry: false,
  });

  // Fonte única da verdade: payment vem do backend (existing ou criado por mutation)
  const [createdPayment, setCreatedPayment] = useState<PaymentResponse | null>(null);
  const payment = createdPayment ?? existingPayment ?? null;

  const pollingEnabled = payment?.status === 'PENDING';
  const { data: polled } = usePaymentPolling(payment?.id ?? null, pollingEnabled);

  useEffect(() => {
    if (polled?.status === 'CONFIRMED' && payment?.status === 'PENDING') {
      setCreatedPayment(polled);
      toast.success('Pagamento confirmado!');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    }
  }, [polled, payment?.status, queryClient, orderId]);

  const pixMutation = useMutation({
    mutationFn: () => paymentApi.createPixPayment(orderId),
    onSuccess: (p) => { setCreatedPayment(p); toast.info('Pix gerado!'); },
    onError: (e: AxiosError<{ message: string }>) =>
      toast.error(e.response?.data?.message || 'Erro ao gerar Pix.'),
  });

  const cardMutation = useMutation({
    mutationFn: () => paymentApi.createCardPayment(orderId),
    onSuccess: (p) => { setCreatedPayment(p); toast.info('Pagamento em processamento.'); },
    onError: (e: AxiosError<{ message: string }>) =>
      toast.error(e.response?.data?.message || 'Erro no cartão.'),
  });

  const copyPix = async () => {
    if (!payment?.pixCopyPaste) return;
    await navigator.clipboard.writeText(payment.pixCopyPaste);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingOrder) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-red-50 p-6 text-center text-red-700">
        Pedido não encontrado.
      </div>
    );
  }

  // 1º: Se já existe pagamento (ex: F5-safe ou confirmado), mostra a tela de pagamento
  if (payment) {
    return (
      <div className="mx-auto mt-6 max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Pagamento do pedido #{order.id}</h1>
          <span className="text-lg font-semibold text-brand-700">{brl.format(Number(payment.amount))}</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {payment.method === 'PIX' && (
            <div className="space-y-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">Escaneie o QR Code</h2>
              {payment.pixQrCodeBase64 ? (
                <div className="flex justify-center">
                  <img src={`data:image/png;base64,${payment.pixQrCodeBase64}`}
                       alt="QR Code Pix"
                       className="h-56 w-56 rounded-lg border border-gray-200 bg-white p-2" />
                </div>
              ) : <p className="text-sm text-gray-500">QR Code não disponível.</p>}

              {payment.pixCopyPaste && (
                <>
                  <p className="text-xs font-medium uppercase text-gray-500">Ou copie o código:</p>
                  <textarea readOnly value={payment.pixCopyPaste}
                            className="h-20 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs" />
                  <Button variant="secondary" onClick={copyPix} className="w-full">
                    {copied ? 'Copiado ✓' : 'Copiar código Pix'}
                  </Button>
                </>
              )}
            </div>
          )}

          {payment.method === 'CREDIT_CARD' && (
            <div className="space-y-3 text-center">
              <h2 className="text-lg font-semibold text-gray-800">Cartão de crédito</h2>
              <p className="text-sm text-gray-600">
                Referência: <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">{payment.gatewayRef ?? '—'}</code>
              </p>
              <p className="text-xs text-gray-500">(gateway mockado)</p>
            </div>
          )}

          {payment.status === 'PENDING' && (
            <div className="mt-6 flex items-center gap-2 text-sm text-yellow-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              Aguardando confirmação... <span className="text-xs text-gray-500">(atualiza a cada 3s)</span>
            </div>
          )}

          {payment.status === 'CONFIRMED' && (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
              <p className="font-semibold text-green-800">Pagamento confirmado! 🎉</p>
              <Button className="mt-4" onClick={() => navigate(`/orders/${order.id}`)}>Ver meu pedido</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2º: Se não tem pagamento, mas o pedido já está pago (fallback de segurança)
  if (order.status === 'PAID' || order.status === 'SHIPPED') {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-xl font-bold text-green-800">Este pedido já foi pago ✅</h2>
        <Link to="/orders" className="mt-6 inline-block"><Button>Ver meus pedidos</Button></Link>
      </div>
    );
  }

  // 3º: Fluxo normal (escolher e gerar)
  return (
    <div className="mx-auto mt-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pagar pedido #{order.id}</h1>
        <p className="text-sm text-gray-500">Total: <strong>{brl.format(Number(order.total))}</strong></p>
      </div>

      <div className="flex gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        {(['PIX', 'CREDIT_CARD'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === t ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            {t === 'PIX' ? 'Pix' : 'Cartão de Crédito'}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {tab === 'PIX' ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">Clique para gerar QR Code Pix.</p>
            <Button className="w-full py-3" onClick={() => pixMutation.mutate()}
              disabled={pixMutation.isPending}>
              {pixMutation.isPending ? 'Gerando...' : 'Gerar QR Code Pix'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Processar pagamento no cartão (mock).</p>
            <Button className="w-full py-3" onClick={() => cardMutation.mutate()}
              disabled={cardMutation.isPending}>
              {cardMutation.isPending ? 'Processando...' : 'Pagar com cartão'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}