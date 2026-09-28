import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  onReset: () => void;
}

export function CustomerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onReset,
}: CustomerFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <div className="flex-1 w-full sm:max-w-md">
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone, customer code (CUST-), or email..."
          startIcon={<Search className="w-4 h-4" />}
          className="h-9.5 text-xs"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <div className="flex-1 sm:w-44">
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Pending KYC', value: 'PENDING' },
              { label: 'Suspended', value: 'SUSPENDED' },
            ]}
            className="h-9.5 text-xs py-1"
          />
        </div>

        {(search || (status && status !== 'ALL')) && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9.5 px-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
