# Enterprise Architecture & Business Workflow Implementation

This document provides a comprehensive breakdown of the frontend architecture restructuring for the **Chit Fund & Loan Management System**. The application is structured strictly around the **six core business workflows**, keeping it modular, API-ready, role-aware, and production-grade.

---

## 1. Core Business Modules Overview

```
                               ┌─────────────────────────────────┐
                               │   Staff / Admin Authentication  │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │  Role-Based Access Control RBAC │
                               │    (Admin, Staff, Management)   │
                               └────────────────┬────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
  ┌──────────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
  │ 5. Customer KYC & Documents  │ │   1. Loan Assessment     │ │   6. Management Control  │
  │ • Identity / Address Proofs  │ │ • Eligibility Screening  │ │ • Owner Sign-Off Queue   │
  │ • Document Verification      │ │ • Credit Bureau / CIBIL  │ │ • Executive Dashboards   │
  │ • Rejection & Resubmissions  │ │ • Obligations & FOIR     │ │ • Immutable Audit Trail  │
  └──────────────┬───────────────┘ └────────────┬─────────────┘ └──────────────────────────┘
                 │                              │
                 └──────────────┬───────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │    Owner Approval Gate       │
                 │ Sanction / Reject / Changes  │
                 └──────────────┬───────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │   Active Loan Management     │
                 │ Repayment & Amortization     │
                 └──────────────┬───────────────┘
                                │
                 ┌──────────────┴───────────────┐
                 ▼                              ▼
  ┌──────────────────────────────┐ ┌──────────────────────────┐
  │   2. Collection Automation   │ │   3. Staff Collection    │
  │ • Upcoming Due Monitoring    │ │ • Field & Call Tasks     │
  │ • Automated Reminders (SMS)  │ │ • Doorstep Visit Remarks │
  │ • Overdue & DPD Escalations  │ │ • Follow-up Scheduler    │
  └──────────────────────────────┘ └──────────────────────────┘
```

---

## 2. Information Architecture & Navigation

The navigation is organized into an enterprise hierarchy, strictly gated by role-based access rules:

| Section | Routes | Accessible By | Purpose |
| :--- | :--- | :--- | :--- |
| **Executive Dashboard** | `/dashboard` | `ADMIN`, `STAFF`, `MANAGEMENT` | Dynamic overview tailored by role (Executive KPIs vs Daily Worklist). |
| **Customer Hub** | `/customers`<br>`/customers/new`<br>`/customers/kyc`<br>`/customers/[id]/kyc` | `ADMIN`, `STAFF`, `MANAGEMENT` | Customer directory, registration, document verification, and KYC auditing. |
| **Loan Assessment** | `/assessments`<br>`/assessments/new`<br>`/assessments/[id]` | `ADMIN`, `STAFF`, `MANAGEMENT` | Multi-step credit assessment wizard, FOIR evaluation, bureau scoring. |
| **Loans** | `/loans`<br>`/loans/new`<br>`/loans/[id]` | `ADMIN`, `STAFF`, `MANAGEMENT` | Active/closed loan portfolios, disbursement, and repayment schedules. |
| **Collections** | `/collections`<br>`/collections/tasks`<br>`/collections/my-tasks`<br>`/collections/upcoming`<br>`/collections/overdue`<br>`/collections/recovery` | `ADMIN`, `STAFF`, `MANAGEMENT` | Collection dashboard, staff task allocation, personal tasks, overdue tracking, recovery pipeline. |
| **Approvals** | `/approvals`<br>`/approvals/[approvalId]` | `ADMIN`, `MANAGEMENT` | Owner sanctioning workflow, credit review, risk conditions, reject/changes requests. |
| **Audit Trail** | `/audit` | `ADMIN`, `MANAGEMENT` | Immutable log of all system changes with deep JSON snapshot diff inspector. |
| **Reports & Analytics** | `/reports/loans`<br>`/reports/collections`<br>`/reports/overdue`<br>`/reports/staff`<br>`/reports/customers`<br>`/reports/kyc` | `ADMIN`, `MANAGEMENT` | Domain-specific analytics with exportable datasets and charts. |
| **Settings** | `/settings/users`<br>`/settings/roles`<br>`/settings/permissions` | `ADMIN` | System administration, staff credential provisioning, permission matrix. |

