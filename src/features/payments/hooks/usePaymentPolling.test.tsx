import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { usePaymentPolling } from './usePaymentPolling';
import { paymentApi } from '../api/api';
import type { PaymentResponse } from '@/shared/types/api';

vi.mock('../api/api', () => ({ paymentApi: { getPayment: vi.fn() } }));

const fake = (status: PaymentResponse['status']): PaymentResponse => ({
  id: 1, orderId: 1, method: 'PIX', status, amount: 100,
  pixCopyPaste: null, pixQrCodeBase64: null,
  gatewayRef: null, clientSecret: null,
  createdAt: '2025-01-01T00:00:00Z', expiresAt: null, confirmedAt: null,
});

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('usePaymentPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('não busca quando enabled=false ou id=null', () => {
    renderHook(() => usePaymentPolling(1, false), { wrapper });
    renderHook(() => usePaymentPolling(null, true), { wrapper });
    expect(paymentApi.getPayment).not.toHaveBeenCalled();
  });

  it('faz polling contínuo enquanto PENDING', async () => {
    vi.mocked(paymentApi.getPayment).mockResolvedValue(fake('PENDING'));
    renderHook(() => usePaymentPolling(1, true), { wrapper });

    // Aguarda o React Query processar a chamada inicial
    await vi.waitFor(() => expect(paymentApi.getPayment).toHaveBeenCalledTimes(1));
    
    // Avança o tempo para disparar o refetchInterval de 3000ms
    await vi.advanceTimersByTimeAsync(3000);
    
    // Aguarda o React Query processar a segunda chamada
    await vi.waitFor(() => expect(paymentApi.getPayment).toHaveBeenCalledTimes(2));
  });

  it('para de fazer polling quando CONFIRMED', async () => {
    vi.mocked(paymentApi.getPayment).mockResolvedValueOnce(fake('CONFIRMED'));
    renderHook(() => usePaymentPolling(1, true), { wrapper });

    await vi.waitFor(() => expect(paymentApi.getPayment).toHaveBeenCalledTimes(1));
    
    // Avança 10 segundos (bem mais que o intervalo de 3s). Como o status é CONFIRMED,
    // o hook deve retornar false e não fazer novas chamadas.
    await vi.advanceTimersByTimeAsync(10000);
    
    expect(paymentApi.getPayment).toHaveBeenCalledTimes(1);
  });
});