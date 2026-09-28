'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentRecord } from '@/types/payment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export function PaymentScheduleCalendar({ payments }: { payments: PaymentRecord[] }) {
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed: 8)
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState<string | null>('2024-09-15');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group payments by day
  const paymentsByDate: Record<number, PaymentRecord[]> = {};
  payments.forEach((p) => {
    const d = new Date(p.dueDate || p.paidDate || '');
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      if (!paymentsByDate[day]) paymentsByDate[day] = [];
      paymentsByDate[day].push(p);
    }
  });

  const selectedDayPayments = selectedDate
    ? payments.filter((p) => (p.dueDate || p.paidDate) === selectedDate)
    : [];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <CardTitle>{monthNames[currentMonth]} {currentYear}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg bg-slate-50/50 dark:bg-slate-850/50 border border-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayPayments = paymentsByDate[day] || [];
              const isSelected = selectedDate === dateStr;

              const hasOverdue = dayPayments.some((p) => p.status === 'OVERDUE');
              const hasPaid = dayPayments.some((p) => p.status === 'PAID');
              const hasPending = dayPayments.some((p) => p.status === 'PENDING' || p.status === 'PARTIALLY_PAID');

              const totalAmount = dayPayments.reduce((acc, p) => acc + (p.amountDue || p.amountPaid), 0);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 p-1.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 dark:border-brand-400 bg-brand-50/60 dark:bg-brand-950/60 ring-2 ring-brand-200 dark:ring-brand-800'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {day}
                    </span>
                    {dayPayments.length > 0 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-semibold">
                        {dayPayments.length}
                      </span>
                    )}
                  </div>

                  {dayPayments.length > 0 && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-900 block truncate">
                        {formatCurrency(totalAmount)}
                      </span>
                      <div className="flex items-center gap-1">
                        {hasPaid && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Paid" />}
                        {hasPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Pending" />}
                        {hasOverdue && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Overdue" />}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Agenda Drawer */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">
            {selectedDate ? formatDate(selectedDate, 'EEEE, dd MMMM yyyy') : 'Select a date'}
          </CardTitle>
          <p className="text-xs text-slate-500">
            {selectedDayPayments.length} transactions scheduled or recorded
          </p>
        </CardHeader>
        <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
          {selectedDayPayments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No payments or dues scheduled on this date.
            </div>
          ) : (
            selectedDayPayments.map((p) => (
              <div key={p.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{p.customerName}</span>
                  <Badge
                    variant={p.status === 'PAID' ? 'success' : p.status === 'OVERDUE' ? 'destructive' : 'warning'}
                    className="text-[10px]"
                  >
                    {p.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{p.category === 'LOAN_EMI' ? 'Loan EMI' : 'Chit Installment'}</span>
                  <span className="font-mono text-slate-600">{p.referenceCode}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(p.amountDue || p.amountPaid)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
