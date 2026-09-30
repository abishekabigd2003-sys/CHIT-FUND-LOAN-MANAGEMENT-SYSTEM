'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types/audit';
import { formatDate } from '@/lib/utils';
import { History, Eye, X, Laptop, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AuditTableProps {
  logs: AuditLog[];
  isLoading?: boolean;
}

export function AuditTable({ logs, isLoading }: AuditTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500">Loading audit trail records...</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">
              <th className="py-3 px-3.5">Timestamp</th>
              <th className="py-3 px-3.5">User & Role</th>
              <th className="py-3 px-3.5">Module</th>
              <th className="py-3 px-3.5">Action</th>
              <th className="py-3 px-3.5">Record Ref</th>
              <th className="py-3 px-3.5">Description</th>
              <th className="py-3 px-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-normal">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3.5 text-slate-500 text-xs whitespace-nowrap font-normal">
                  {formatDate(log.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                </td>

                <td className="py-3 px-3.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{log.userName}</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mt-0.5 ${
                      log.userRole === 'ADMIN'
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                        : log.userRole === 'MANAGEMENT'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {log.userRole}
                  </span>
                </td>

                <td className="py-3 px-3.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.module}
                  </span>
                </td>

                <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {log.action}
                </td>

                <td className="py-3 px-3.5 font-mono text-brand-600 dark:text-brand-400 font-medium text-xs">
                  {log.recordId}
                </td>

                <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 text-xs max-w-xs truncate font-normal">
                  {log.description}
                </td>

                <td className="py-3 px-3.5 text-right">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setSelectedLog(log)}
                    leftIcon={<Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                  >
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Audit Snapshot • {selectedLog.recordId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-850/60 rounded-lg">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Performed By</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px]">
                    {selectedLog.userName} ({selectedLog.userRole})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Timestamp</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {formatDate(selectedLog.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">IP Address</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold">
                    {selectedLog.ipAddress || '127.0.0.1'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Client Environment</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate block text-xs sm:text-sm font-medium">
                    {selectedLog.userAgent || 'Chrome Enterprise'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Action Narrative:
                </span>
                <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  {selectedLog.description}
                </p>
              </div>

              {/* State Transition Diff */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                    Previous Value
                  </span>
                  <pre className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 font-mono text-xs text-rose-900 dark:text-rose-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(selectedLog.previousValue || 'None / Initial State', null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    New Value (Committed)
                  </span>
                  <pre className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 font-mono text-xs text-emerald-900 dark:text-emerald-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(selectedLog.newValue || 'None / Deleted', null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
