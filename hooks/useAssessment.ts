import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentService } from '@/services/assessment.service';
import { CreateAssessmentInput, AssessmentStatus } from '@/types/assessment';

export function useAssessments(status?: string) {
  return useQuery({
    queryKey: ['assessments', status],
    queryFn: () => assessmentService.getAllAssessments(status),
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getAssessmentById(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssessmentInput) => assessmentService.createAssessment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}

export function useUpdateAssessmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: AssessmentStatus;
      remarks?: string;
    }) => assessmentService.updateAssessmentStatus(id, status, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.id] });
    },
  });
}
