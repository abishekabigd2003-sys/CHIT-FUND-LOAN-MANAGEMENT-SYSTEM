import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { RecordPaymentPayload } from '@/types/payment';
import { PaymentStatus } from '@/types/loan';
import { useToast } from '@/providers/ToastProvider';

export function usePayments(params?: {
  status?: PaymentStatus | 'ALL';
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentService.getPayments(params),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => paymentService.recordPayment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['chits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Payment Recorded', `Receipt #${data.receiptNumber} issued for ₹${data.amountPaid.toLocaleString('en-IN')}`);
    },
    onError: (err: any) => {
      toast.error('Payment Failed', err.message || 'Could not record transaction');
    },
  });
}
