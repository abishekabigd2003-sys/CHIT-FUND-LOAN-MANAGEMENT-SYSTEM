import { AppModule, AppAction, PermissionDefinition, RoleDefinition } from './types';

export interface ModuleConfig {
  id: AppModule;
  label: string;
  description: string;
  defaultRoute: string;
}

export const APP_MODULES: ModuleConfig[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Financial metrics, portfolio KPIs & operational alerts', defaultRoute: '/dashboard' },
  { id: 'customers', label: 'Customers', description: 'Customer profiles, KYC documentation & borrower history', defaultRoute: '/customers' },
  { id: 'kyc', label: 'KYC & Verification', description: 'Identity, Aadhaar/PAN validation & fraud screening', defaultRoute: '/customers/kyc' },
  { id: 'documents', label: 'Documents', description: 'Vault for pledges, promissory notes & legal deeds', defaultRoute: '/documents' },
  { id: 'assessments', label: 'Loan Assessment', description: 'Credit scoring, FOIR ratio & sanction recommendations', defaultRoute: '/assessments' },
  { id: 'loans', label: 'Loans & Disbursals', description: 'Loan schedules, collateral tracking & sanction disbursement', defaultRoute: '/loans' },
  { id: 'approvals', label: 'Approvals Workflow', description: 'Executive sanction sign-off, changes & rejection gateway', defaultRoute: '/approvals' },
  { id: 'collections', label: 'Collections & Recovery', description: 'Field collection, doorstep visits & delinquency recovery', defaultRoute: '/collections' },
  { id: 'chits', label: 'Chit Funds', description: 'Chit schemes, auction bidding, dividends & subscriber groups', defaultRoute: '/chits' },
  { id: 'notifications', label: 'Notifications', description: 'System alerts, customer SMS & reminder broadcast logs', defaultRoute: '/notifications' },
  { id: 'reports', label: 'Reports & Analytics', description: 'Portfolio health, collection efficiency & auditor exports', defaultRoute: '/reports' },
  { id: 'audit', label: 'Audit Trail', description: 'Immutable activity ledger, compliance logs & security trace', defaultRoute: '/audit' },
  { id: 'users', label: 'User Management', description: 'Staff accounts, branch assignments & credential provisioning', defaultRoute: '/settings/users' },
  { id: 'roles', label: 'Roles & Permissions', description: 'Dynamic RBAC configuration, permission matrix & privileges', defaultRoute: '/settings/roles' },
  { id: 'settings', label: 'System Settings', description: 'Tenant settings, interest rules, late fee & branch configs', defaultRoute: '/settings' },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Dashboard
  { id: 'dashboard.view', module: 'dashboard', action: 'view', name: 'View Dashboard', description: 'Access dashboard KPIs, summary cards and operational overview' },
  { id: 'dashboard.admin', module: 'dashboard', action: 'view', name: 'Access Admin Dashboard', description: 'Access executive owner and master administration dashboard' },
  { id: 'dashboard.management', module: 'dashboard', action: 'view', name: 'Access Management Dashboard', description: 'Access management portfolio oversight & analytics dashboard' },
  { id: 'dashboard.staff', module: 'dashboard', action: 'view', name: 'Access Staff Dashboard', description: 'Access staff field collections and worklist dashboard' },
  { id: 'dashboard.export', module: 'dashboard', action: 'export', name: 'Export Dashboard Metrics', description: 'Download executive summary spreadsheets and charts' },

  // Customers
  { id: 'customers.view', module: 'customers', action: 'view', name: 'View Customers', description: 'Browse customer list and view full profile details' },
  { id: 'customers.create', module: 'customers', action: 'create', name: 'Create Customer', description: 'Register new borrowers and chit subscribers' },
  { id: 'customers.edit', module: 'customers', action: 'edit', name: 'Edit Customer', description: 'Update customer contact info, address and banking details' },
  { id: 'customers.delete', module: 'customers', action: 'delete', name: 'Delete Customer', description: 'Archive or purge customer accounts' },
  { id: 'customers.export', module: 'customers', action: 'export', name: 'Export Customers', description: 'Download customer registry to CSV/Excel' },

  // KYC
  { id: 'kyc.view', module: 'kyc', action: 'view', name: 'View KYC', description: 'Inspect identity verifications and compliance statuses' },
  { id: 'kyc.create', module: 'kyc', action: 'create', name: 'Initiate KYC', description: 'Start new KYC verification checks' },
  { id: 'kyc.edit', module: 'kyc', action: 'edit', name: 'Update KYC', description: 'Modify submitted KYC data and address proofs' },
  { id: 'kyc.upload', module: 'kyc', action: 'upload', name: 'Upload KYC Documents', description: 'Attach Aadhaar, PAN card, and biometric files' },
  { id: 'kyc.approve', module: 'kyc', action: 'approve', name: 'Approve KYC', description: 'Authorize KYC compliance certificate' },
  { id: 'kyc.reject', module: 'kyc', action: 'reject', name: 'Reject KYC', description: 'Mark KYC as invalid or suspicious' },
  { id: 'kyc.delete', module: 'kyc', action: 'delete', name: 'Delete KYC Records', description: 'Remove KYC documents or verification files' },

  // Documents
  { id: 'documents.view', module: 'documents', action: 'view', name: 'View Documents', description: 'Browse document vault and downloaded contracts' },
  { id: 'documents.upload', module: 'documents', action: 'upload', name: 'Upload Documents', description: 'Upload loan pledge slips, hypothecation and receipts' },
  { id: 'documents.delete', module: 'documents', action: 'delete', name: 'Delete Documents', description: 'Permanently remove legal documents from vault' },

  // Loan Assessment
  { id: 'assessments.view', module: 'assessments', action: 'view', name: 'View Assessments', description: 'Inspect loan eligibility reports and FOIR calculations' },
  { id: 'assessments.create', module: 'assessments', action: 'create', name: 'Create Assessment', description: 'Draft new credit score and risk assessments' },
  { id: 'assessments.edit', module: 'assessments', action: 'edit', name: 'Edit Assessment', description: 'Update income assumptions and valuation details' },
  { id: 'assessments.delete', module: 'assessments', action: 'delete', name: 'Delete Assessment', description: 'Delete draft or obsolete credit assessments' },
  { id: 'assessments.approve', module: 'assessments', action: 'approve', name: 'Sanction Assessment', description: 'Formally approve credit underwriting assessment' },
  { id: 'assessments.reject', module: 'assessments', action: 'reject', name: 'Reject Assessment', description: 'Decline credit underwriting assessment' },

  // Loans
  { id: 'loans.view', module: 'loans', action: 'view', name: 'View Loans', description: 'Inspect loan contracts, ledgers and amortization schedules' },
  { id: 'loans.create', module: 'loans', action: 'create', name: 'Create Loan', description: 'Create and disburse new gold/vehicle/personal loans' },
  { id: 'loans.edit', module: 'loans', action: 'edit', name: 'Edit Loan', description: 'Modify interest rates, collateral or repayment dates' },
  { id: 'loans.delete', module: 'loans', action: 'delete', name: 'Delete / Void Loan', description: 'Cancel or void loan records' },
  { id: 'loans.approve', module: 'loans', action: 'approve', name: 'Approve & Sanction Loan', description: 'Authorize disbursal of sanctioned funds' },
  { id: 'loans.reject', module: 'loans', action: 'reject', name: 'Reject Loan', description: 'Decline loan application' },
  { id: 'loans.export', module: 'loans', action: 'export', name: 'Export Loan Records', description: 'Export loan ledger and NPA lists to Excel' },

  // Approvals
  { id: 'approvals.view', module: 'approvals', action: 'view', name: 'View Approvals', description: 'Access executive approvals queue' },
  { id: 'approvals.approve', module: 'approvals', action: 'approve', name: 'Grant Approval', description: 'Sign-off on pending loan and chit requests' },
  { id: 'approvals.reject', module: 'approvals', action: 'reject', name: 'Decline Approval', description: 'Reject sanction requests or return for rework' },

  // Collections
  { id: 'collections.view', module: 'collections', action: 'view', name: 'View Collections', description: 'Access collection queues, tasks and daily targets' },
  { id: 'collections.create', module: 'collections', action: 'create', name: 'Record Collection', description: 'Collect EMI payment via Cash, UPI or Cheque' },
  { id: 'collections.update', module: 'collections', action: 'update', name: 'Update Payment Status', description: 'Update payment remarks, visit notes and receipt details' },
  { id: 'collections.assign', module: 'collections', action: 'assign', name: 'Assign Collection Tasks', description: 'Assign delinquent borrower visits to field officers' },
  { id: 'collections.close', module: 'collections', action: 'close', name: 'Close Collection Cases', description: 'Mark recovery tasks completed or settled' },
  { id: 'collections.export', module: 'collections', action: 'export', name: 'Export Collection Logs', description: 'Download collection receipts and settlement registers' },

  // Chit Funds
  { id: 'chits.view', module: 'chits', action: 'view', name: 'View Chit Schemes', description: 'View chit groups, auction results and subscriber lists' },
  { id: 'chits.create', module: 'chits', action: 'create', name: 'Create Chit Group', description: 'Launch new monthly chit fund schemes' },
  { id: 'chits.edit', module: 'chits', action: 'edit', name: 'Edit Chit Scheme', description: 'Manage auction rounds and installment schedules' },
  { id: 'chits.delete', module: 'chits', action: 'delete', name: 'Delete Chit Group', description: 'Remove inactive or draft chit funds' },
  { id: 'chits.export', module: 'chits', action: 'export', name: 'Export Chit Logs', description: 'Export auction ledger and dividend reports' },

  // Notifications
  { id: 'notifications.view', module: 'notifications', action: 'view', name: 'View Notifications', description: 'View real-time alerts and system logs' },
  { id: 'notifications.edit', module: 'notifications', action: 'edit', name: 'Manage Notifications', description: 'Mark alerts read or configure notification rules' },
  { id: 'notifications.delete', module: 'notifications', action: 'delete', name: 'Dismiss Notifications', description: 'Clear notifications' },

  // Reports
  { id: 'reports.view', module: 'reports', action: 'view', name: 'View Reports', description: 'Generate business intelligence and financial reports' },
  { id: 'reports.export', module: 'reports', action: 'export', name: 'Export Reports', description: 'Download balance sheets, NPAs and collection reports' },

  // Audit
  { id: 'audit.view', module: 'audit', action: 'view', name: 'View Audit Trail', description: 'Inspect chronological system activity logs' },
  { id: 'audit.export', module: 'audit', action: 'export', name: 'Export Audit Trail', description: 'Download compliance audit logs for external scrutiny' },

  // Users
  { id: 'users.view', module: 'users', action: 'view', name: 'View Users', description: 'Browse staff user accounts and branch assignments' },
  { id: 'users.create', module: 'users', action: 'create', name: 'Provision User', description: 'Create new staff or management credentials' },
  { id: 'users.edit', module: 'users', action: 'edit', name: 'Edit User Account', description: 'Update user profiles, email, branch or assigned role' },
  { id: 'users.delete', module: 'users', action: 'delete', name: 'Deactivate / Delete User', description: 'Revoke user credentials or disable account' },

  // Roles & Permissions
  { id: 'roles.view', module: 'roles', action: 'view', name: 'View Roles & Permissions', description: 'Inspect role hierarchy and active permission mappings' },
  { id: 'roles.create', module: 'roles', action: 'create', name: 'Create Custom Role', description: 'Create new custom enterprise roles' },
  { id: 'roles.edit', module: 'roles', action: 'edit', name: 'Configure Permissions', description: 'Modify and grant/revoke module and action permissions' },
  { id: 'roles.delete', module: 'roles', action: 'delete', name: 'Delete Custom Role', description: 'Remove non-system custom roles' },

  // Settings
  { id: 'settings.view', module: 'settings', action: 'view', name: 'View System Settings', description: 'Access enterprise configuration settings' },
  { id: 'settings.edit', module: 'settings', action: 'edit', name: 'Modify System Settings', description: 'Update interest rates, fee rules and branch metadata' },
];

