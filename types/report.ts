export type ReportType = 
  | 'COLLECTION' 
  | 'DUE' 
  | 'CUSTOMER' 
  | 'CHIT_PERFORMANCE' 
  | 'LOAN_PERFORMANCE' 
  | 'OUTSTANDING';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  loanType?: string;
  chitId?: string;
  status?: string;
  branch?: string;
  search?: string;
}

export interface CollectionReportRow {
  id: string;
  receiptNumber: string;
  date: string;
  customerName: string;
  customerCode: string;
  accountType: 'LOAN' | 'CHIT';
  referenceCode: string;
  amount: number;
  paymentMode: string;
  collectedBy: string;
}

export interface DueReportRow {
  id: string;
  customerName: string;
  customerCode: string;
  phone: string;
  accountType: 'LOAN' | 'CHIT';
  referenceCode: string;
  installmentNo: number;
  dueDate: string;
  amountDue: number;
  overdueDays: number;
  status: 'PENDING' | 'OVERDUE';
}

export interface CustomerReportRow {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  city: string;
  status: string;
  joinedDate: string;
  activeChits: number;
  activeLoans: number;
  totalPaid: number;
  outstandingBalance: number;
}

export interface ChitPerformanceRow {
  id: string;
  schemeCode: string;
  schemeName: string;
  totalValue: number;
  durationMonths: number;
  currentMonth: number;
  membersCount: number;
  totalCollected: number;
  totalExpected: number;
  collectionRate: number;
  status: string;
}

export interface LoanPerformanceRow {
  id: string;
  loanCode: string;
  customerName: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  disbursedDate: string;
  totalCollected: number;
  outstandingAmount: number;
  overdueInstallments: number;
  status: string;
}
