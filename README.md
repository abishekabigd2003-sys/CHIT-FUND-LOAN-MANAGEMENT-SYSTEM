# Chit Fund & Loan Management System

An enterprise-grade frontend platform for managing Chit Funds, Loan Underwriting, Risk Assessment, Collection Automation, and Multi-role Approvals. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, and TanStack React Query.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **Package Manager**: npm (v9+) or pnpm / yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Chit Fund + Loan Management System"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Copy the example environment file and configure your settings:
   ```bash
   cp .env.example .env.local
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

4. Run the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for Production:
   ```bash
   npm run build
   npm run start
   ```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Components**: React 19, Tailwind CSS, Lucide React
- **State & Data Fetching**: TanStack React Query v5
- **Form Management & Validation**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **HTTP Client**: Axios
- **Dates & Utility**: Date-fns, clsx, tailwind-merge

---

## 📋 Core Modules & Workflows

1. **Loan Assessment Wizard**: Eligibility screening, CIBIL/Bureau scoring, FOIR evaluation, and collateral appraisal (Gold, Bike, Guarantor, Nominee loans).
2. **Owner & Management Approvals**: Multi-tier sign-off queue with sanctioning, condition overrides, and audit trails.
3. **Chit Fund Operations**: Chit schemes, member subscriptions, auction bidding, and installment collections.
4. **Collection Automation & Staff Tasks**: Automated reminder schedules, overdue/DPD tracking, doorstep recovery visits, and follow-up logging.
5. **Customer KYC & Document Hub**: Identity/address verification workflows with status tracking.
6. **Executive Dashboards & Reports**: Domain-specific analytics for loans, collections, staff performance, and KYC.

---

## 📂 Repository Structure

```
├── app/                  # Next.js App Router (pages, layouts, routes)
│   ├── (authenticated)/  # Protected routes (dashboard, loans, chits, etc.)
│   └── login/            # Authentication page
├── components/           # Reusable UI & business domain components
├── docs/                 # Enterprise architecture & domain specifications
├── hooks/                # Custom React hooks (loans, chits, auth, etc.)
├── lib/                  # Utilities, API client, validations, permissions
├── providers/            # React context providers (Auth, Query, Theme, Toast)
├── public/               # Static assets & images
├── services/             # Service layer & mock data fixtures
├── types/                # TypeScript interfaces and type definitions
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.mjs   # Tailwind design tokens
└── tsconfig.json         # TypeScript configuration
```

---

## 🔐 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_USE_MOCK` | Toggle mock data vs live backend API (`true` / `false`) | `true` |
| `NEXT_PUBLIC_API_URL` | Base URL for backend REST API | `https://api.chitfund-loan.enterprise.local/api/v1` |

---

## 📄 License
Private & Proprietary. All rights reserved.
