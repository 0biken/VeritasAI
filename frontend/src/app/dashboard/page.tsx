'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Download,
  DollarSign,
  Database,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { isSignedIn, getAccountId, signIn, formatNear } from '@/lib/near';
import { DatasetCard } from '@/components/DatasetCard';

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
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const signedIn = await isSignedIn();
      if (signedIn) {
        const accountId = await getAccountId();
        setAccount(accountId);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8">
            <Wallet className="mx-auto mb-6 h-16 w-16 text-gray-500" />
            <h1 className="mb-4 text-2xl font-bold text-white">Provider Dashboard</h1>
            <p className="mb-8 text-gray-400">
              Connect your NEAR wallet to view your datasets, earnings, and analytics.
            </p>
            <button
              onClick={handleConnect}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-semibold text-white hover:from-blue-500 hover:to-purple-500"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
            <p className="mt-1 text-gray-400">
              Welcome back, <span className="text-purple-400">{account}</span>
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white hover:from-blue-500 hover:to-purple-500"
          >
            <Database className="h-5 w-5" />
            Upload New Dataset
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                +12.5%
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatNear(mockProviderData.totalEarnings)} Ⓝ
            </div>
            <div className="mt-1 text-sm text-gray-400">Total Earnings</div>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatNear(mockProviderData.thisMonth)} Ⓝ
            </div>
            <div className="mt-1 text-sm text-gray-400">This Month</div>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <Download className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{mockProviderData.totalDownloads}</div>
            <div className="mt-1 text-sm text-gray-400">Total Downloads</div>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
                <Database className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{mockProviderData.totalDatasets}</div>
            <div className="mt-1 text-sm text-gray-400">Active Datasets</div>
          </div>
        </div>

        {/* Your Datasets */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Your Datasets</h2>
            <Link
              href="/marketplace"
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
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
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-white">Recent Activity</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50">
            <div className="divide-y divide-gray-700">
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
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        activity.type === 'purchase' ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}
                    >
                      {activity.type === 'purchase' ? (
                        <DollarSign className="h-5 w-5 text-green-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {activity.type === 'purchase' ? 'New Purchase' : 'Dataset Viewed'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {activity.buyer} • {activity.dataset}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <div className="font-medium text-green-400">+{activity.amount} Ⓝ</div>
                    )}
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
