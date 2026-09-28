export interface DashboardData {
  metrics: {
    totalCustomers: number;
    totalCustomersChange: number;
    activeChits: number;
    activeChitsChange: number;
    activeLoans: number;
    activeLoansChange: number;
    todayCollections: number;
    todayCollectionsChange: number;
    pendingPaymentsAmount: number;
    pendingPaymentsCount: number;
    overduePaymentsAmount: number;
    overduePaymentsCount: number;
    totalDisbursedAmount: number;
    totalAUM: number;
  };
  monthlyCollections: Array<{
    month: string;
    chits: number;
    loans: number;
    total: number;
  }>;
  loanTypeDistribution: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  paymentStatusOverview: Array<{
    status: string;
    count: number;
    amount: number;
    color: string;
  }>;
  upcomingPaymentSchedule: Array<{
    id: string;
    customerName: string;
    accountCode: string;
    type: 'LOAN' | 'CHIT';
    dueDate: string;
    amount: number;
    status: 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID';
  }>;
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    category: 'PAYMENT' | 'CUSTOMER' | 'LOAN' | 'CHIT' | 'SECURITY';
  }>;
}

export const mockDashboardData: DashboardData = {
  metrics: {
    totalCustomers: 1248,
    totalCustomersChange: 12.5,
    activeChits: 38,
    activeChitsChange: 5.2,
    activeLoans: 142,
    activeLoansChange: 8.4,
    todayCollections: 248500,
    todayCollectionsChange: 18.2,
    pendingPaymentsAmount: 385000,
    pendingPaymentsCount: 19,
    overduePaymentsAmount: 92400,
    overduePaymentsCount: 4,
    totalDisbursedAmount: 18450000,
    totalAUM: 34200000,
  },
  monthlyCollections: [
    { month: "Apr", chits: 1450000, loans: 1820000, total: 3270000 },
    { month: "May", chits: 1620000, loans: 1950000, total: 3570000 },
    { month: "Jun", chits: 1580000, loans: 2100000, total: 3680000 },
    { month: "Jul", chits: 1750000, loans: 2280000, total: 4030000 },
    { month: "Aug", chits: 1890000, loans: 2410000, total: 4300000 },
    { month: "Sep", chits: 1980000, loans: 2590000, total: 4570000 },
  ],
  loanTypeDistribution: [
    { name: "Gold Loan", value: 58, amount: 8250000, color: "#f59e0b" },
    { name: "Bike Loan", value: 34, amount: 2890000, color: "#3b82f6" },
    { name: "Guarantor Loan", value: 32, amount: 4800000, color: "#10b981" },
    { name: "Nominee Loan", value: 18, amount: 2510000, color: "#8b5cf6" },
  ],
  paymentStatusOverview: [
    { status: "Paid", count: 840, amount: 4235000, color: "#10b981" },
    { status: "Pending", count: 72, amount: 385000, color: "#f59e0b" },
    { status: "Overdue", count: 18, amount: 92400, color: "#ef4444" },
    { status: "Partially Paid", count: 12, amount: 64200, color: "#6366f1" },
  ],
  upcomingPaymentSchedule: [
    {
      id: "up-1",
      customerName: "Venkatesh Natarajan",
      accountCode: "CFT-1000K-20M",
      type: "CHIT",
      dueDate: "2024-09-25",
      amount: 46500,
      status: "PENDING",
    },
    {
      id: "up-2",
      customerName: "Karthik Subramanian",
      accountCode: "GL-2024-0145",
      type: "LOAN",
      dueDate: "2024-09-26",
      amount: 13260,
      status: "OVERDUE",
    },
    {
      id: "up-3",
      customerName: "Murugan Palaniswamy",
      accountCode: "GLR-2024-0044",
      type: "LOAN",
      dueDate: "2024-09-28",
      amount: 9207,
      status: "PARTIALLY_PAID",
    },
    {
      id: "up-4",
      customerName: "Rajesh Kumar",
      accountCode: "GL-2024-0089",
      type: "LOAN",
      dueDate: "2024-10-10",
      amount: 22158,
      status: "PENDING",
    },
    {
      id: "up-5",
      customerName: "Priya Sundaram",
      accountCode: "BL-2024-0112",
      type: "LOAN",
      dueDate: "2024-10-15",
      amount: 5488,
      status: "PENDING",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      user: "Anand S (Staff)",
      action: "Collected ₹22,158 via UPI",
      target: "Loan GL-2024-0089 (Rajesh Kumar)",
      time: "15 minutes ago",
      category: "PAYMENT",
    },
    {
      id: "act-2",
      user: "Suresh R (Admin)",
      action: "Approved KYC Documents",
      target: "Customer CUST-1001 (Rajesh Kumar)",
      time: "1 hour ago",
      category: "CUSTOMER",
    },
    {
      id: "act-3",
      user: "System",
      action: "Conducted Monthly Auction",
      target: "Chit CFT-500K-20M (Bid: ₹95,000)",
      time: "3 hours ago",
      category: "CHIT",
    },
    {
      id: "act-4",
      user: "Karthik V (Staff)",
      action: "Created Loan Application",
      target: "Nominee Loan NL-2024-0019 (₹5,00,000)",
      time: "5 hours ago",
      category: "LOAN",
    },
    {
      id: "act-5",
      user: "System",
      action: "Sent 42 Automated SMS Reminders",
      target: "Upcoming EMI Due Dates",
      time: "Today at 09:00 AM",
      category: "SECURITY",
    },
  ]
};
