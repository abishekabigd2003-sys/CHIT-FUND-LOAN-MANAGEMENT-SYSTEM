'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface DistributionItem {
  name: string;
  value: number;
  amount: number;
  color: string;
}

export function LoanDistributionChart({ data }: { data: DistributionItem[] }) {
  const totalLoansCount = data.reduce((sum, item) => sum + item.value, 0);
  const totalPortfolioAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = totalPortfolioAmount > 0 ? Math.round((item.amount / totalPortfolioAmount) * 100) : 0;

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/60 dark:border-slate-800 text-xs min-w-[190px] animate-in fade-in-0 duration-150">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-bold text-slate-100 text-xs">{item.name}</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>Active Accounts:</span>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Portfolio Allocation:</span>
              <span className="font-semibold text-emerald-400">{pct}%</span>
            </div>
            <div className="border-t border-slate-800/80 pt-1 mt-1 flex items-center justify-between text-slate-300 font-bold">
              <span>Exposure:</span>
              <span className="text-white">{formatCurrency(item.amount)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Chart container with center stats */}
      <div className="relative w-full h-52 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  className="transition-opacity hover:opacity-85"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Donut Center Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Portfolio
          </span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
            {totalLoansCount}
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
            Active Loans
          </span>
        </div>
      </div>

      {/* Structured Legend Grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {data.map((item) => {
          const pct = totalPortfolioAmount > 0 ? Math.round((item.amount / totalPortfolioAmount) * 100) : 0;
          return (
            <div
              key={item.name}
              className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: item.color }}
                />
                <div className="truncate">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
