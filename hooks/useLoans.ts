import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanService } from '@/services/loan.service';
import { CreateLoanInput, LoanType, LoanStatus } from '@/types/loan';
import { useToast } from '@/providers/ToastProvider';

export function useLoans(params?: { type?: LoanType | 'ALL'; status?: LoanStatus | 'ALL'; search?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['loans', params],
    queryFn: () => loanService.getLoans(params),
  });
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: ['loan', id],
    queryFn: () => loanService.getLoanById(id),
    enabled: !!id,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ input, customerName, customerPhone }: { input: CreateLoanInput; customerName: string; customerPhone?: string }) =>
      loanService.createLoan(input, customerName, customerPhone),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Loan Created', `Application ${data.loanCode} for ${data.customerName} submitted successfully`);
    },
    onError: (err: any) => {
      toast.error('Loan Creation Failed', err.message || 'Could not process loan');
    },
  });
}

export function useUpdateLoanStatus() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LoanStatus }) => loanService.updateLoanStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loan', data.id] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Status Updated', `Loan ${data.loanCode} status updated to ${data.status}`);
    },
    onError: (err: any) => {
      toast.error('Update Failed', err.message || 'Could not update loan status');
    },
  });
}
