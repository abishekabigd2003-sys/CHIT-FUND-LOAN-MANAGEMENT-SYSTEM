export type CustomerStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED';

export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

export interface CustomerKyc {
  aadharNumber: string;
  panNumber: string;
  occupation: string;
  annualIncome: number;
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
  verifiedAt?: string;
}

export interface Customer {
  id: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  status: CustomerStatus;
  avatarUrl?: string;
  address: CustomerAddress;
  kyc: CustomerKyc;
  stats?: {
    activeChits: number;
    activeLoans: number;
    totalInvested: number;
    totalLoanOutstanding: number;
    completedChits: number;
    creditScore?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  aadharNumber: string;
  panNumber: string;
  occupation: string;
  annualIncome: number;
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
}
