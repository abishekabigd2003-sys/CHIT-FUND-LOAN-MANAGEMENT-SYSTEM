'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, FolderOpen } from 'lucide-react';
import { useCustomerDocuments } from '@/hooks/useCustomers';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploaderModal } from '@/components/documents/DocumentUploaderModal';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CustomerDocumentsPage() {
  const params = useParams();
  const customerId = params?.customerId as string;
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const { data: documents = [], isLoading } = useCustomerDocuments(customerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            KYC & Verification Documents
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Identity proofs, signatures, photographs, and income certificates.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploaderOpen(true)}
          leftIcon={<Upload className="w-4 h-4 stroke-[2]" />}
        >
          Upload Document
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={4} cols={5} />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents uploaded yet"
          description="Upload identity proof (Aadhaar/PAN), address proof, or customer signature to complete KYC."
          actionLabel="Upload First Document"
          onAction={() => setIsUploaderOpen(true)}
        />
      ) : (
        <DocumentList documents={documents} />
      )}

      <DocumentUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        customerId={customerId}
      />
    </div>
  );
}
