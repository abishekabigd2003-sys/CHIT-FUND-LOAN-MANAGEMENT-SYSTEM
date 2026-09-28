import React from 'react';
import Link from 'next/link';
import { Eye, Phone, Mail, ChevronRight } from 'lucide-react';
import { Customer } from '@/types/customer';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CustomerListTableProps {
  customers: Customer[];
}

export function CustomerListTable({ customers }: CustomerListTableProps) {
  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" dot pulse>Active</Badge>;
      case 'PENDING':
        return <Badge variant="warning" dot>Pending KYC</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive" dot>Suspended</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] overflow-hidden shadow-fintech">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active Chits</TableHead>
            <TableHead>Loan Balance</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.firstName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200/80 dark:ring-slate-700 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 font-bold flex items-center justify-center text-xs shadow-2xs shrink-0 border border-brand-200/60 dark:border-brand-800/60">
                      {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/customers/${c.id}`}
                      prefetch={true}
                      className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm hover:underline block truncate"
                    >
                      {c.firstName} {c.lastName}
                    </Link>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">{c.customerCode}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium text-xs">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[1.8] shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[1.8] shrink-0" />
                    <span className="truncate max-w-[140px]">{c.email}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <div className="text-sm">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{c.address.city}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{c.address.state}</p>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">{getStatusBadge(c.status)}</TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">{c.stats?.activeChits || 0}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs ml-1.5 font-medium">schemes</span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(c.stats?.totalLoanOutstanding || 0)}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{formatDate(c.createdAt)}</span>
              </TableCell>

              <TableCell className="text-right whitespace-nowrap">
                <Button
                  href={`/customers/${c.id}`}
                  variant="ghost"
                  size="xs"
                  leftIcon={<Eye className="w-4 h-4 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5 opacity-60 stroke-[2]" />}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
