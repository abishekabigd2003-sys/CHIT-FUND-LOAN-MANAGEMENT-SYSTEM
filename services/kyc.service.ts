import { KycProfile, KycDocument } from '@/types/kyc';
import { mockKycProfiles } from './mock-data/kyc';

let kycProfilesStore: KycProfile[] = [...mockKycProfiles];

export const kycService = {
  async getAllProfiles(status?: string): Promise<KycProfile[]> {
    if (!status || status === 'ALL') return kycProfilesStore;
    return kycProfilesStore.filter((p) => p.status === status);
  },

  async getProfileByCustomerId(customerId: string): Promise<KycProfile | null> {
    return kycProfilesStore.find((p) => p.customerId === customerId) || null;
  },

  async verifyDocument(
    customerId: string,
    documentId: string,
    action: 'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION',
    remarks: string
  ): Promise<KycProfile> {
    const idx = kycProfilesStore.findIndex((p) => p.customerId === customerId);
    if (idx === -1) throw new Error('KYC profile not found');

    const profile = kycProfilesStore[idx];
    const docIdx = profile.documents.findIndex((d) => d.id === documentId);
    if (docIdx === -1) throw new Error('Document not found');

    const updatedDoc: KycDocument = {
      ...profile.documents[docIdx],
      status: action === 'APPROVE' ? 'VERIFIED' : 'REJECTED',
      rejectionReason: action !== 'APPROVE' ? remarks : undefined,
      verifiedBy: 'Karthik Raman (Compliance Officer)',
      verifiedAt: new Date().toISOString(),
    };

    const updatedDocuments = [...profile.documents];
    updatedDocuments[docIdx] = updatedDoc;

    const allVerified = updatedDocuments.every((d) => d.status === 'VERIFIED');
    const hasRejected = updatedDocuments.some((d) => d.status === 'REJECTED');

    kycProfilesStore[idx] = {
      ...profile,
      documents: updatedDocuments,
      status: allVerified
        ? 'VERIFIED'
        : hasRejected
        ? action === 'REQUEST_RESUBMISSION'
          ? 'REQUIRES_RESUBMISSION'
          : 'REJECTED'
        : 'UNDER_REVIEW',
      reviewerRemarks: remarks,
      verifiedAt: allVerified ? new Date().toISOString() : profile.verifiedAt,
      verifiedBy: allVerified ? 'Karthik Raman' : profile.verifiedBy,
    };

    return kycProfilesStore[idx];
  },
};
