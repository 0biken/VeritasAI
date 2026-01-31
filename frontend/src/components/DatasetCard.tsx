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
        'Biomedical': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Audio': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Genomic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const categoryColor = categoryColors[dataset.category] || categoryColors['Other'];

    if (compact) {
        return (
            <Link
                href={`/dataset/${dataset.id}`}
                className="block p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                            {dataset.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{dataset.category}</p>
                    </div>
                    <div className="text-right ml-4">
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
            className="block bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-xl hover:shadow-purple-500/10"
        >
            {/* Header with gradient */}
            <div className="h-24 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent)]" />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${categoryColor}`}>
                        {dataset.category}
                    </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                    {dataset.bio_validated && (
                        <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center" title="Bio.xyz Validated">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                    )}
                    {hasZKProof && (
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center" title="ZK Verified">
                            <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {dataset.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {dataset.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        <span>{dataset.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>{dataset.license}</span>
                    </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-700">
                    <div>
                        <div className="text-2xl font-bold text-white">
                            {formatNear(dataset.price)} <span className="text-base text-gray-400">NEAR</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-sm font-medium group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all">
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
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-24 bg-gray-700/50" />
            <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-full" />
                    <div className="h-4 bg-gray-700/50 rounded w-2/3" />
                </div>
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-700/50 rounded w-16" />
                    <div className="h-4 bg-gray-700/50 rounded w-16" />
                </div>
                <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-24" />
                    <div className="h-10 bg-gray-700 rounded w-28" />
                </div>
            </div>
        </div>
    );
}
