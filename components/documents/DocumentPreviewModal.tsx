'use client';

import React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DocumentItem } from '@/types/document';
import { formatDate } from '@/lib/utils';

interface DocumentPreviewModalProps {
  document: DocumentItem;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      description={`Uploaded on ${formatDate(document.uploadedAt)} • ${document.type.replace('_', ' ')}`}
      size="xl"
    >
      <div className="space-y-4">
        {/* Document Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Verification Status:</span>
            <Badge
              variant={
                document.status === 'VERIFIED'
                  ? 'success'
                  : document.status === 'REJECTED'
                  ? 'destructive'
                  : 'warning'
              }
              dot
            >
              {document.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in new tab</span>
            </a>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="w-full min-h-[350px] max-h-[500px] flex items-center justify-center bg-slate-100/80 rounded-xl overflow-hidden border border-slate-200">
          {isImage ? (
            <img
              src={document.fileUrl}
              alt={document.title}
              className="max-h-[480px] w-auto object-contain rounded"
            />
          ) : isPdf ? (
            <iframe
              src={`${document.fileUrl}#toolbar=0`}
              className="w-full h-[450px] border-0"
              title={document.title}
            />
          ) : (
            <div className="text-center p-8 space-y-2">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">{document.fileName}</p>
              <p className="text-xs text-slate-500">Binary attachment preview not supported directly in iframe.</p>
              <a href={document.fileUrl} download={document.fileName} className="inline-block mt-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download File
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Document Metadata Footer */}
        <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>File: {document.fileName}</span>
          <span>Verified By: {document.verifiedBy || 'Pending Compliance Team'}</span>
        </div>
      </div>
    </Modal>
  );
}
