'use client';

import { useState, useEffect } from 'react';
import { Upload, ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { UploadForm } from '@/components/UploadForm';
import { isSignedIn, signIn } from '@/lib/near';

export default function UploadPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const signedIn = await isSignedIn();
            setAuthenticated(signedIn);
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setChecking(false);
        }
    }

    async function handleConnect() {
        try {
            await signIn();
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Upload Dataset</h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Upload your dataset with cryptographic provenance. Your files will be stored on
                        Filecoin, validated by Bio.xyz, and secured with zero-knowledge proofs.
                    </p>
                </div>

                {/* Auth Check */}
                {!authenticated ? (
                    <div className="max-w-md mx-auto text-center p-8 bg-gray-800/50 border border-gray-700 rounded-2xl">
                        <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Connect Your Wallet
                        </h2>
                        <p className="text-gray-400 mb-6">
                            You need to connect your NEAR wallet to upload datasets to the marketplace.
                        </p>
                        <button
                            onClick={handleConnect}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium"
                        >
                            Connect NEAR Wallet
                        </button>
                    </div>
                ) : (
                    /* Upload Form */
                    <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8">
                        <UploadForm
                            onComplete={(result) => {
                                console.log('Upload complete:', result);
                                // In production, this would call the smart contract to list the dataset
                            }}
                        />
                    </div>
                )}

                {/* Info Cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                            <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Filecoin Storage</h3>
                        <p className="text-sm text-gray-400">
                            Your dataset is stored on Filecoin's decentralized network with a unique CID for permanent access.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                            <span className="text-2xl">🔬</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Bio.xyz Validation</h3>
                        <p className="text-sm text-gray-400">
                            Scientific datasets are validated against established standards for quality assurance.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">ZK Proofs</h3>
                        <p className="text-sm text-gray-400">
                            Checker Network generates proofs verifying dataset properties without exposing raw data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
