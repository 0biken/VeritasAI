'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { DatasetCard, DatasetCardSkeleton } from '@/components/DatasetCard';
import { Input } from '@/components/ui';
import { Dataset } from '@/lib/near';
import { cn } from '@/lib/utils';

// Mock datasets for demo (in production, fetch from NEAR contract)
const mockDatasets: Dataset[] = [
  {
    id: 0,
    owner: 'alice.testnet',
    title: 'ImageNet-1K Subset - 10,000 Labeled Images',
    description:
      'A curated subset of ImageNet containing 10,000 high-quality labeled images across 100 categories. Perfect for transfer learning and model fine-tuning.',
    category: 'Computer Vision',
    filecoin_cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    bio_validated: true,
    zk_proof_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    price: '2500000000000000000000000',
    license: 'MIT',
    created_at: Date.now() - 86400000 * 7,
    downloads: 234,
  },
  {
    id: 1,
    owner: 'bob.testnet',
    title: 'Medical Imaging - Chest X-ray Dataset',
    description:
      'Anonymized chest X-ray images with radiologist annotations. Includes normal and abnormal findings for AI-assisted diagnosis research.',
    category: 'Biomedical',
    filecoin_cid: 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    bio_validated: true,
    zk_proof_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    price: '5000000000000000000000000',
    license: 'CC BY 4.0',
    created_at: Date.now() - 86400000 * 3,
    downloads: 156,
  },
  {
    id: 2,
    owner: 'carol.testnet',
    title: 'Multilingual NLP Corpus - 50 Languages',
    description:
      'Parallel text corpus covering 50 languages with sentence-level alignment. Ideal for machine translation and multilingual NLP research.',
    category: 'Natural Language Processing',
    filecoin_cid: 'bafkreigaknpexyvxt76zgkitavxwkdk6jcjnvptyfi7jntc6gt5gqm5sru',
    bio_validated: false,
    zk_proof_hash: '0x000',
    price: '3200000000000000000000000',
    license: 'Apache-2.0',
    created_at: Date.now() - 86400000 * 14,
    downloads: 89,
  },
  {
    id: 3,
    owner: 'dave.testnet',
    title: 'Speech Recognition - 1000 Hours Audio',
    description:
      'High-quality speech recordings with transcriptions across multiple accents and speaking styles. Includes noise-augmented versions.',
    category: 'Audio',
    filecoin_cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
    bio_validated: true,
    zk_proof_hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    price: '4500000000000000000000000',
    license: 'MIT',
    created_at: Date.now() - 86400000 * 5,
    downloads: 67,
  },
  {
    id: 4,
    owner: 'eve.testnet',
    title: 'Protein Structure Database - AlphaFold Compatible',
    description:
      'Curated protein structures with experimental validation. Formatted for direct use with AlphaFold and other structure prediction models.',
    category: 'Biomedical',
    filecoin_cid: 'bafkreidgvpkjawlxz6sffxzwgooowe5ber2d8iqazl2yvldtimxvzqbvba',
    bio_validated: true,
    zk_proof_hash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    price: '8000000000000000000000000',
    license: 'CC0',
    created_at: Date.now() - 86400000,
    downloads: 45,
  },
  {
    id: 5,
    owner: 'frank.testnet',
    title: 'Autonomous Driving - LiDAR Point Clouds',
    description:
      'High-resolution LiDAR scans from urban driving scenarios with 3D bounding box annotations for vehicles, pedestrians, and cyclists.',
    category: 'Computer Vision',
    filecoin_cid: 'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
    bio_validated: false,
    zk_proof_hash: '0x5555555555555555555555555555555555555555555555555555555555555555',
    price: '12000000000000000000000000',
    license: 'Apache-2.0',
    created_at: Date.now() - 86400000 * 10,
    downloads: 128,
  },
];

const categories = [
  'All Categories',
  'Computer Vision',
  'Natural Language Processing',
  'Biomedical',
  'Genomic',
  'Audio',
  'Other',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function MarketplacePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Simulate loading from contract
    setTimeout(() => {
      setDatasets(mockDatasets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort datasets
  const filteredDatasets = datasets
    .filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.created_at - a.created_at;
        case 'oldest':
          return a.created_at - b.created_at;
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'popular':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white">Marketplace</h1>
          <p className="mt-2 text-white/60">
            Discover verified, high-quality AI training datasets with cryptographic provenance
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface-base py-3 pr-4 pl-12 text-white placeholder:text-white/30 transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-surface-base px-4 py-3 pr-10 text-white transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none sm:w-48"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-white/40" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-surface-base px-4 py-3 pr-10 text-white transition-colors focus:border-primary-start focus:ring-4 focus:ring-primary-start/10 focus:outline-none sm:w-44"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-white/40" />
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-white/40">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading datasets...
              </span>
            ) : (
              `${filteredDatasets.length} dataset${filteredDatasets.length !== 1 ? 's' : ''} found`
            )}
          </div>
        </motion.div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => <DatasetCardSkeleton key={i} />)
          ) : filteredDatasets.length > 0 ? (
            filteredDatasets.map((dataset, i) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DatasetCard dataset={dataset} />
              </motion.div>
            ))
          ) : (
            // Empty state
            <div className="col-span-full py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
                <Search className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-xl font-medium text-white/60">No datasets found</h3>
              <p className="mt-2 text-white/40">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
