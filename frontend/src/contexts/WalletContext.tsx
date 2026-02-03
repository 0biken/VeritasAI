'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import '@near-wallet-selector/modal-ui/styles.css';

const NETWORK_ID = process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet';
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'veritasai.testnet';

interface WalletContextValue {
    selector: WalletSelector | null;
    modal: WalletSelectorModal | null;
    accountId: string | null;
    isSignedIn: boolean;
    isLoading: boolean;
    signIn: () => void;
    signOut: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const _selector = await setupWalletSelector({
                    network: NETWORK_ID as 'testnet' | 'mainnet',
                    modules: [
                        setupMyNearWallet(),
                        setupHereWallet(),
                    ],
                });

                const _modal = setupModal(_selector, {
                    contractId: CONTRACT_ID,
                    theme: 'dark',
                });

                const state = _selector.store.getState();
                const accounts = state.accounts;

                setSelector(_selector);
                setModal(_modal);
                setAccountId(accounts.length > 0 ? accounts[0].accountId : null);

                // Subscribe to account changes
                _selector.store.observable.subscribe((state) => {
                    const accounts = state.accounts;
                    setAccountId(accounts.length > 0 ? accounts[0].accountId : null);
                });
            } catch (err) {
                console.error('Failed to initialize wallet selector:', err);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    const signIn = useCallback(() => {
        if (modal) {
            modal.show();
        }
    }, [modal]);

    const signOut = useCallback(async () => {
        if (!selector) return;

        const wallet = await selector.wallet();
        await wallet.signOut();
        setAccountId(null);
    }, [selector]);

    const value: WalletContextValue = {
        selector,
        modal,
        accountId,
        isSignedIn: !!accountId,
        isLoading,
        signIn,
        signOut,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
