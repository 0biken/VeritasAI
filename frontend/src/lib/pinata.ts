/**
 * Pinata.cloud Integration for Filecoin/IPFS Storage
 * Provides decentralized storage with content-addressed CIDs
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

export interface UploadResult {
  cid: string;
  size: number;
  name: string;
  timestamp: number;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class PinataService {
  private jwt: string;
  private gateway: string;

  constructor() {
    this.jwt = PINATA_JWT;
    this.gateway = PINATA_GATEWAY;
  }

  /**
   * Upload file to Pinata/IPFS
   * Returns CID (Content Identifier) for Filecoin storage
   */
  async uploadFile(
    file: File,
    metadata?: { name?: string; keyvalues?: Record<string, string> }
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      formData.append(
        'pinataMetadata',
        JSON.stringify({
          name: metadata.name || file.name,
          keyvalues: metadata.keyvalues || {},
        })
      );
    }

    formData.append(
      'pinataOptions',
      JSON.stringify({
        cidVersion: 1,
      })
    );

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }

    const result: PinataResponse = await response.json();

    return {
      cid: result.IpfsHash,
      size: result.PinSize,
      name: metadata?.name || file.name,
      timestamp: Date.now(),
    };
  }

  /**
   * Upload multiple files as a directory
   */
  async uploadDirectory(files: File[], directoryName: string): Promise<UploadResult> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('file', file, `${directoryName}/${file.name}`);
    });

    formData.append(
      'pinataMetadata',
      JSON.stringify({
        name: directoryName,
      })
    );

    formData.append(
      'pinataOptions',
      JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: true,
      })
    );

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }

    const result: PinataResponse = await response.json();

    return {
      cid: result.IpfsHash,
      size: result.PinSize,
      name: directoryName,
      timestamp: Date.now(),
    };
  }

  /**
   * Upload JSON metadata
   */
  async uploadJSON(data: Record<string, unknown>, name: string): Promise<UploadResult> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwt}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: { name },
        pinataOptions: { cidVersion: 1 },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata JSON upload failed: ${error}`);
    }

    const result: PinataResponse = await response.json();

    return {
      cid: result.IpfsHash,
      size: result.PinSize,
      name,
      timestamp: Date.now(),
    };
  }

  /**
   * Get IPFS gateway URL for a CID
   */
  getGatewayUrl(cid: string, filename?: string): string {
    if (filename) {
      return `${this.gateway}/ipfs/${cid}/${filename}`;
    }
    return `${this.gateway}/ipfs/${cid}`;
  }

  /**
   * Unpin a file (remove from Pinata)
   */
  async unpin(cid: string): Promise<void> {
    const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata unpin failed: ${error}`);
    }
  }

  /**
   * Get pin status
   */
  async getPinStatus(cid: string): Promise<unknown> {
    const response = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${cid}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get pin status');
    }

    return await response.json();
  }
}

// Singleton instance
let pinataService: PinataService | null = null;

export function getPinataService(): PinataService {
  if (!pinataService) {
    pinataService = new PinataService();
  }
  return pinataService;
}

// Upload helper with progress simulation
export async function uploadDatasetToPinata(
  files: File[],
  datasetName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const service = getPinataService();

  // Simulate progress since Pinata doesn't provide native progress
  if (onProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress < 90) {
        onProgress(Math.min(progress, 90));
      }
    }, 300);

    try {
      const result =
        files.length === 1
          ? await service.uploadFile(files[0], { name: datasetName })
          : await service.uploadDirectory(files, datasetName);

      clearInterval(interval);
      onProgress(100);
      return result;
    } catch (error) {
      clearInterval(interval);
      throw error;
    }
  }

  return files.length === 1
    ? await service.uploadFile(files[0], { name: datasetName })
    : await service.uploadDirectory(files, datasetName);
}