export const ALL_PERMISSION_IDS: string[] = ALL_PERMISSIONS.map((p) => p.id);

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [...ALL_PERMISSION_IDS], // Admin has full access by definition
  MANAGEMENT: [
    'dashboard.view',
    'dashboard.management',
    'dashboard.export',
    'customers.view',
    'customers.export',
    'kyc.view',
    'kyc.export',
    'documents.view',
    'assessments.view',
    'assessments.export',
    'loans.view',
    'loans.export',
    'approvals.view',
    'collections.view',
    'collections.export',
    'chits.view',
    'chits.export',
    'notifications.view',
    'reports.view',
    'reports.export',
    'audit.view',
    'audit.export',
  ],
  STAFF: [
    'dashboard.view',
    'dashboard.staff',
    'customers.view',
    'customers.create',
    'customers.edit',
    'kyc.view',
    'kyc.create',
    'kyc.edit',
    'kyc.upload',
    'documents.view',
    'documents.upload',
    'assessments.view',
    'assessments.create',
    'assessments.edit',
    'loans.view',
    'loans.create',
    'collections.view',
    'collections.create',
    'collections.update',
    'notifications.view',
    'chits.view',
  ],
  LOAN_OFFICER: [
    'dashboard.view',
    'customers.view',
    'customers.create',
    'customers.edit',
    'kyc.view',
    'kyc.create',
    'kyc.edit',
    'kyc.upload',
    'documents.view',
    'documents.upload',
    'assessments.view',
    'assessments.create',
    'assessments.edit',
    'assessments.approve',
    'loans.view',
    'loans.create',
    'loans.edit',
    'notifications.view',
  ],
  COLLECTION_MANAGER: [
    'dashboard.view',
    'customers.view',
    'loans.view',
    'collections.view',
    'collections.create',
    'collections.update',
    'collections.assign',
    'collections.close',
    'collections.export',
    'notifications.view',
    'reports.view',
  ],
  KYC_OFFICER: [
    'dashboard.view',
    'customers.view',
    'customers.create',
    'customers.edit',
    'kyc.view',
    'kyc.create',
    'kyc.edit',
    'kyc.upload',
    'kyc.approve',
    'kyc.reject',
    'documents.view',
    'documents.upload',
    'notifications.view',
  ],
};

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role-admin',
    code: 'ADMIN',
    name: 'Owner / Administrator',
    description: 'Highest authority. Unrestricted operational, financial, and permission administration privileges across the entire enterprise.',
    isSystem: true,
    permissions: [...ALL_PERMISSION_IDS],
    usersCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-management',
    code: 'MANAGEMENT',
    name: 'Executive Management',
    description: 'Oversight role for zonal managers, board members, and compliance officers. Access to analytical reports, audit logs, and portfolio performance.',
    isSystem: true,
    permissions: [...DEFAULT_ROLE_PERMISSIONS.MANAGEMENT],
    usersCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-staff',
    code: 'STAFF',
    name: 'Operations & Field Staff',
    description: 'Operational team members responsible for customer onboarding, KYC document collection, loan drafting, and doorstep cash recovery.',
    isSystem: true,
    permissions: [...DEFAULT_ROLE_PERMISSIONS.STAFF],
    usersCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-loan-officer',
    code: 'LOAN_OFFICER',
    name: 'Credit & Loan Officer',
    description: 'Specialized in underwriting assessments, collateral valuations (gold, vehicles), and loan documentation.',
    isSystem: false,
    permissions: [...DEFAULT_ROLE_PERMISSIONS.LOAN_OFFICER],
    usersCount: 0,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'role-collection-mgr',
    code: 'COLLECTION_MANAGER',
    name: 'Collection Manager',
    description: 'Focuses on overdue pipelines, assigning field recovery tasks, and monitoring collection efficiency.',
    isSystem: false,
    permissions: [...DEFAULT_ROLE_PERMISSIONS.COLLECTION_MANAGER],
    usersCount: 0,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
];
