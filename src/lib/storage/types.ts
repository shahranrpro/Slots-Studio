/**
 * Slots Studio — Supabase Storage Types & Configuration
 */

export const STORAGE_BUCKET_PRIVATE = "private-assets";
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  // Images
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/svg+xml": [".svg"],
  "image/gif": [".gif"],
  // Documents
  "application/pdf": [".pdf"],
  "text/markdown": [".md", ".markdown"],
  "text/plain": [".txt"],
  "application/json": [".json"],
  "text/csv": [".csv"],
};

export interface StorageUploadInput {
  workspaceId: string;
  projectId?: string | null;
  filename: string;
  contentType: string;
  buffer: Buffer | Uint8Array;
  metadata?: Record<string, unknown>;
}

export interface StorageUploadResult {
  success: boolean;
  bucket: string;
  path: string;
  fullPath: string;
  sizeBytes: number;
  contentType: string;
  error?: string;
}

export interface StorageDownloadResult {
  success: boolean;
  data?: Blob;
  buffer?: Buffer;
  contentType?: string;
  sizeBytes?: number;
  error?: string;
}

export interface SignedUrlResult {
  success: boolean;
  signedUrl?: string;
  expiresInSeconds?: number;
  error?: string;
}
