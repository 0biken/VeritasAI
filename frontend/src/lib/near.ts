/**
 * NEAR Protocol Integration
 * Using @near-wallet-selector for wallet connection
 */

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

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'veritasai.testnet';

/**
 * List a new dataset on the marketplace
 * In production, calls NEAR smart contract
 */
export async function listDataset(
  dataset: Omit<Dataset, 'id' | 'owner' | 'created_at' | 'downloads'>
): Promise<number> {
  console.log('Listing dataset:', dataset);

  // In production with wallet selector:
  // const wallet = await selector.wallet();
  // return await wallet.signAndSendTransaction({
  //   receiverId: CONTRACT_ID,
  //   actions: [{
  //     type: 'FunctionCall',
  //     params: {
  //       methodName: 'list_dataset',
  //       args: dataset,
  //       gas: '30000000000000',
  //       deposit: '0',
  //     }
  //   }]
  // });

  // Mock: return random ID
  return Math.floor(Math.random() * 1000);
}

/**
 * Purchase a dataset
 * In production, calls NEAR smart contract with attached payment
 */
export async function purchaseDataset(datasetId: number, price: string): Promise<void> {
  console.log('Purchasing dataset:', datasetId, 'for', price);

  // In production with wallet selector:
  // const wallet = await selector.wallet();
  // await wallet.signAndSendTransaction({
  //   receiverId: CONTRACT_ID,
  //   actions: [{
  //     type: 'FunctionCall',
  //     params: {
  //       methodName: 'purchase_dataset',
  //       args: { dataset_id: datasetId },
  //       gas: '30000000000000',
  //       deposit: price,
  //     }
  //   }]
  // });

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
  // const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });
  // const result = await provider.query({
  //   request_type: 'call_function',
  //   account_id: CONTRACT_ID,
  //   method_name: 'get_datasets',
  //   args_base64: btoa(JSON.stringify({ from_index: fromIndex, limit })),
  //   finality: 'final'
  // });
  // return JSON.parse(Buffer.from(result.result).toString());

  return [];
}

/**
 * Get a single dataset by ID
 */
export async function getDataset(datasetId: number): Promise<Dataset | null> {
  console.log('Getting dataset:', datasetId);
  return null;
}

/**
 * Verify if a user has purchased a dataset
 */
export async function verifyPurchase(buyer: string, datasetId: number): Promise<boolean> {
  console.log('Verifying purchase:', buyer, datasetId);
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
