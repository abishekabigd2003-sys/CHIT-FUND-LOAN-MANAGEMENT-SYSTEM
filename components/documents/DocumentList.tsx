import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { DocumentItem, DocumentStatus } from '@/types/document';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useUpdateDocumentStatus } from '@/hooks/useDocuments';
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal';
import { useAuth } from '@/providers/AuthProvider';

interface DocumentListProps {
  documents: DocumentItem[];
  allowVerification?: boolean;
}

export function DocumentList({ documents, allowVerification = true }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const updateStatus = useUpdateDocumentStatus();
  const { role } = useAuth();

  const canVerify = allowVerification && (role === 'ADMIN' || role === 'STAFF');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="success" dot>Verified</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" dot>Rejected</Badge>;
      default:
        return <Badge variant="warning" dot>Pending Review</Badge>;
    }
  };

  const handleVerify = (id: string) => {
    updateStatus.mutate({ id, status: 'VERIFIED' });
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Enter reason for document rejection:');
    if (reason) {
      updateStatus.mutate({ id, status: 'REJECTED', rejectionReason: reason });
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>File Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{doc.fileName}</p>
                      {doc.rejectionReason && (
                        <p className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded mt-1">
                          Reason: {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {doc.type.replace('_', ' ')}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="text-xs text-slate-600">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span className="text-slate-400 block text-[11px] uppercase">{doc.mimeType.split('/')[1] || 'FILE'}</span>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(doc.status)}</TableCell>

                <TableCell>
                  <span className="text-xs text-slate-600">{formatDate(doc.uploadedAt)}</span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      className="h-7 px-2 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>

                    {canVerify && doc.status === 'PENDING' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleVerify(doc.id)}
                          className="h-7 px-2 text-xs"
                          title="Approve Document"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(doc.id)}
                          className="h-7 px-2 text-xs"
                          title="Reject Document"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDoc && (
        <DocumentPreviewModal
          document={selectedDoc}
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}
