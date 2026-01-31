'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Menu, X, Database, Upload, LayoutDashboard } from 'lucide-react';
import { isSignedIn, getAccountId, signIn, signOut } from '@/lib/near';

export function Navbar() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  async function handleDisconnect() {
    try {
      await signOut();
      setAccount(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace', icon: Database },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/25 transition-all group-hover:shadow-purple-500/40">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
              VeritasAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden items-center gap-4 md:flex">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-800" />
            ) : account ? (
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2">
                  <span className="text-sm text-gray-300">
                    {account.length > 20
                      ? `${account.slice(0, 8)}...${account.slice(-8)}`
                      : account}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="rounded-lg px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-purple-500/40"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-800 bg-gray-900 md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-800 pt-4">
              {account ? (
                <div className="space-y-2">
                  <div className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
                    {account}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full rounded-lg px-4 py-2 text-red-400 hover:bg-red-500/10"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
