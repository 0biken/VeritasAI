'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, Download, DollarSign, Database, ArrowUpRight, Eye } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!account) {
        return (
            <div className="min-h-screen py-12">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="p-8 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-white mb-4">
                            Provider Dashboard
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Connect your NEAR wallet to view your datasets, earnings, and analytics.
                        </p>
                        <button
                            onClick={handleConnect}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
                        <p className="mt-1 text-gray-400">
                            Welcome back, <span className="text-purple-400">{account}</span>
                        </p>
                    </div>
                    <Link
                        href="/upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium"
                    >
                        <Database className="w-5 h-5" />
                        Upload New Dataset
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                                +12.5%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {formatNear(mockProviderData.totalEarnings)} Ⓝ
                        </div>
                        <div className="text-sm text-gray-400 mt-1">Total Earnings</div>
                    </div>

                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {formatNear(mockProviderData.thisMonth)} Ⓝ
                        </div>
                        <div className="text-sm text-gray-400 mt-1">This Month</div>
                    </div>

                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Download className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {mockProviderData.totalDownloads}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">Total Downloads</div>
                    </div>

                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <Database className="w-6 h-6 text-orange-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {mockProviderData.totalDatasets}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">Active Datasets</div>
                    </div>
                </div>

                {/* Your Datasets */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Your Datasets</h2>
                        <Link
                            href="/marketplace"
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                            View in Marketplace
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockProviderData.datasets.map((dataset) => (
                            <DatasetCard key={dataset.id} dataset={dataset} />
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-gray-700">
                            {[
                                { type: 'purchase', dataset: 'ImageNet-1K Subset', buyer: 'alice.testnet', amount: '2.5', time: '2 hours ago' },
                                { type: 'purchase', dataset: 'Audio Speech Dataset', buyer: 'bob.testnet', amount: '1.8', time: '5 hours ago' },
                                { type: 'view', dataset: 'ImageNet-1K Subset', buyer: 'carol.testnet', amount: null, time: '1 day ago' },
                                { type: 'purchase', dataset: 'ImageNet-1K Subset', buyer: 'dave.testnet', amount: '2.5', time: '2 days ago' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'purchase' ? 'bg-green-500/20' : 'bg-blue-500/20'
                                            }`}>
                                            {activity.type === 'purchase' ? (
                                                <DollarSign className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">
                                                {activity.type === 'purchase' ? 'New Purchase' : 'Dataset Viewed'}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {activity.buyer} • {activity.dataset}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {activity.amount && (
                                            <div className="text-green-400 font-medium">+{activity.amount} Ⓝ</div>
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
