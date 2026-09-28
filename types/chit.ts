export type ChitStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ChitMemberSubscription {
  id: string;
  chitId: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  ticketNumber: number;
  joinedAt: string;
  totalPaid: number;
  totalDue: number;
  isPrized: boolean;
  prizedMonth?: number;
  prizedAmount?: number;
  dividendEarned: number;
  status: 'ACTIVE' | 'DEFAULTED' | 'SETTLED';
}

export interface ChitAuctionRecord {
  id: string;
  chitId: string;
  monthNumber: number;
  auctionDate: string;
  winnerCustomerId?: string;
  winnerCustomerName?: string;
  winningBidAmount: number;
  dividendPerMember: number;
  netPayablePerMember: number;
  totalCollected: number;
  expectedCollection: number;
  status: 'SCHEDULED' | 'AUCTIONED' | 'DISBURSED' | 'CLOSED';
}

export interface ChitScheme {
  id: string;
  schemeCode: string;
  schemeName: string;
  totalValue: number;
  monthlyContribution: number;
  durationMonths: number;
  totalMembers: number;
  enrolledMembersCount: number;
  currentMonth: number;
  foremanCommissionPct: number;
  startDate: string;
  endDate: string;
  status: ChitStatus;
  description?: string;
  members?: ChitMemberSubscription[];
  auctions?: ChitAuctionRecord[];
}

export interface CreateChitSchemeInput {
  schemeName: string;
  totalValue: number;
  monthlyContribution: number;
  durationMonths: number;
  totalMembers: number;
  foremanCommissionPct: number;
  startDate: string;
  description?: string;
}
