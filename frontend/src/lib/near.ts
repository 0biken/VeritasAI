/**
 * NEAR Protocol Integration
 * Simplified implementation for hackathon demo
 * Uses mock wallet for development, real wallet in production
 */

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'veritasai.testnet';
const NETWORK_ID = 'testnet';

export interface Dataset {
  id: number;
  owner: string;
  title: string;
  description: string;
  category: string;
  filecoin_cid: string;
  bio_validated: boolean;
  zk_proof_hash: string;
  price: string;
  license: string;
  created_at: number;
  downloads: number;
}

export interface Purchase {
  dataset_id: number;
  buyer: string;
  price_paid: string;
  timestamp: number;
}

// Simple state management for wallet
let walletState = {
  isSignedIn: false,
  accountId: null as string | null,
};

/**
 * Initialize NEAR connection
 * For demo, uses localStorage to persist mock state
 */
export async function initNear() {
  if (typeof window !== 'undefined') {
    const storedAccount = localStorage.getItem('veritasai_account');
    if (storedAccount) {
      walletState = {
        isSignedIn: true,
        accountId: storedAccount,
      };
    }
  }
  return walletState;
}

/**
 * Sign in with NEAR wallet
 * For demo, simulates wallet connection
 */
export async function signIn() {
  if (typeof window === 'undefined') return;

  // In production, redirect to NEAR wallet
  // For demo, prompt for account name or use mock
  const mockAccount = `user${Math.floor(Math.random() * 10000)}.testnet`;

  walletState = {
    isSignedIn: true,
    accountId: mockAccount,
  };

  localStorage.setItem('veritasai_account', mockAccount);

  // Reload to simulate wallet redirect return
  window.location.reload();
}

/**
 * Sign out from NEAR wallet
 */
export async function signOut() {
  if (typeof window === 'undefined') return;

  walletState = {
    isSignedIn: false,
    accountId: null,
  };

  localStorage.removeItem('veritasai_account');
  window.location.reload();
}

/**
 * Get current account ID
 */
export async function getAccountId(): Promise<string | null> {
  await initNear();
  return walletState.accountId;
}

/**
 * Check if user is signed in
 */
export async function isSignedIn(): Promise<boolean> {
  await initNear();
  return walletState.isSignedIn;
}

/**
 * List a new dataset on the marketplace
 * In production, calls NEAR smart contract
 */
export async function listDataset(
  dataset: Omit<Dataset, 'id' | 'owner' | 'created_at' | 'downloads'>
): Promise<number> {
  console.log('Listing dataset:', dataset);

  // In production:
  // const contract = await getContract();
  // return await contract.list_dataset(dataset);

  // Mock: return random ID
  return Math.floor(Math.random() * 1000);
}

/**
 * Purchase a dataset
 * In production, calls NEAR smart contract with attached payment
 */
export async function purchaseDataset(datasetId: number, price: string): Promise<void> {
  console.log('Purchasing dataset:', datasetId, 'for', price);

  // In production:
  // const contract = await getContract();
  // await contract.purchase_dataset({ dataset_id: datasetId }, { amount: price });

  // Mock: simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * Get all datasets (paginated)
 * In production, calls NEAR smart contract view method
 */
export async function getDatasets(fromIndex: number = 0, limit: number = 20): Promise<Dataset[]> {
  console.log('Getting datasets from:', fromIndex, 'limit:', limit);

  // In production:
  // const contract = await getContract();
  // return await contract.get_datasets({ from_index: fromIndex, limit });

  // Mock: return empty (component uses its own mock data)
  return [];
}

/**
 * Get a single dataset by ID
 */
export async function getDataset(datasetId: number): Promise<Dataset | null> {
  console.log('Getting dataset:', datasetId);

  // In production:
  // const contract = await getContract();
  // return await contract.get_dataset({ dataset_id: datasetId });

  return null;
}

/**
 * Verify if a user has purchased a dataset
 */
export async function verifyPurchase(buyer: string, datasetId: number): Promise<boolean> {
  console.log('Verifying purchase:', buyer, datasetId);

  // In production:
  // const contract = await getContract();
  // return await contract.verify_purchase({ buyer, dataset_id: datasetId });

  return false;
}

/**
 * Format yoctoNEAR to NEAR for display
 */
export function formatNear(yoctoNear: string): string {
  const near = parseFloat(yoctoNear) / 1e24;
  if (near >= 1) {
    return near.toFixed(2);
  }
  return near.toFixed(4);
}

/**
 * Convert NEAR to yoctoNEAR
 */
export function toYoctoNear(near: string): string {
  return (parseFloat(near) * 1e24).toFixed(0);
}

/**
 * Get NEAR explorer URL for a transaction
 */
export function getExplorerUrl(txHash: string): string {
  return `https://testnet.nearblocks.io/txns/${txHash}`;
}

/**
 * Get NEAR explorer URL for an account
 */
export function getAccountUrl(accountId: string): string {
  return `https://testnet.nearblocks.io/address/${accountId}`;
}
