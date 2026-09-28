import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/document.service';
import { DocumentStatus, UploadDocumentPayload } from '@/types/document';
import { useToast } from '@/providers/ToastProvider';

export function useDocuments(params?: { customerId?: string; status?: string; type?: string }) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.getDocuments(params),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentService.uploadDocument(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['customer-documents', data.customerId] });
      toast.success('File Uploaded', `${data.title} (${data.fileName}) uploaded successfully`);
    },
    onError: (err: any) => {
      toast.error('Upload Failed', err.message || 'File upload failed');
    },
  });
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: DocumentStatus; rejectionReason?: string }) =>
      documentService.updateDocumentStatus(id, status, rejectionReason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['customer-documents', data.customerId] });
      toast.success('Document Status Updated', `Document marked as ${data.status}`);
    },
    onError: (err: any) => {
      toast.error('Status Update Failed', err.message || 'Could not update document status');
    },
  });
}
