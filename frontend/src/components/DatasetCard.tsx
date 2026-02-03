'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Shield, CheckCircle, FileText, Lock } from 'lucide-react';
import { Dataset, formatNear } from '@/lib/near';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DatasetCardProps {
  dataset: Dataset;
  compact?: boolean;
}

export function DatasetCard({ dataset, compact = false }: DatasetCardProps) {
  const hasZKProof = dataset.zk_proof_hash && dataset.zk_proof_hash !== '0x000';

  const categoryColors: Record<string, string> = {
    'Computer Vision': 'bg-primary-start/20 text-primary-start border-primary-start/30',
    'Natural Language Processing': 'bg-validation/20 text-validation border-validation/30',
    Biomedical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Audio: 'bg-accent/20 text-accent border-accent/30',
    Genomic: 'bg-primary-end/20 text-primary-end border-primary-end/30',
    Other: 'bg-white/10 text-white/70 border-white/20',
  };

  const categoryColor = categoryColors[dataset.category] || categoryColors['Other'];

  if (compact) {
    return (
      <Link
        href={`/dataset/${dataset.id}`}
        className="group block rounded-lg border border-white/8 bg-surface-elevated p-4 backdrop-blur-lg transition-all hover:border-primary-start/40 hover:shadow-elevation-md"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-white transition-colors group-hover:text-primary-start">
              {dataset.title}
            </h3>
            <p className="mt-1 text-sm text-white/50">{dataset.category}</p>
          </div>
          <div className="ml-4 text-right">
            <div className="font-bold gradient-text">{formatNear(dataset.price)} Ⓝ</div>
            <div className="text-xs text-white/40">{dataset.downloads} downloads</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/dataset/${dataset.id}`}
      className="group block overflow-hidden rounded-lg border border-white/8 bg-surface-elevated backdrop-blur-lg transition-all duration-300 hover:border-primary-start/40 hover:shadow-elevation-lg hover:-translate-y-1"
    >
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-br from-primary-start/20 via-primary-end/20 to-primary-start/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.2),transparent)]" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('rounded-lg border px-2.5 py-1 text-xs font-medium', categoryColor)}>
            {dataset.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {dataset.bio_validated && (
            <Badge variant="verified" icon={<CheckCircle className="h-3.5 w-3.5" />}>
              Verified
            </Badge>
          )}
          {hasZKProof && (
            <Badge variant="processing" icon={<Lock className="h-3.5 w-3.5" />}>
              ZK
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-white transition-all group-hover:gradient-text">
          {dataset.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-white/60">{dataset.description}</p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-white/40">
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
        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
          <div>
            <div className="text-2xl font-bold gradient-text">
              {formatNear(dataset.price)} <span className="text-base text-white/50">NEAR</span>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-primary-start to-primary-end px-4 py-2 text-sm font-medium text-white shadow-glow-cyan transition-all group-hover:shadow-glow-cyan-lg">
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
    <div className="animate-pulse overflow-hidden rounded-lg border border-white/8 bg-surface-elevated">
      <div className="h-24 bg-surface-high" />
      <div className="space-y-4 p-5">
        <div className="h-6 w-3/4 rounded bg-surface-high" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-surface-base" />
          <div className="h-4 w-2/3 rounded bg-surface-base" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded bg-surface-base" />
          <div className="h-4 w-16 rounded bg-surface-base" />
        </div>
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <div className="h-8 w-24 rounded bg-surface-high" />
          <div className="h-10 w-28 rounded bg-surface-high" />
        </div>
      </div>
    </div>
  );
}
