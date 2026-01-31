import Link from 'next/link';
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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-glow absolute inset-0" />
        <div className="bg-grid absolute inset-0 opacity-50" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
              <Zap className="h-4 w-4" />
              <span>Powered by NEAR Protocol + Filecoin</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Ethical AI Data with</span>
              <br />
              <span className="text-gradient">Cryptographic Provenance</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-gray-400">
              The decentralized marketplace for verified, high-quality AI training datasets. Upload
              with proof, discover with confidence, compensate creators fairly.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-purple-500/40"
              >
                <Search className="h-5 w-5" />
                Browse Marketplace
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-gray-600 hover:bg-gray-700"
              >
                <Upload className="h-5 w-5" />
                Upload Dataset
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <stat.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Why VeritasAI?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Every dataset comes with cryptographic guarantees for authenticity, quality, and fair
              compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-purple-500/50"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 transition-transform group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-gray-400">{feature.description}</p>
              </div>
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
              <p className="mt-2 text-gray-400">Popular datasets with verified provenance</p>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 font-medium text-purple-400 hover:text-purple-300"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredDatasets.map((dataset) => (
              <Link
                key={dataset.id}
                href={`/dataset/${dataset.id}`}
                className="group card-hover rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-purple-500/50"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
                    {dataset.category}
                  </span>
                  {dataset.validated && (
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-purple-400">
                  {dataset.title}
                </h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{dataset.downloads} downloads</span>
                  <span className="text-xl font-bold text-white">{dataset.price} Ⓝ</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-900/50 to-gray-950 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to contribute to ethical AI?</h2>
          <p className="mb-10 text-xl text-gray-400">
            Upload your datasets and start earning while helping build transparent, responsible AI
            systems.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-purple-500/40"
          >
            <Upload className="h-6 w-6" />
            Start Uploading
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="font-bold text-white">V</span>
              </div>
              <span className="font-semibold text-white">VeritasAI</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <span>Powered by NEAR Protocol</span>
              <span>•</span>
              <span>Filecoin Storage</span>
              <span>•</span>
              <span>Bio.xyz Validation</span>
              <span>•</span>
              <span>Checker Network</span>
            </div>
            <div className="text-sm text-gray-500">© 2026 VeritasAI. MIT License.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
