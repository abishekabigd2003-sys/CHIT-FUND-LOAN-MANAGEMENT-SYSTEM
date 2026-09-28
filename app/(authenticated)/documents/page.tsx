'use client';

import React, { useState } from 'react';
import { Upload, FolderOpen, Filter, Search, RotateCcw } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploaderModal } from '@/components/documents/DocumentUploaderModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GlobalDocumentsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const { data: documents = [], isLoading } = useDocuments({
    status: status === 'ALL' ? undefined : status,
    type: type === 'ALL' ? undefined : type,
  });

  const filteredDocs = search
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.fileName.toLowerCase().includes(search.toLowerCase()) ||
          (d.customerName && d.customerName.toLowerCase().includes(search.toLowerCase()))
      )
    : documents;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Document Repository & KYC Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized document verification queue for customer IDs, address proofs, signatures, and collateral certificates.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploaderOpen(true)}
          className="gap-1.5 text-xs shadow-2xs"
          leftIcon={<Upload className="w-3.5 h-3.5" />}
        >
          Upload File
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex-1 w-full sm:max-w-xs">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, customer, or filename..."
            startIcon={<Search className="w-4 h-4" />}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="w-36">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Verified', value: 'VERIFIED' },
                { label: 'Pending Review', value: 'PENDING' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>

          <div className="w-44">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { label: 'All Document Types', value: 'ALL' },
                { label: 'Identity Proof', value: 'IDENTITY_PROOF' },
                { label: 'Address Proof', value: 'ADDRESS_PROOF' },
                { label: 'Photographs', value: 'PHOTO' },
                { label: 'Signatures', value: 'SIGNATURE' },
                { label: 'Income Proof', value: 'INCOME_PROOF' },
                { label: 'Collateral Paper', value: 'COLLATERAL_DOCUMENT' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>

          {(search || status !== 'ALL' || type !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatus('ALL');
                setType('ALL');
              }}
              className="h-9 text-xs text-slate-500"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Document Grid / Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={5} cols={6} />
        </div>
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents found"
          description="There are no documents matching the selected filters."
        />
      ) : (
        <DocumentList documents={filteredDocs} allowVerification={true} />
      )}

      <DocumentUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        customerId="cust-001"
      />
    </div>
  );
}

