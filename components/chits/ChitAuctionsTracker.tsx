import React from 'react';
import { Award } from 'lucide-react';
import { ChitAuctionRecord } from '@/types/chit';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ChitAuctionsTracker({ auctions }: { auctions: ChitAuctionRecord[] }) {
  if (!auctions || auctions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
        No auction rounds have taken place yet for this scheme.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Monthly Auction & Dividend Tracker</h3>
        <p className="text-xs text-slate-500">Reverse-bid auction outcomes, prized subscriber disbursements, and member dividend deductions.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month #</TableHead>
              <TableHead>Auction Date</TableHead>
              <TableHead>Prized Subscriber</TableHead>
              <TableHead>Winning Bid Discount</TableHead>
              <TableHead>Dividend / Member</TableHead>
              <TableHead>Net Payable Due</TableHead>
              <TableHead>Total Collected</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.map((auc) => (
              <TableRow key={auc.id}>
                <TableCell>
                  <span className="font-bold text-slate-900 text-xs">
                    Month {auc.monthNumber}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-slate-600">{formatDate(auc.auctionDate)}</span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-900 text-xs">
                      {auc.winnerCustomerName || 'Company Foreman'}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-mono font-bold text-rose-600 text-xs">
                    {formatCurrency(auc.winningBidAmount)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-mono font-bold text-emerald-600 text-xs">
                    + {formatCurrency(auc.dividendPerMember)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-xs">
                    {formatCurrency(auc.netPayablePerMember)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-bold text-slate-800 text-xs">
                    {formatCurrency(auc.totalCollected)}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge variant={auc.status === 'CLOSED' || auc.status === 'DISBURSED' ? 'success' : 'warning'} dot>
                    {auc.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
