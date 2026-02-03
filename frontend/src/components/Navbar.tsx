'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, Database, Upload, LayoutDashboard } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { accountId, isSignedIn, isLoading, signIn, signOut } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace', icon: Database },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/8 bg-background-primary/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-start to-primary-end shadow-glow-cyan transition-all group-hover:shadow-glow-cyan-lg">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="gradient-text text-xl font-bold">VeritasAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-white/70 transition-all duration-200',
                  'hover:bg-surface-base hover:text-white'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden items-center gap-4 md:flex">
            {isLoading ? (
              <div className="h-10 w-32 animate-pulse rounded-lg bg-surface-elevated" />
            ) : isSignedIn && accountId ? (
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-surface-elevated px-4 py-2 backdrop-blur-lg">
                  <span className="text-sm text-white/70">
                    {accountId.length > 20 ? `${accountId.slice(0, 8)}...${accountId.slice(-8)}` : accountId}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="rounded-lg px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button onClick={signIn} size="md" leftIcon={<Wallet className="h-4 w-4" />}>
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/70 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/8 bg-background-primary/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/70 hover:bg-surface-base hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/8 pt-4">
                {isSignedIn && accountId ? (
                  <div className="space-y-2">
                    <div className="rounded-lg bg-surface-elevated px-4 py-2 text-sm text-white/70">
                      {accountId}
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full rounded-lg px-4 py-2 text-red-400 hover:bg-red-500/10"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button onClick={signIn} className="w-full" leftIcon={<Wallet className="h-4 w-4" />}>
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
