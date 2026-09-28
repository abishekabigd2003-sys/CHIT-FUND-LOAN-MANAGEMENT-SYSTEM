import apiClient from '@/lib/axios';
import { DocumentItem, DocumentStatus, UploadDocumentPayload } from '@/types/document';
import { mockDocuments } from './mock-data/documents';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryDocuments = [...mockDocuments];

export const documentService = {
  async getDocuments(params?: { customerId?: string; status?: string; type?: string }): Promise<DocumentItem[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: DocumentItem[] }>('/documents', { params });
      return response.data.data;
    }
    let result = [...inMemoryDocuments];

    if (params?.customerId) {
      result = result.filter((d) => d.customerId === params.customerId);
    }
    if (params?.status && params.status !== 'ALL') {
      result = result.filter((d) => d.status === params.status);
    }
    if (params?.type && params.type !== 'ALL') {
      result = result.filter((d) => d.type === params.type);
    }

    return result;
  },

  async uploadDocument(payload: UploadDocumentPayload): Promise<DocumentItem> {
    if (!USE_MOCK) {
      const formData = new FormData();
      formData.append('customerId', payload.customerId);
      formData.append('type', payload.type);
      formData.append('title', payload.title);
      formData.append('file', payload.file);
      if (payload.relatedEntityType) formData.append('relatedEntityType', payload.relatedEntityType);
      if (payload.relatedEntityId) formData.append('relatedEntityId', payload.relatedEntityId);

      const response = await apiClient.post<{ success: boolean; data: DocumentItem }>('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      customerId: payload.customerId,
      customerName: "Customer File",
      type: payload.type,
      title: payload.title,
      fileName: payload.file.name,
      fileSize: payload.file.size,
      mimeType: payload.file.type || 'application/octet-stream',
      fileUrl: URL.createObjectURL(payload.file),
      status: 'PENDING',
      uploadedAt: new Date().toISOString(),
    };

    inMemoryDocuments.unshift(newDoc);
    return newDoc;
  },

  async updateDocumentStatus(id: string, status: DocumentStatus, rejectionReason?: string): Promise<DocumentItem> {
    if (!USE_MOCK) {
      const response = await apiClient.patch<{ success: boolean; data: DocumentItem }>(`/documents/${id}/status`, {
        status,
        rejectionReason,
      });
      return response.data.data;
    }
    const idx = inMemoryDocuments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');

    const updated: DocumentItem = {
      ...inMemoryDocuments[idx],
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
      verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : undefined,
      verifiedBy: status === 'VERIFIED' ? 'Verified Staff' : undefined,
    };

    inMemoryDocuments[idx] = updated;
    return updated;
  },

  async deleteDocument(id: string): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.delete(`/documents/${id}`);
      return;
    }
    inMemoryDocuments = inMemoryDocuments.filter((d) => d.id !== id);
  },
};
