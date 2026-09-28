import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalService } from '@/services/approval.service';
import { ApprovalDecisionInput } from '@/types/approval';

export function useApprovals(status?: string) {
  return useQuery({
    queryKey: ['approvals', status],
    queryFn: () => approvalService.getAllApprovals(status),
  });
}

export function useApproval(id: string) {
  return useQuery({
    queryKey: ['approval', id],
    queryFn: () => approvalService.getApprovalById(id),
    enabled: !!id,
  });
}

export function useSubmitApprovalDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApprovalDecisionInput) => approvalService.submitDecision(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}
