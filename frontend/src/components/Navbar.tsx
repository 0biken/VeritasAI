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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            VeritasAI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {loading ? (
                            <div className="w-32 h-10 bg-gray-800 rounded-lg animate-pulse" />
                        ) : account ? (
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                                    <span className="text-sm text-gray-300">
                                        {account.length > 20
                                            ? `${account.slice(0, 8)}...${account.slice(-8)}`
                                            : account}
                                    </span>
                                </div>
                                <button
                                    onClick={handleDisconnect}
                                    className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnect}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                            >
                                <Wallet className="w-4 h-4" />
                                Connect Wallet
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-800">
                            {account ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">
                                        {account}
                                    </div>
                                    <button
                                        onClick={handleDisconnect}
                                        className="w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleConnect}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                                >
                                    <Wallet className="w-4 h-4" />
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
