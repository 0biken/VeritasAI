'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Loader2,
} from 'lucide-react';
import { Dataset, formatNear, isSignedIn, getAccountId, signIn } from '@/lib/near';
import { getValidationStatus, getValidationBadgeColor } from '@/lib/biovalidation';
import { verifyZKProof, formatFileSize } from '@/lib/zkproofs';
import { getPinataService } from '@/lib/pinata';

// Mock dataset data (in production, fetch from NEAR contract)
const mockDatasets: Record<number, Dataset> = {
  0: {
    id: 0,
    owner: 'alice.testnet',
    title: 'ImageNet-1K Subset - 10,000 Labeled Images',
    description: `A carefully curated subset of the ImageNet dataset containing 10,000 high-quality labeled images across 100 diverse categories.

**Contents:**
- 10,000 images in JPEG format (avg 256x256 pixels)
- JSON annotations with class labels and bounding boxes
- Train/validation split (80/20)
- Category distribution balancing

**Use Cases:**
- Transfer learning and model fine-tuning
- Image classification benchmarks
- Computer vision research
- Educational purposes

**Quality Assurance:**
- Manual review of all images
- Verified labels by multiple annotators
- No duplicates or near-duplicates
- EXIF data stripped for privacy`,
    category: 'Computer Vision',
    filecoin_cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    bio_validated: true,
    zk_proof_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    price: '2500000000000000000000000',
    license: 'MIT',
    created_at: Date.now() - 86400000 * 7,
    downloads: 234,
  },
  1: {
    id: 1,
    owner: 'bob.testnet',
    title: 'Medical Imaging - Chest X-ray Dataset',
    description: `Anonymized chest X-ray images with detailed radiologist annotations for AI-assisted diagnosis research.

**Contents:**
- 5,000 chest X-ray images (DICOM format)
- Expert annotations for 14 pathology classes
- Demographic metadata (age, gender)
- Image quality scores

**Classes Included:**
Atelectasis, Cardiomegaly, Consolidation, Edema, Effusion, Emphysema, Fibrosis, Hernia, Infiltration, Mass, Nodule, Pleural Thickening, Pneumonia, Pneumothorax

**Compliance:**
- HIPAA compliant
- IRB approved
- Fully de-identified`,
    category: 'Biomedical',
    filecoin_cid: 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    bio_validated: true,
    zk_proof_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    price: '5000000000000000000000000',
    license: 'CC BY 4.0',
    created_at: Date.now() - 86400000 * 3,
    downloads: 156,
  },
};

export default function DatasetPage() {
  const params = useParams();
  const datasetId = parseInt(params.id as string, 10);

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zkVerified, setZkVerified] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadDataset() {
      setLoading(true);
      // Simulate loading from contract
      await new Promise((r) => setTimeout(r, 500));
      setDataset(mockDatasets[datasetId] || null);
      setLoading(false);
    }

    async function checkAuth() {
      try {
        const signedIn = await isSignedIn();
        if (signedIn) {
          const accountId = await getAccountId();
          setAccount(accountId);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }

    loadDataset();
    checkAuth();
  }, [datasetId]);

  async function handlePurchase() {
    if (!account) {
      await signIn();
      return;
    }

    setPurchasing(true);
    // Simulate purchase
    await new Promise((r) => setTimeout(r, 2000));
    setHasPurchased(true);
    setPurchasing(false);
  }

  async function verifyProof() {
    if (!dataset) return;

    // Simulate ZK proof verification
    setZkVerified(null);
    await new Promise((r) => setTimeout(r, 1500));
    setZkVerified(dataset.zk_proof_hash !== '0x000');
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Dataset Not Found</h1>
          <p className="mb-8 text-gray-400">
            The dataset you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white hover:bg-purple-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const validationScore = dataset.bio_validated ? 85 : 40;
  const gatewayUrl = getPinataService().getGatewayUrl(dataset.filecoin_cid);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-400">
                  {dataset.category}
                </span>
                {dataset.bio_validated && (
                  <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Bio.xyz Verified
                  </span>
                )}
                {dataset.zk_proof_hash !== '0x000' && (
                  <span className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-400">
                    <Shield className="h-4 w-4" />
                    ZK Proof
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{dataset.title}</h1>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Description</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                {dataset.description.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 text-gray-300">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Provenance Information */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Provenance</h2>

              <div className="space-y-4">
                {/* Filecoin CID */}
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Filecoin CID</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-x-auto rounded-lg bg-gray-900 px-4 py-2 font-mono text-sm text-gray-300">
                      {dataset.filecoin_cid}
                    </code>
                    <button
                      onClick={() => copyToClipboard(dataset.filecoin_cid)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                      title="Copy CID"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                    <a
                      href={gatewayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                      title="View on IPFS"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* ZK Proof */}
                <div>
                  <label className="mb-1 block text-sm text-gray-400">ZK Proof Hash</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-x-auto rounded-lg bg-gray-900 px-4 py-2 font-mono text-sm text-gray-300">
                      {dataset.zk_proof_hash}
                    </code>
                    <button
                      onClick={verifyProof}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500"
                    >
                      {zkVerified === null ? 'Verify' : zkVerified ? '✓ Valid' : '✗ Invalid'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <div className="mb-6 text-center">
                <div className="text-4xl font-bold text-white">
                  {formatNear(dataset.price)} <span className="text-xl text-gray-400">NEAR</span>
                </div>
              </div>

              {hasPurchased ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-400" />
                    <p className="font-medium text-green-400">Purchase Complete!</p>
                  </div>
                  <a
                    href={gatewayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white"
                  >
                    <Download className="h-5 w-5" />
                    Download Dataset
                  </a>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-semibold text-white transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700"
                >
                  {purchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : account ? (
                    'Purchase with NEAR'
                  ) : (
                    'Connect Wallet to Purchase'
                  )}
                </button>
              )}

              <p className="mt-4 text-center text-xs text-gray-500">
                Secure payment via NEAR Protocol
              </p>
            </div>

            {/* Metadata */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <h3 className="mb-4 font-semibold text-white">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400">Provider:</span>
                  <span className="text-white">{dataset.owner}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400">License:</span>
                  <span className="text-white">{dataset.license}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400">Downloads:</span>
                  <span className="text-white">{dataset.downloads}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400">Listed:</span>
                  <span className="text-white">
                    {new Date(dataset.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <h3 className="mb-4 font-semibold text-white">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Filecoin Storage</span>
                  <span className="text-sm text-green-400">✓ Stored</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Bio.xyz Validation</span>
                  <span
                    className={`text-sm ${dataset.bio_validated ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    {dataset.bio_validated ? '✓ Verified' : '○ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">ZK Proof</span>
                  <span
                    className={`text-sm ${dataset.zk_proof_hash !== '0x000' ? 'text-purple-400' : 'text-gray-500'}`}
                  >
                    {dataset.zk_proof_hash !== '0x000' ? '✓ Generated' : '○ None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
