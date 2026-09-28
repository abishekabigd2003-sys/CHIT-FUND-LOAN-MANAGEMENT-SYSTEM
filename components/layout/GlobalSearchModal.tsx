'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Landmark, Coins, ArrowRight, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDebounce } from '@/hooks/useDebounce';
import { mockCustomers } from '@/services/mock-data/customers';
import { mockLoans } from '@/services/mock-data/loans';
import { mockChitSchemes } from '@/services/mock-data/chits';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = debouncedQuery.toLowerCase().trim();

  const matchingCustomers = q
    ? mockCustomers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.phone.includes(q)
      ).slice(0, 4)
    : [];

  const matchingLoans = q
    ? mockLoans.filter(
        (l) =>
          l.loanCode.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q) ||
          l.loanType.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchingChits = q
    ? mockChitSchemes.filter(
        (c) =>
          c.schemeName.toLowerCase().includes(q) ||
          c.schemeCode.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="p-0 overflow-hidden">
      <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1527]/50">
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 stroke-[1.8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer name, phone, loan ID (GL-), or chit code..."
          className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-none">
        {!q ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            Type anything to search customers, active loans, and chit fund schemes...
          </div>
        ) : matchingCustomers.length === 0 && matchingLoans.length === 0 && matchingChits.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No results found for <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span>
          </div>
        ) : (
          <>
            {/* Customers */}
            {matchingCustomers.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" /> Customers
                </p>
                <div className="space-y-1">
                  {matchingCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigateTo(`/customers/${c.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-800/70 cursor-pointer transition-colors text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 font-bold flex items-center justify-center text-xs">
                          {c.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {c.customerCode} • {c.phone}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 stroke-[2]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loans */}
            {matchingLoans.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" /> Loans
                </p>
                <div className="space-y-1">
                  {matchingLoans.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => navigateTo(`/loans/${l.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-800/70 cursor-pointer transition-colors text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{l.loanCode} - {l.loanType} Loan</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {l.customerName} • {formatCurrency(l.principalAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-[11px]">
                          {l.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chits */}
            {matchingChits.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" /> Chit Schemes
                </p>
                <div className="space-y-1">
                  {matchingChits.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigateTo(`/chits/${c.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-800/70 cursor-pointer transition-colors text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{c.schemeName}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {c.schemeCode} • {formatCurrency(c.totalValue)} • {c.durationMonths} Months
                        </p>
                      </div>
                      <Badge variant="success" className="text-[11px]">
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0d1527]/70 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Press ESC to exit</span>
        <span>Enter to view</span>
      </div>
    </Modal>
  );
}
