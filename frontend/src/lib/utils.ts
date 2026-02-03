import clsx, { ClassValue } from 'clsx';

/**
 * Utility function for merging class names
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Truncate a hash/CID for display
 */
export function truncateHash(hash: string, startChars = 8, endChars = 6): string {
    if (hash.length <= startChars + endChars) return hash;
    return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
