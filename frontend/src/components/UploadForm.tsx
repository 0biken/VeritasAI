'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check, Loader2, Shield, Database, AlertCircle } from 'lucide-react';
import { uploadDatasetToPinata, UploadResult } from '@/lib/pinata';
import { validateDataset, ValidationResult } from '@/lib/biovalidation';
import { generateZKProof, ZKProof } from '@/lib/zkproofs';
import { Button, Input } from '@/components/ui';
import { cn, formatFileSize } from '@/lib/utils';

interface UploadFormProps {
  onComplete?: (result: {
    cid: string;
    validation: ValidationResult;
    zkProof: ZKProof;
    metadata: FormData;
  }) => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  price: string;
  license: string;
}

type UploadStep = 'upload' | 'validate' | 'zkproof' | 'complete';

export function UploadForm({ onComplete }: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Computer Vision',
    price: '1',
    license: 'MIT',
  });

  const [step, setStep] = useState<UploadStep | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [zkProof, setZkProof] = useState<ZKProof | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setError(null);

    try {
      // Step 1: Upload to Pinata/Filecoin
      setStep('upload');
      setProgress(0);
      const pinataResult = await uploadDatasetToPinata(files, formData.title, setProgress);
      setUploadResult(pinataResult);

      // Step 2: Bio.xyz Validation
      setStep('validate');
      setProgress(0);
      const validation = await validateDataset(files[0]);
      setValidationResult(validation);
      setProgress(100);

      // Step 3: Generate ZK Proof
      setStep('zkproof');
      setProgress(0);
      const proof = await generateZKProof(files, validation.score);
      setZkProof(proof);
      setProgress(100);

      // Complete
      setStep('complete');

      if (onComplete) {
        onComplete({
          cid: pinataResult.cid,
          validation,
          zkProof: proof,
          metadata: formData,
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setStep(null);
    }
  };

  const isProcessing = step !== null && step !== 'complete';

  return (
    <div className="mx-auto max-w-2xl">
      {/* File Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300',
          'bg-surface-base backdrop-blur-sm',
          isDragActive
            ? 'border-validation bg-validation/5 scale-[1.02]'
            : 'border-white/20 hover:border-primary-start hover:bg-primary-start/5',
          isProcessing && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <Upload
          className={cn(
            'mx-auto mb-4 h-12 w-12 transition-colors',
            isDragActive ? 'text-validation' : 'text-white/30'
          )}
        />
        <p className="text-lg font-medium text-white/90">
          {isDragActive ? 'Drop files here...' : 'Drag & drop dataset files'}
        </p>
        <p className="mt-2 text-sm text-white/50">or click to browse • Supports all file types</p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-2"
          >
            <div className="flex items-center justify-between text-sm text-white/50">
              <span>
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </span>
              <span>{formatFileSize(totalSize)} total</span>
            </div>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-surface-elevated p-3 backdrop-blur-lg"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-start/20">
                      <File className="h-4 w-4 text-primary-start" />
                    </div>
                    <div>
                      <span className="truncate text-sm text-white/90">{file.name}</span>
                      <span className="ml-2 text-xs text-white/40">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-white/40 transition-colors hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metadata Form */}
      <div className="mt-8 space-y-5">
        <Input
          label="Dataset Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., ImageNet Subset - 10K Labeled Images"
          disabled={isProcessing}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-white/90">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your dataset, its contents, and potential use cases..."
            rows={4}
            className="w-full resize-none rounded-lg border border-white/10 bg-surface-base px-4 py-3 text-white placeholder:text-white/30 transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none disabled:opacity-50"
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-surface-base px-4 py-3 text-white transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none disabled:opacity-50"
              disabled={isProcessing}
            >
              <option>Computer Vision</option>
              <option>Natural Language Processing</option>
              <option>Biomedical</option>
              <option>Genomic</option>
              <option>Audio</option>
              <option>Other</option>
            </select>
          </div>

          <Input
            label="Price (NEAR)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            min="0"
            step="0.1"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/90">License</label>
          <select
            value={formData.license}
            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface-base px-4 py-3 text-white transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none disabled:opacity-50"
            disabled={isProcessing}
          >
            <option>MIT</option>
            <option>Apache-2.0</option>
            <option>CC BY 4.0</option>
            <option>CC BY-SA 4.0</option>
            <option>CC0 (Public Domain)</option>
            <option>Custom</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <AnimatePresence>
        {step && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 space-y-4"
          >
            <StepIndicator
              icon={Upload}
              label="Uploading to Filecoin"
              status={
                step === 'upload'
                  ? 'active'
                  : step === 'validate' || step === 'zkproof' || step === 'complete'
                    ? 'complete'
                    : 'pending'
              }
              progress={step === 'upload' ? progress : 100}
              detail={uploadResult ? `CID: ${uploadResult.cid.slice(0, 16)}...` : undefined}
            />
            <StepIndicator
              icon={Database}
              label="Bio.xyz Validation"
              status={
                step === 'validate'
                  ? 'active'
                  : step === 'zkproof' || step === 'complete'
                    ? 'complete'
                    : 'pending'
              }
              progress={step === 'validate' ? progress : step === 'zkproof' || step === 'complete' ? 100 : 0}
              detail={validationResult ? `Score: ${validationResult.score}/100` : undefined}
            />
            <StepIndicator
              icon={Shield}
              label="Generating ZK Proof"
              status={step === 'zkproof' ? 'active' : step === 'complete' ? 'complete' : 'pending'}
              progress={step === 'zkproof' ? progress : step === 'complete' ? 100 : 0}
              detail={zkProof ? `Hash: ${zkProof.proofHash.slice(0, 16)}...` : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {step === 'complete' && uploadResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-lg border border-validation/30 bg-validation/10 p-6"
          >
            <div className="mb-4 flex items-center gap-3 text-validation">
              <Check className="h-6 w-6" />
              <span className="text-lg font-semibold">Dataset Ready for Listing!</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Filecoin CID:</span>
                <code className="text-white/90 font-mono">{uploadResult.cid}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Validation Score:</span>
                <span className="text-white/90">{validationResult?.score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">ZK Proof:</span>
                <span className="text-validation">✓ Generated</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isProcessing || files.length === 0}
        loading={isProcessing}
        className="mt-8 w-full py-4 text-lg"
        size="lg"
      >
        {isProcessing
          ? 'Processing...'
          : step === 'complete'
            ? 'List on Marketplace'
            : 'Upload & Verify Dataset'}
      </Button>
    </div>
  );
}

// Step indicator component
function StepIndicator({
  icon: Icon,
  label,
  status,
  progress,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: 'pending' | 'active' | 'complete';
  progress: number;
  detail?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 backdrop-blur-lg transition-all',
        status === 'complete'
          ? 'border-validation/30 bg-validation/10'
          : status === 'active'
            ? 'border-primary-start/30 bg-primary-start/10'
            : 'border-white/10 bg-surface-elevated'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            status === 'complete'
              ? 'bg-validation/20'
              : status === 'active'
                ? 'bg-primary-start/20'
                : 'bg-surface-high'
          )}
        >
          {status === 'complete' ? (
            <Check className="h-5 w-5 text-validation" />
          ) : status === 'active' ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary-start" />
          ) : (
            <Icon className="h-5 w-5 text-white/40" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'font-medium',
                status === 'complete'
                  ? 'text-validation'
                  : status === 'active'
                    ? 'text-primary-start'
                    : 'text-white/40'
              )}
            >
              {label}
            </span>
            {status === 'active' && <span className="text-sm text-primary-start">{Math.round(progress)}%</span>}
          </div>
          {detail && <p className="mt-1 text-xs text-white/40 font-mono">{detail}</p>}
        </div>
      </div>
      {status === 'active' && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-high">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-primary-start to-primary-end rounded-full"
          />
        </div>
      )}
    </div>
  );
}
