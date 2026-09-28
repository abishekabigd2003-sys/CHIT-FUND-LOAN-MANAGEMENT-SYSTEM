'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface MonthlyData {
  month: string;
  chits: number;
  loans: number;
  total: number;
}

export function MonthlyCollectionChart({ data }: { data: MonthlyData[] }) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const chitsVal = payload[0]?.value || 0;
      const loansVal = payload[1]?.value || 0;
      const totalVal = chitsVal + loansVal;

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/60 dark:border-slate-800 text-xs min-w-[210px] animate-in fade-in-0 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wide">
              {label}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Consolidated</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                Chit Pool
              </span>
              <span className="font-semibold text-slate-100 tabular-nums">
                {formatCurrency(chitsVal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                Loan EMIs
              </span>
              <span className="font-semibold text-slate-100 tabular-nums">
                {formatCurrency(loansVal)}
              </span>
            </div>

            <div className="border-t border-slate-800/80 pt-2 mt-2 flex items-center justify-between font-bold">
              <span className="text-slate-300">Total Collected</span>
              <span className="text-emerald-400 tabular-nums">{formatCurrency(totalVal)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 0 }} barGap={6}>
          <defs>
            <linearGradient id="chitCollectionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7132B0" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#581c87" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="loanCollectionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#94a3b8"
            strokeOpacity={0.15}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: 16, fontSize: 11, fontWeight: 600 }}
          />
          <Bar
            dataKey="chits"
            name="Chit Pool Collections"
            fill="url(#chitCollectionGrad)"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="loans"
            name="Loan Repayments"
            fill="url(#loanCollectionGrad)"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
