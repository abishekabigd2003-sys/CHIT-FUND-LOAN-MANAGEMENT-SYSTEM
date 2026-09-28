import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chitService } from '@/services/chit.service';
import { CreateChitSchemeInput } from '@/types/chit';
import { useToast } from '@/providers/ToastProvider';

export function useChits(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['chits', params],
    queryFn: () => chitService.getChits(params),
  });
}

export function useChit(id: string) {
  return useQuery({
    queryKey: ['chit', id],
    queryFn: () => chitService.getChitById(id),
    enabled: !!id,
  });
}

export function useCreateChit() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (input: CreateChitSchemeInput) => chitService.createChit(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chits'] });
      toast.success('Chit Scheme Created', `Scheme ${data.schemeName} (${data.schemeCode}) initialized`);
    },
    onError: (err: any) => {
      toast.error('Creation Failed', err.message || 'Could not create chit scheme');
    },
  });
}

export function useAddChitMember() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      chitId,
      customerId,
      customerName,
      customerCode,
    }: {
      chitId: string;
      customerId: string;
      customerName: string;
      customerCode: string;
    }) => chitService.addMember(chitId, customerId, customerName, customerCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chit', variables.chitId] });
      queryClient.invalidateQueries({ queryKey: ['chits'] });
      toast.success('Member Enrolled', `${variables.customerName} enrolled into scheme`);
    },
    onError: (err: any) => {
      toast.error('Enrollment Failed', err.message || 'Could not enroll member');
    },
  });
}
