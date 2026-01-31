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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Upload className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">Upload Dataset</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Upload your dataset with cryptographic provenance. Your files will be stored on
            Filecoin, validated by Bio.xyz, and secured with zero-knowledge proofs.
          </p>
        </div>

        {/* Auth Check */}
        {!authenticated ? (
          <div className="mx-auto max-w-md rounded-2xl border border-gray-700 bg-gray-800/50 p-8 text-center">
            <Wallet className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h2 className="mb-2 text-xl font-semibold text-white">Connect Your Wallet</h2>
            <p className="mb-6 text-gray-400">
              You need to connect your NEAR wallet to upload datasets to the marketplace.
            </p>
            <button
              onClick={handleConnect}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white hover:from-blue-500 hover:to-purple-500"
            >
              Connect NEAR Wallet
            </button>
          </div>
        ) : (
          /* Upload Form */
          <div className="rounded-2xl border border-gray-700 bg-gray-800/30 p-8">
            <UploadForm
              onComplete={(result) => {
                console.log('Upload complete:', result);
                // In production, this would call the smart contract to list the dataset
              }}
            />
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="mb-2 font-semibold text-white">Filecoin Storage</h3>
            <p className="text-sm text-gray-400">
              Your dataset is stored on Filecoin&apos;s decentralized network with a unique CID for
              permanent access.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="mb-2 font-semibold text-white">Bio.xyz Validation</h3>
            <p className="text-sm text-gray-400">
              Scientific datasets are validated against established standards for quality assurance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="mb-2 font-semibold text-white">ZK Proofs</h3>
            <p className="text-sm text-gray-400">
              Checker Network generates proofs verifying dataset properties without exposing raw
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
