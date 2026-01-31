import Link from 'next/link';
import { ArrowRight, Shield, Database, Coins, CheckCircle, Upload, Search, Zap } from 'lucide-react';

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
    description: 'Immutable, content-addressed storage ensures datasets remain unchanged and always accessible.',
  },
  {
    icon: Shield,
    title: 'ZK Proofs',
    description: 'Checker Network verifies dataset properties without exposing sensitive information.',
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
        <div className="absolute inset-0 bg-glow" />
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-8">
              <Zap className="w-4 h-4" />
              <span>Powered by NEAR Protocol + Filecoin</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white">Ethical AI Data with</span>
              <br />
              <span className="text-gradient">Cryptographic Provenance</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The decentralized marketplace for verified, high-quality AI training datasets.
              Upload with proof, discover with confidence, compensate creators fairly.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/marketplace"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
              >
                <Search className="w-5 h-5" />
                Browse Marketplace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg border border-gray-700 hover:border-gray-600 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload Dataset
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-400" />
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
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Why VeritasAI?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Every dataset comes with cryptographic guarantees for authenticity, quality, and fair compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-purple-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Datasets */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Featured Datasets</h2>
              <p className="mt-2 text-gray-400">Popular datasets with verified provenance</p>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDatasets.map((dataset) => (
              <Link
                key={dataset.id}
                href={`/dataset/${dataset.id}`}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-purple-500/50 transition-all group card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    {dataset.category}
                  </span>
                  {dataset.validated && (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
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
      <section className="py-24 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to contribute to ethical AI?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Upload your datasets and start earning while helping build transparent, responsible AI systems.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            <Upload className="w-6 h-6" />
            Start Uploading
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
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
            <div className="text-sm text-gray-500">
              © 2026 VeritasAI. MIT License.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
