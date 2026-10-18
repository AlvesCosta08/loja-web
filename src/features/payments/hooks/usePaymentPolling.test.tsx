import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('não busca quando enabled=false ou id=null', () => {
    act(() => {
      renderHook(() => usePaymentPolling(1, false), { wrapper });
      renderHook(() => usePaymentPolling(null, true), { wrapper });
    });

    expect(paymentApi.getPayment).not.toHaveBeenCalled();
  });

  it('faz polling contínuo enquanto PENDING', async () => {
    vi.mocked(paymentApi.getPayment).mockResolvedValue(fake('PENDING'));

    const { result } = await act(async () =>
      renderHook(() => usePaymentPolling(1, true), { wrapper })
    );

    // 👇 act + vi.waitFor: embrulha o setState E espera a cadeia de microtasks
    await act(async () => {
      await vi.waitFor(() => expect(result.current.data?.status).toBe('PENDING'));
    });

    expect(paymentApi.getPayment).toHaveBeenCalledTimes(1);

    // avança 3s e espera o refetch dentro de act
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
      await vi.waitFor(() => expect(paymentApi.getPayment).toHaveBeenCalledTimes(2));
      await vi.waitFor(() => expect(result.current.data?.status).toBe('PENDING'));
    });
  });

  it('para de fazer polling quando CONFIRMED', async () => {
    vi.mocked(paymentApi.getPayment).mockResolvedValueOnce(fake('CONFIRMED'));

    const { result } = await act(async () =>
      renderHook(() => usePaymentPolling(1, true), { wrapper })
    );

    await act(async () => {
      await vi.waitFor(() => expect(result.current.data?.status).toBe('CONFIRMED'));
    });

    expect(paymentApi.getPayment).toHaveBeenCalledTimes(1);

    // avança 10s — não deve refazer chamada porque CONFIRMED para o polling
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(paymentApi.getPayment).toHaveBeenCalledTimes(1);
  });
});