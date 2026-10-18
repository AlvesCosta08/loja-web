import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/api';
import type { PaymentStatus } from '@/shared/types/api';

export function computeRefetchInterval(status: PaymentStatus | undefined): number | false {
  if (status === 'CONFIRMED') return false;
  return 3000;
}

export function usePaymentPolling(paymentId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentApi.getPayment(paymentId as number),
    enabled: enabled && paymentId !== null,
    refetchInterval: (query) => computeRefetchInterval(query.state.data?.status),
  });
}