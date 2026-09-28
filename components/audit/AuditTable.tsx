'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types/audit';
import { formatDate } from '@/lib/utils';
import { History, Eye, X, Laptop, Shield } from 'lucide-react';

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
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">User & Role</th>
              <th className="py-3.5 px-4">Module</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Record Ref</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                  {formatDate(log.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{log.userName}</div>
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
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

                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.module}
                  </span>
                </td>

                <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  {log.action}
                </td>

                <td className="py-3 px-4 font-mono text-brand-600 dark:text-brand-400 font-semibold">
                  {log.recordId}
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                  {log.description}
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 text-xs">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Audit Snapshot • {selectedLog.recordId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-850/60 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Performed By</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedLog.userName} ({selectedLog.userRole})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Timestamp</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(selectedLog.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">IP Address</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedLog.ipAddress || '127.0.0.1'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Client Environment</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate block">
                    {selectedLog.userAgent || 'Chrome Enterprise'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Action Narrative:
                </span>
                <p className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  {selectedLog.description}
                </p>
              </div>

              {/* State Transition Diff */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase block mb-1">
                    Previous Value
                  </span>
                  <pre className="p-2.5 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 font-mono text-[11px] text-rose-900 dark:text-rose-200 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.previousValue || 'None / Initial State', null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
                    New Value (Committed)
                  </span>
                  <pre className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 font-mono text-[11px] text-emerald-900 dark:text-emerald-200 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.newValue || 'None / Deleted', null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
