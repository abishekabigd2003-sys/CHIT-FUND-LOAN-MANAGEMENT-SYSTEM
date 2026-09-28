export type KycStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REQUIRES_RESUBMISSION';

export type KycDocumentType =
  | 'AADHAAR'
  | 'PAN'
  | 'PASSPORT'
  | 'VOTER_ID'
  | 'DRIVING_LICENSE'
  | 'ADDRESS_PROOF'
  | 'BANK_STATEMENT'
  | 'SALARY_SLIP'
  | 'PHOTO'
  | 'SIGNATURE'
  | 'INCOME_PROOF';

export interface KycDocument {
  id: string;
  customerId: string;
  type: KycDocumentType;
  title: string;
  documentNumber?: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

export interface KycProfile {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: KycStatus;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  identityStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  addressStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  incomeStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  documents: KycDocument[];
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  reviewerRemarks?: string;
}