---

## 3. Modular Architecture & Directory Structure

```
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   │   ├── new/
│   │   │   ├── kyc/
│   │   │   └── [customerId]/kyc/
│   │   ├── assessments/
│   │   │   ├── new/
│   │   │   └── [assessmentId]/
│   │   ├── approvals/
│   │   │   └── [approvalId]/
│   │   ├── collections/
│   │   │   ├── tasks/
│   │   │   ├── my-tasks/
│   │   │   ├── upcoming/
│   │   │   ├── overdue/
│   │   │   └── recovery/
│   │   ├── loans/
│   │   │   ├── new/
│   │   │   └── [loanId]/
│   │   ├── audit/
│   │   ├── reports/ (loans, collections, overdue, staff, customers, kyc)
│   │   └── settings/ (users, roles, permissions)
│
├── components/
│   ├── layout/ (Sidebar, Header, Breadcrumbs)
│   ├── assessments/ (AssessmentWizard, AssessmentListTable, CreditScoreGauge)
│   ├── approvals/ (ApprovalListTable, ApprovalDecisionModal)
│   ├── collections/ (CollectionMetricsHeader, CollectionTaskTable, RecordCollectionModal, EscalateTaskModal)
│   ├── kyc/ (KycProfileTable, KycVerificationModal)
│   ├── audit/ (AuditTable, AuditDiffModal)
│   └── dashboard/ (AdminDashboard, StaffDashboard, ManagementDashboard)
│
├── hooks/
│   ├── useAssessment.ts
│   ├── useApprovals.ts
│   ├── useCollections.ts
│   ├── useKyc.ts
│   ├── useAudit.ts
│   ├── useLoans.ts
│   └── useCustomers.ts
│
├── lib/
│   ├── permissions.ts (ROLE_PERMISSIONS matrix & canAccess helpers)
│   ├── validations/ (Zod schemas for assessment, collection, kyc)
│   └── api/ (Axios client & unified service exports)
│
├── services/
│   ├── assessment.service.ts
│   ├── approval.service.ts
│   ├── collection.service.ts
│   ├── kyc.service.ts
│   ├── audit.service.ts
│   └── mock-data/ (Isolated, API-ready mock entities)
│
└── types/
    ├── assessment.ts
    ├── approval.ts
    ├── collection.ts
    ├── kyc.ts
    ├── audit.ts
    ├── loan.ts
    └── auth.ts
```

---

## 4. Key Financial Rules & Architectural Guardrails

1. **Frontend Calculations as Preview Only**:
   - The frontend never acts as the source of truth for loan eligibility, credit bureau ratings, interest schedules, EMI calculation, or approval decisions.
   - All credit scoring (CIBIL/Equifax), FOIR calculations, and sanction amounts originate from backend service boundaries (`services/assessment.service.ts`, `services/approval.service.ts`).
2. **Strict Role-Based UI Gating**:
   - `ADMIN`: Full authority across all modules, approvals, settings, and audit logs.
   - `STAFF`: Scoped strictly to Customer Registration, KYC Collection, Loan Assessment drafting, and Daily Collection field tasks (`my-tasks`). Excluded from Approvals, Executive Reports, and System Settings.
   - `MANAGEMENT`: Review authority across loans, approvals, portfolio risk reports, and executive dashboards.
3. **Immutable Audit Logging**:
   - Destructive or administrative mutations (status changes, sanctions, remarks, task escalations) write to the audit trail service with previous and new JSON snapshot state, user ID, role, and client metadata.
