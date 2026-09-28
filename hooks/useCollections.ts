import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '@/services/collection.service';
import {
  CreateCollectionTaskInput,
  AddCollectionRemarkInput,
} from '@/types/collection';

export function useCollectionTasks(params?: {
  staffId?: string;
  status?: string;
  priority?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['collection-tasks', params],
    queryFn: () => collectionService.getAllTasks(params),
  });
}

export function useMyTasks(staffId: string) {
  return useQuery({
    queryKey: ['collection-tasks-my', staffId],
    queryFn: () => collectionService.getMyTasks(staffId),
    enabled: !!staffId,
  });
}

export function useCollectionTask(id: string) {
  return useQuery({
    queryKey: ['collection-task', id],
    queryFn: () => collectionService.getTaskById(id),
    enabled: !!id,
  });
}

export function useCollectionMetrics() {
  return useQuery({
    queryKey: ['collection-metrics'],
    queryFn: () => collectionService.getCollectionMetrics(),
  });
}

export function useAddCollectionRemark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCollectionRemarkInput) => collectionService.addRemark(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['collection-tasks-my'] });
      queryClient.invalidateQueries({ queryKey: ['collection-task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['collection-metrics'] });
    },
  });
}

export function useCreateCollectionTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCollectionTaskInput) => collectionService.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['collection-metrics'] });
    },
  });
}

export function useEscalateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      stage,
      notes,
    }: {
      taskId: string;
      stage: 'MID' | 'LEGAL' | 'SETTLEMENT';
      notes: string;
    }) => collectionService.escalateTask(taskId, stage, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['collection-task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['collection-metrics'] });
    },
  });
}
