'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Database,
  Coins,
  CheckCircle,
  Upload,
  Search,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Mock featured datasets for demo
const featuredDatasets = [
  {
    id: 1,
    title: 'ImageNet-1K Subset',
    category: 'Computer Vision',
    price: '2.5',
    downloads: 234,
    validated: true,
  },
  {
    id: 2,
    title: 'Medical Imaging - Chest X-rays',
    category: 'Biomedical',
    price: '5.0',
    downloads: 156,
    validated: true,
  },
  {
    id: 3,
    title: 'Multilingual NLP Corpus',
    category: 'Natural Language Processing',
    price: '3.2',
    downloads: 89,
    validated: false,
  },
];

const stats = [
  { label: 'Datasets', value: '2,847', icon: Database },
  { label: 'Total Volume', value: '$1.2M', icon: Coins },
  { label: 'Verified Providers', value: '412', icon: CheckCircle },
];

const features = [
  {
    icon: Database,
    title: 'Filecoin Storage',
    description:
      'Immutable, content-addressed storage ensures datasets remain unchanged and always accessible.',
  },
  {
    icon: Shield,
    title: 'ZK Proofs',
    description:
      'Checker Network verifies dataset properties without exposing sensitive information.',
  },
  {
    icon: CheckCircle,
    title: 'Bio.xyz Validation',
    description: 'Scientific datasets undergo rigorous validation against established standards.',
  },
  {
    icon: Coins,
    title: 'Fair Compensation',
    description: 'Smart contracts ensure automatic royalty distribution to data creators.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-glow absolute inset-0" />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="bg-particles absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8 inline-flex">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-start/30 bg-primary-start/10 px-4 py-2 text-sm text-primary-start backdrop-blur-lg">
                <Zap className="h-4 w-4" />
                <span>Powered by NEAR Protocol + Filecoin</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="text-white">Ethical AI Data with</span>
              <br />
              <span className="gradient-text">Cryptographic Provenance</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-white/70"
            >
              The decentralized marketplace for verified, high-quality AI training datasets. Upload
              with proof, discover with confidence, compensate creators fairly.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/marketplace">
                <Button size="lg" leftIcon={<Search className="h-5 w-5" />} rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="secondary" size="lg" leftIcon={<Upload className="h-5 w-5" />}>
                  Upload Dataset
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-4 rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20">
                  <stat.icon className="h-6 w-6 text-primary-start" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Why VeritasAI?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              Every dataset comes with cryptographic guarantees for authenticity, quality, and fair
              compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg transition-all duration-300 hover:border-primary-start/40 hover:-translate-y-1"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 transition-transform group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary-start" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Datasets */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Featured Datasets</h2>
              <p className="mt-2 text-white/50">Popular datasets with verified provenance</p>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 font-medium text-primary-start hover:text-primary-start/80 transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredDatasets.map((dataset, i) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/dataset/${dataset.id}`}
                  className="group block rounded-lg border border-white/8 bg-surface-elevated p-6 backdrop-blur-lg transition-all duration-300 hover:border-primary-start/40 hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="rounded-lg border border-primary-start/30 bg-primary-start/20 px-3 py-1 text-xs font-medium text-primary-start">
                      {dataset.category}
                    </span>
                    {dataset.validated && (
                      <div className="flex items-center gap-1 text-xs text-validation">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-all group-hover:gradient-text">
                    {dataset.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/50">{dataset.downloads} downloads</span>
                    <span className="text-xl font-bold gradient-text">{dataset.price} Ⓝ</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background-secondary/50 to-background-primary py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to contribute to ethical AI?</h2>
          <p className="mb-10 text-xl text-white/60">
            Upload your datasets and start earning while helping build transparent, responsible AI
            systems.
          </p>
          <Link href="/upload">
            <Button size="lg" leftIcon={<Upload className="h-6 w-6" />}>
              Start Uploading
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-start to-primary-end">
                <span className="font-bold text-white">V</span>
              </div>
              <span className="font-semibold text-white">VeritasAI</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/50">
              <span>Powered by NEAR Protocol</span>
              <span>•</span>
              <span>Filecoin Storage</span>
              <span>•</span>
              <span>Bio.xyz Validation</span>
              <span>•</span>
              <span>Checker Network</span>
            </div>
            <div className="text-sm text-white/40">© 2026 VeritasAI. MIT License.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
