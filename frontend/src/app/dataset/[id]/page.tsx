'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Copy,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Lock,
} from 'lucide-react';
import { Dataset, formatNear } from '@/lib/near';
import { getPinataService } from '@/lib/pinata';
import { useWallet } from '@/contexts/WalletContext';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

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
  const { accountId, isSignedIn, signIn } = useWallet();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
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

    loadDataset();
  }, [datasetId]);

  async function handlePurchase() {
    if (!isSignedIn) {
      signIn();
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-start border-t-transparent" />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Dataset Not Found</h1>
          <p className="mb-8 text-white/60">
            The dataset you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/marketplace">
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gatewayUrl = getPinataService().getGatewayUrl(dataset.filecoin_cid);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 lg:col-span-2"
          >
            {/* Header */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-lg border border-primary-start/30 bg-primary-start/20 px-3 py-1 text-sm font-medium text-primary-start">
                  {dataset.category}
                </span>
                {dataset.bio_validated && (
                  <Badge variant="verified" icon={<CheckCircle className="h-4 w-4" />}>
                    Bio.xyz Verified
                  </Badge>
                )}
                {dataset.zk_proof_hash !== '0x000' && (
                  <Badge variant="processing" icon={<Lock className="h-4 w-4" />}>
                    ZK Proof
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{dataset.title}</h1>
            </div>

            {/* Description */}
            <div className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold text-white">Description</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                {dataset.description.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 text-white/70">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Provenance Information */}
            <div className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold text-white">Provenance</h2>

              <div className="space-y-4">
                {/* Filecoin CID */}
                <div>
                  <label className="mb-1 block text-sm text-white/50">Filecoin CID</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-x-auto rounded-lg bg-surface-base px-4 py-2 font-mono text-sm text-white/80">
                      {dataset.filecoin_cid}
                    </code>
                    <button
                      onClick={() => copyToClipboard(dataset.filecoin_cid)}
                      className="rounded-lg p-2 text-white/50 hover:bg-surface-base hover:text-white transition-colors"
                      title="Copy CID"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-validation" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                    <a
                      href={gatewayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-white/50 hover:bg-surface-base hover:text-white transition-colors"
                      title="View on IPFS"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* ZK Proof */}
                <div>
                  <label className="mb-1 block text-sm text-white/50">ZK Proof Hash</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-x-auto rounded-lg bg-surface-base px-4 py-2 font-mono text-sm text-white/80">
                      {dataset.zk_proof_hash}
                    </code>
                    <Button onClick={verifyProof} size="sm" variant="secondary">
                      {zkVerified === null ? 'Verify' : zkVerified ? '✓ Valid' : '✗ Invalid'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Purchase Card */}
            <div className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg">
              <div className="mb-6 text-center">
                <div className="text-4xl font-bold gradient-text">
                  {formatNear(dataset.price)} <span className="text-xl text-white/50">NEAR</span>
                </div>
              </div>

              {hasPurchased ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-validation/30 bg-validation/10 p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-validation" />
                    <p className="font-medium text-validation">Purchase Complete!</p>
                  </div>
                  <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" leftIcon={<Download className="h-5 w-5" />}>
                      Download Dataset
                    </Button>
                  </a>
                </div>
              ) : (
                <Button
                  onClick={handlePurchase}
                  loading={purchasing}
                  disabled={purchasing}
                  className="w-full"
                  size="lg"
                >
                  {isSignedIn ? 'Purchase with NEAR' : 'Connect Wallet to Purchase'}
                </Button>
              )}

              <p className="mt-4 text-center text-xs text-white/40">
                Secure payment via NEAR Protocol
              </p>
            </div>

            {/* Metadata */}
            <div className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg">
              <h3 className="mb-4 font-semibold text-white">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-white/40" />
                  <span className="text-white/50">Provider:</span>
                  <span className="text-white">{dataset.owner}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-white/40" />
                  <span className="text-white/50">License:</span>
                  <span className="text-white">{dataset.license}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-white/40" />
                  <span className="text-white/50">Downloads:</span>
                  <span className="text-white">{dataset.downloads}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-white/40" />
                  <span className="text-white/50">Listed:</span>
                  <span className="text-white">
                    {new Date(dataset.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg">
              <h3 className="mb-4 font-semibold text-white">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Filecoin Storage</span>
                  <span className="text-sm text-validation">✓ Stored</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Bio.xyz Validation</span>
                  <span className={cn('text-sm', dataset.bio_validated ? 'text-validation' : 'text-white/40')}>
                    {dataset.bio_validated ? '✓ Verified' : '○ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">ZK Proof</span>
                  <span
                    className={cn(
                      'text-sm',
                      dataset.zk_proof_hash !== '0x000' ? 'text-primary-start' : 'text-white/40'
                    )}
                  >
                    {dataset.zk_proof_hash !== '0x000' ? '✓ Generated' : '○ None'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
