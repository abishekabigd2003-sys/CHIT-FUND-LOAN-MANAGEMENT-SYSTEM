import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kycService } from '@/services/kyc.service';

export function useKycProfiles(status?: string) {
  return useQuery({
    queryKey: ['kyc-profiles', status],
    queryFn: () => kycService.getAllProfiles(status),
  });
}

export function useKycProfile(customerId: string) {
  return useQuery({
    queryKey: ['kyc-profile', customerId],
    queryFn: () => kycService.getProfileByCustomerId(customerId),
    enabled: !!customerId,
  });
}

export function useVerifyKycDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      documentId,
      action,
      remarks,
    }: {
      customerId: string;
      documentId: string;
      action: 'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION';
      remarks: string;
    }) => kycService.verifyDocument(customerId, documentId, action, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kyc-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-profile', variables.customerId] });
    },
  });
}
