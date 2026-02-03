'use client';

import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { UploadForm } from '@/components/UploadForm';
import { Button } from '@/components/ui';
import { useWallet } from '@/contexts/WalletContext';

export default function UploadPage() {
  const { isSignedIn, isLoading, signIn } = useWallet();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-start border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-primary-start/30 bg-gradient-to-br from-primary-start/20 to-primary-end/20 backdrop-blur-lg">
            <Upload className="h-8 w-8 text-primary-start" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">Upload Dataset</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Upload your dataset with cryptographic provenance. Your files will be stored on
            Filecoin, validated by Bio.xyz, and secured with zero-knowledge proofs.
          </p>
        </motion.div>

        {/* Auth Check */}
        {!isSignedIn ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-lg border border-white/8 bg-surface-elevated p-8 text-center backdrop-blur-lg"
          >
            <Wallet className="mx-auto mb-4 h-12 w-12 text-white/30" />
            <h2 className="mb-2 text-xl font-semibold text-white">Connect Your Wallet</h2>
            <p className="mb-6 text-white/60">
              You need to connect your NEAR wallet to upload datasets to the marketplace.
            </p>
            <Button onClick={signIn} className="w-full">
              Connect NEAR Wallet
            </Button>
          </motion.div>
        ) : (
          /* Upload Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-white/8 bg-surface-elevated/50 p-8 backdrop-blur-lg"
          >
            <UploadForm
              onComplete={(result) => {
                console.log('Upload complete:', result);
                // In production, this would call the smart contract to list the dataset
              }}
            />
          </motion.div>
        )}

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            {
              emoji: '📦',
              title: 'Filecoin Storage',
              description:
                "Your dataset is stored on Filecoin's decentralized network with a unique CID for permanent access.",
              color: 'primary-start',
            },
            {
              emoji: '🔬',
              title: 'Bio.xyz Validation',
              description:
                'Scientific datasets are validated against established standards for quality assurance.',
              color: 'validation',
            },
            {
              emoji: '🔐',
              title: 'ZK Proofs',
              description:
                'Checker Network generates proofs verifying dataset properties without exposing raw data.',
              color: 'primary-end',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${card.color === 'primary-start'
                    ? 'bg-primary-start/20'
                    : card.color === 'validation'
                      ? 'bg-validation/20'
                      : 'bg-primary-end/20'
                  }`}
              >
                <span className="text-2xl">{card.emoji}</span>
              </div>
              <h3 className="mb-2 font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-white/60">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
