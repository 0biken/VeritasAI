'use client';

import Link from 'next/link';
import { Download, Shield, CheckCircle, FileText } from 'lucide-react';
import { Dataset, formatNear } from '@/lib/near';
import { getValidationStatus, getValidationBadgeColor } from '@/lib/biovalidation';

interface DatasetCardProps {
  dataset: Dataset;
  compact?: boolean;
}

export function DatasetCard({ dataset, compact = false }: DatasetCardProps) {
  const validationScore = dataset.bio_validated ? 85 : 40;
  const hasZKProof = dataset.zk_proof_hash && dataset.zk_proof_hash !== '0x000';

  const categoryColors: Record<string, string> = {
    'Computer Vision': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Natural Language Processing': 'bg-green-500/20 text-green-400 border-green-500/30',
    Biomedical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Audio: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Genomic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const categoryColor = categoryColors[dataset.category] || categoryColors['Other'];

  if (compact) {
    return (
      <Link
        href={`/dataset/${dataset.id}`}
        className="group block rounded-xl border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-gray-600 hover:bg-gray-800"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-white transition-colors group-hover:text-blue-400">
              {dataset.title}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{dataset.category}</p>
          </div>
          <div className="ml-4 text-right">
            <div className="font-bold text-white">{formatNear(dataset.price)} Ⓝ</div>
            <div className="text-xs text-gray-500">{dataset.downloads} downloads</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/dataset/${dataset.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-800 hover:shadow-xl hover:shadow-purple-500/10"
    >
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${categoryColor}`}>
            {dataset.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {dataset.bio_validated && (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20"
              title="Bio.xyz Validated"
            >
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          )}
          {hasZKProof && (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20"
              title="ZK Verified"
            >
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
          {dataset.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-gray-400">
          {dataset.description}
        </p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span>{dataset.downloads}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{dataset.license}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-700 pt-4">
          <div>
            <div className="text-2xl font-bold text-white">
              {formatNear(dataset.price)} <span className="text-base text-gray-400">NEAR</span>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all group-hover:shadow-lg group-hover:shadow-purple-500/25">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}

// Loading skeleton
export function DatasetCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50">
      <div className="h-24 bg-gray-700/50" />
      <div className="space-y-4 p-5">
        <div className="h-6 w-3/4 rounded bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-700/50" />
          <div className="h-4 w-2/3 rounded bg-gray-700/50" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded bg-gray-700/50" />
          <div className="h-4 w-16 rounded bg-gray-700/50" />
        </div>
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <div className="h-8 w-24 rounded bg-gray-700" />
          <div className="h-10 w-28 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
