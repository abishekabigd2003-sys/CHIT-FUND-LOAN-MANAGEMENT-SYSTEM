'use client';

import React, { useState } from 'react';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { ListTodo, Search, Filter } from 'lucide-react';

export default function CollectionTasksPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasks = [], isLoading } = useCollectionTasks({
    status: statusFilter,
    priority: priorityFilter,
    search: searchQuery,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <ListTodo className="w-6 h-6 text-blue-600" />
            Collection Tasks Roster
          </h1>
          <p className="page-subtitle">
            Full queue of daily doorstep visits, calling lists, and customer follow-up actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, loan #, or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100"
          >
            <option value="ALL">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FOLLOW_UP">Follow-Up Required</option>
            <option value="COLLECTED">Collected</option>
            <option value="ESCALATED">Escalated</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <CollectionTaskTable tasks={tasks} isLoading={isLoading} />
    </div>
  );
}
