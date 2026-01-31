'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Check, Loader2, Shield, Database, AlertCircle } from 'lucide-react';
import { uploadDatasetToPinata, UploadResult } from '@/lib/pinata';
import { validateDataset, ValidationResult } from '@/lib/biovalidation';
import { generateZKProof, ZKProof, formatFileSize } from '@/lib/zkproofs';

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
      const validation = await validateDataset(files[0], formData.category);
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
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <Upload
          className={`mx-auto mb-4 h-12 w-12 ${isDragActive ? 'text-purple-400' : 'text-gray-500'}`}
        />
        <p className="text-lg font-medium text-gray-300">
          {isDragActive ? 'Drop files here...' : 'Drag & drop dataset files'}
        </p>
        <p className="mt-2 text-sm text-gray-500">or click to browse • Supports all file types</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </span>
            <span>{formatFileSize(totalSize)} total</span>
          </div>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <File className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="truncate text-sm text-gray-300">{file.name}</span>
                  <span className="flex-shrink-0 text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                {!isProcessing && (
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-500 transition-colors hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Dataset Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., ImageNet Subset - 10K Labeled Images"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your dataset, its contents, and potential use cases..."
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none"
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Price (NEAR)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.1"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">License</label>
          <select
            value={formData.license}
            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
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
      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Steps */}
      {step && (
        <div className="mt-8 space-y-4">
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
            progress={
              step === 'validate' ? progress : step === 'zkproof' || step === 'complete' ? 100 : 0
            }
            detail={validationResult ? `Score: ${validationResult.score}/100` : undefined}
          />
          <StepIndicator
            icon={Shield}
            label="Generating ZK Proof"
            status={step === 'zkproof' ? 'active' : step === 'complete' ? 'complete' : 'pending'}
            progress={step === 'zkproof' ? progress : step === 'complete' ? 100 : 0}
            detail={zkProof ? `Hash: ${zkProof.proofHash.slice(0, 16)}...` : undefined}
          />
        </div>
      )}

      {/* Success Message */}
      {step === 'complete' && uploadResult && (
        <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
          <div className="mb-4 flex items-center gap-3 text-green-400">
            <Check className="h-6 w-6" />
            <span className="text-lg font-semibold">Dataset Ready for Listing!</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Filecoin CID:</span>
              <code className="text-gray-300">{uploadResult.cid}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Validation Score:</span>
              <span className="text-gray-300">{validationResult?.score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ZK Proof:</span>
              <span className="text-green-400">✓ Generated</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing || files.length === 0}
        className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 disabled:shadow-none"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </span>
        ) : step === 'complete' ? (
          'List on Marketplace'
        ) : (
          'Upload & Verify Dataset'
        )}
      </button>
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
      className={`rounded-xl border p-4 ${
        status === 'complete'
          ? 'border-green-500/30 bg-green-500/10'
          : status === 'active'
            ? 'border-purple-500/30 bg-purple-500/10'
            : 'border-gray-700 bg-gray-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            status === 'complete'
              ? 'bg-green-500/20'
              : status === 'active'
                ? 'bg-purple-500/20'
                : 'bg-gray-700/50'
          }`}
        >
          {status === 'complete' ? (
            <Check className="h-5 w-5 text-green-400" />
          ) : status === 'active' ? (
            <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
          ) : (
            <Icon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`font-medium ${
                status === 'complete'
                  ? 'text-green-400'
                  : status === 'active'
                    ? 'text-purple-400'
                    : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            {status === 'active' && (
              <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
            )}
          </div>
          {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
        </div>
      </div>
      {status === 'active' && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
