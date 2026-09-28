'use client';

import React, { useState } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DocumentType } from '@/types/document';
import { useUploadDocument } from '@/hooks/useDocuments';

interface DocumentUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  defaultType?: DocumentType;
}

export function DocumentUploaderModal({
  isOpen,
  onClose,
  customerId,
  defaultType = 'IDENTITY_PROOF',
}: DocumentUploaderModalProps) {
  const [type, setType] = useState<DocumentType>(defaultType);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useUploadDocument();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('Maximum file size allowed is 10 MB');
        return;
      }
      setFile(selected);
      setError(null);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a document title');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        customerId,
        type,
        title,
        file,
      });
      setFile(null);
      setTitle('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Compliance Document"
      description="Attach KYC identity proof, address proof, or loan collateral document."
      size="md"
    >
      <form onSubmit={handleUpload} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Select
          label="Document Category"
          required
          value={type}
          onChange={(e) => setType(e.target.value as DocumentType)}
          options={[
            { label: 'Identity Proof (Aadhaar / Voter ID)', value: 'IDENTITY_PROOF' },
            { label: 'Address Proof (EB Bill / Rental Deed)', value: 'ADDRESS_PROOF' },
            { label: 'Customer Photograph', value: 'PHOTO' },
            { label: 'Specimen Signature', value: 'SIGNATURE' },
            { label: 'Income Proof / ITR Copy', value: 'INCOME_PROOF' },
            { label: 'Loan Collateral Paper / RC Book', value: 'COLLATERAL_DOCUMENT' },
            { label: 'Other Regulatory File', value: 'OTHER' },
          ]}
        />

        <Input
          label="Document Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Aadhaar Card Front & Back"
        />

        {/* Drag & Drop File Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
            File Attachment <span className="text-rose-500">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50 dark:bg-slate-850/50">
            {file ? (
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <File className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Click to browse or drag file here
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supported formats: PDF, JPG, PNG, WEBP (Max 10 MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  className="hidden"
                  id="doc-file-input"
                />
                <label
                  htmlFor="doc-file-input"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={uploadMutation.isPending}
          >
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
}
