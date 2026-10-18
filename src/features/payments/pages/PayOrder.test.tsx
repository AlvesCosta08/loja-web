import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { PayOrder } from './PayOrder';
import { orderApi } from '@/features/orders/api/api';
import { paymentApi } from '../api/api';
import type { OrderResponse, PaymentResponse } from '@/shared/types/api';

vi.mock('@/features/orders/api/api', () => ({ orderApi: { getOrder: vi.fn() } }));
vi.mock('../api/api', () => ({
  paymentApi: {
    createPixPayment: vi.fn(),
    createCardPayment: vi.fn(),
    getPayment: vi.fn(),
    getLatestByOrder: vi.fn(),
  },
}));

const order = (s: OrderResponse['status'] = 'PENDING'): OrderResponse => ({
  id: 42, userId: 1, status: s, total: 179.8, discount: 0, shippingCost: 20,
  couponCode: null, createdAt: '2025-01-15T10:00:00Z', items: [],
});

const payment = (s: PaymentResponse['status'] = 'PENDING', m: PaymentResponse['method'] = 'PIX'): PaymentResponse => ({
  id: 1, orderId: 42, method: m, status: s, amount: 179.8,
  pixCopyPaste: '00020126...', pixQrCodeBase64: 'iVBORw0...',
  gatewayRef: null, clientSecret: null,
  createdAt: '2025-01-15T10:01:00Z', expiresAt: null, confirmedAt: null,
});

const renderPage = () =>
  renderWithProviders(<PayOrder />, { route: '/orders/42/pay', path: '/orders/:id/pay' });

describe('PayOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra tabs quando order PENDING sem payment existente', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order());
    vi.mocked(paymentApi.getLatestByOrder).mockRejectedValueOnce(new Error('404'));
    renderPage();
    
    await waitFor(() => expect(screen.getByText(/pagar pedido #42/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /^pix$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cartão/i })).toBeInTheDocument();
  });

  it('gera Pix → mostra QR + código', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order());
    vi.mocked(paymentApi.getLatestByOrder).mockRejectedValueOnce(new Error('404'));
    vi.mocked(paymentApi.createPixPayment).mockResolvedValueOnce(payment());
    vi.mocked(paymentApi.getPayment).mockResolvedValue(payment());

    const user = userEvent.setup();
    renderPage();
    
    const btn = await screen.findByRole('button', { name: /gerar qr code pix/i });
    await user.click(btn);

    expect(paymentApi.createPixPayment).toHaveBeenCalledWith(42);
    expect(await screen.findByAltText(/qr code pix/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('00020126...')).toBeInTheDocument();
  });

  it('F5-safe: usa payment existente do backend ao invés de criar novo', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order());
    vi.mocked(paymentApi.getLatestByOrder).mockResolvedValueOnce(payment());
    renderPage();

    await waitFor(() => expect(screen.getByAltText(/qr code pix/i)).toBeInTheDocument());
    expect(paymentApi.createPixPayment).not.toHaveBeenCalled();
  });

  it('quando order já PAID mostra mensagem de sucesso', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order('PAID'));
    vi.mocked(paymentApi.getLatestByOrder).mockRejectedValueOnce(new Error('404'));
    renderPage();
    expect(await screen.findByText(/já foi pago/i)).toBeInTheDocument();
  });

  it('quando payment já CONFIRMED mostra sucesso', async () => {
    vi.mocked(orderApi.getOrder).mockResolvedValueOnce(order('PAID'));
    vi.mocked(paymentApi.getLatestByOrder).mockResolvedValueOnce(payment('CONFIRMED'));
    renderPage();
    expect(await screen.findByText(/pagamento confirmado/i)).toBeInTheDocument();
  });
});