'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, UserPlus } from 'lucide-react';
import { ChitMemberSubscription } from '@/types/chit';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useAddChitMember } from '@/hooks/useChits';
import { mockCustomers } from '@/services/mock-data/customers';

interface ChitMembersTableProps {
  chitId: string;
  members: ChitMemberSubscription[];
  monthlyContribution: number;
}

export function ChitMembersTable({ chitId, members, monthlyContribution }: ChitMembersTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const addMemberMutation = useAddChitMember();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = mockCustomers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    await addMemberMutation.mutateAsync({
      chitId,
      customerId: cust.id,
      customerName: `${cust.firstName} ${cust.lastName}`,
      customerCode: cust.customerCode,
    });
    setIsAddModalOpen(false);
    setSelectedCustomerId('');
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Enrolled Subscribers ({members.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ticket allocations, cumulative installments paid, and prize status.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 text-xs shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Member</span>
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Subscriber Name</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Current Due</TableHead>
                <TableHead>Dividends Earned</TableHead>
                <TableHead>Auction Status</TableHead>
                <TableHead>Member Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell>
                    <span className="font-mono font-bold text-xs bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-md border border-brand-500/20">
                      #{member.ticketNumber}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div>
                      <Link
                        href={`/customers/${member.customerId}`}
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 text-xs sm:text-sm hover:underline"
                      >
                        {member.customerName}
                      </Link>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{member.customerCode}</p>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs tabular-nums font-mono">
                      {formatCurrency(member.totalPaid)}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`font-semibold text-xs tabular-nums font-mono ${
                        member.totalDue > 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {formatCurrency(member.totalDue)}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs tabular-nums font-mono">
                      {formatCurrency(member.dividendEarned)}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {member.isPrized ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full w-max">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Prized (M-{member.prizedMonth})</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Non-Prized</span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge variant={member.status === 'ACTIVE' ? 'success' : 'secondary'} dot>
                      {member.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll Subscriber into Scheme"
        description="Select an existing verified customer to assign the next available ticket."
        size="md"
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
            >
              <option value="">-- Choose verified customer --</option>
              {mockCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.customerCode}) - {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
            <p className="text-slate-500 dark:text-slate-400">Monthly Contribution Required:</p>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">{formatCurrency(monthlyContribution)} / month</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={addMemberMutation.isPending}
              className="shadow-2xs font-semibold"
            >
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
