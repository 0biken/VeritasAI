'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Download,
  DollarSign,
  Database,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { formatNear } from '@/lib/near';
import { DatasetCard } from '@/components/DatasetCard';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Mock provider data
const mockProviderData = {
  totalEarnings: '45600000000000000000000000', // 45.6 NEAR
  thisMonth: '12300000000000000000000000', // 12.3 NEAR
  totalDownloads: 547,
  totalDatasets: 8,
  datasets: [
    {
      id: 0,
      owner: 'you.testnet',
      title: 'ImageNet-1K Subset',
      description: 'Curated subset of ImageNet with 10,000 labeled images',
      category: 'Computer Vision',
      filecoin_cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
      bio_validated: true,
      zk_proof_hash: '0x1234567890abcdef',
      price: '2500000000000000000000000',
      license: 'MIT',
      created_at: Date.now() - 86400000 * 7,
      downloads: 234,
    },
    {
      id: 1,
      owner: 'you.testnet',
      title: 'Audio Speech Dataset',
      description: '500 hours of transcribed speech recordings',
      category: 'Audio',
      filecoin_cid: 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
      bio_validated: false,
      zk_proof_hash: '0xabcdef1234567890',
      price: '1800000000000000000000000',
      license: 'CC BY 4.0',
      created_at: Date.now() - 86400000 * 14,
      downloads: 89,
    },
  ],
};

export default function DashboardPage() {
  const { accountId, isSignedIn, isLoading, signIn } = useWallet();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-start border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-lg border border-white/8 bg-surface-elevated p-8 backdrop-blur-lg">
            <Wallet className="mx-auto mb-6 h-16 w-16 text-white/30" />
            <h1 className="mb-4 text-2xl font-bold text-white">Provider Dashboard</h1>
            <p className="mb-8 text-white/60">
              Connect your NEAR wallet to view your datasets, earnings, and analytics.
            </p>
            <Button onClick={signIn} className="w-full">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
            <p className="mt-1 text-white/60">
              Welcome back, <span className="text-primary-start">{accountId}</span>
            </p>
          </div>
          <Link href="/upload">
            <Button leftIcon={<Database className="h-5 w-5" />}>Upload New Dataset</Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: DollarSign,
              value: formatNear(mockProviderData.totalEarnings),
              label: 'Total Earnings',
              color: 'validation',
              trend: '+12.5%',
            },
            {
              icon: TrendingUp,
              value: formatNear(mockProviderData.thisMonth),
              label: 'This Month',
              color: 'primary-start',
            },
            {
              icon: Download,
              value: mockProviderData.totalDownloads,
              label: 'Total Downloads',
              color: 'primary-end',
            },
            {
              icon: Database,
              value: mockProviderData.totalDatasets,
              label: 'Active Datasets',
              color: 'accent',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg',
                    stat.color === 'validation' && 'bg-validation/20',
                    stat.color === 'primary-start' && 'bg-primary-start/20',
                    stat.color === 'primary-end' && 'bg-primary-end/20',
                    stat.color === 'accent' && 'bg-accent/20'
                  )}
                >
                  <stat.icon
                    className={cn(
                      'h-6 w-6',
                      stat.color === 'validation' && 'text-validation',
                      stat.color === 'primary-start' && 'text-primary-start',
                      stat.color === 'primary-end' && 'text-primary-end',
                      stat.color === 'accent' && 'text-accent'
                    )}
                  />
                </div>
                {stat.trend && (
                  <span className="rounded-lg bg-validation/20 px-2 py-1 text-xs font-medium text-validation">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold gradient-text">{stat.value} Ⓝ</div>
              <div className="mt-1 text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Datasets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Your Datasets</h2>
            <Link
              href="/marketplace"
              className="flex items-center gap-1 text-sm text-primary-start hover:text-primary-start/80 transition-colors"
            >
              View in Marketplace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {mockProviderData.datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">Recent Activity</h2>
          <div className="overflow-hidden rounded-lg border border-white/8 bg-surface-elevated backdrop-blur-lg">
            <div className="divide-y divide-white/8">
              {[
                {
                  type: 'purchase',
                  dataset: 'ImageNet-1K Subset',
                  buyer: 'alice.testnet',
                  amount: '2.5',
                  time: '2 hours ago',
                },
                {
                  type: 'purchase',
                  dataset: 'Audio Speech Dataset',
                  buyer: 'bob.testnet',
                  amount: '1.8',
                  time: '5 hours ago',
                },
                {
                  type: 'view',
                  dataset: 'ImageNet-1K Subset',
                  buyer: 'carol.testnet',
                  amount: null,
                  time: '1 day ago',
                },
                {
                  type: 'purchase',
                  dataset: 'ImageNet-1K Subset',
                  buyer: 'dave.testnet',
                  amount: '2.5',
                  time: '2 days ago',
                },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-surface-base transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        activity.type === 'purchase' ? 'bg-validation/20' : 'bg-primary-start/20'
                      )}
                    >
                      {activity.type === 'purchase' ? (
                        <DollarSign className="h-5 w-5 text-validation" />
                      ) : (
                        <Eye className="h-5 w-5 text-primary-start" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {activity.type === 'purchase' ? 'New Purchase' : 'Dataset Viewed'}
                      </div>
                      <div className="text-sm text-white/50">
                        {activity.buyer} • {activity.dataset}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <div className="font-medium text-validation">+{activity.amount} Ⓝ</div>
                    )}
                    <div className="text-sm text-white/40">{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
