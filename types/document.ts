export type DocumentType = 
  | 'IDENTITY_PROOF' 
  | 'ADDRESS_PROOF' 
  | 'PHOTO' 
  | 'SIGNATURE' 
  | 'INCOME_PROOF' 
  | 'COLLATERAL_DOCUMENT' 
  | 'OTHER';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface DocumentItem {
  id: string;
  customerId: string;
  customerName?: string;
  type: DocumentType;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  relatedEntity?: {
    entityType: 'CUSTOMER' | 'LOAN' | 'CHIT';
    entityId: string;
  };
}

export interface UploadDocumentPayload {
  customerId: string;
  type: DocumentType;
  title: string;
  file: File;
  relatedEntityType?: 'CUSTOMER' | 'LOAN' | 'CHIT';
  relatedEntityId?: string;
}
