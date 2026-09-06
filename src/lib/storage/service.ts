/**
 * Slots Studio — Supabase Storage Service
 *
 * Implements server-side private file storage, MIME validation, anti-traversal
 * safe path generation, signed URL creation, and atomic rollback handling.
 */

import { randomUUID } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { normalizeWorkspaceId, normalizeProjectId } from "@/lib/supabase/utils";
import {
  STORAGE_BUCKET_PRIVATE,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
  type StorageUploadInput,
  type StorageUploadResult,
  type StorageDownloadResult,
  type SignedUrlResult,
} from "./types";

let bucketVerified = false;

/**
 * Ensures the private assets bucket exists in Supabase Storage.
 */
export async function ensureStorageBucket(): Promise<void> {
  if (bucketVerified) return;

  try {
    const supabase = createAdminSupabaseClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === STORAGE_BUCKET_PRIVATE);

    if (!exists) {
      await supabase.storage.createBucket(STORAGE_BUCKET_PRIVATE, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE_BYTES,
      });
    }
    bucketVerified = true;
  } catch (err) {
    console.warn("Storage bucket check warning:", err);
  }
}

/**
 * Validates filename, MIME type, and file size against the security allowlist.
 */
export function validateStorageFile(
  filename: string,
  contentType: string,
  sizeBytes: number
): { valid: boolean; error?: string } {
  if (!filename || typeof filename !== "string") {
    return { valid: false, error: "Filename is required." };
  }

  // Check for path traversal characters
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return { valid: false, error: "Filename contains invalid path traversal characters." };
  }

  // Validate size
  if (sizeBytes <= 0) {
    return { valid: false, error: "File cannot be empty." };
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 50MB limit (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // Validate MIME type
  const normalizedMime = contentType.toLowerCase().split(";")[0].trim();
  const allowedExtensions = ALLOWED_MIME_TYPES[normalizedMime];

  if (!allowedExtensions) {
    return {
      valid: false,
      error: `File type '${normalizedMime}' is not permitted. Allowed types: Images (PNG, JPG, WebP, SVG, GIF) and Documents (PDF, MD, TXT, JSON, CSV).`,
    };
  }

  // Validate extension
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) {
    return { valid: false, error: "File must have a valid extension." };
  }
  const ext = filename.substring(dotIndex).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Extension '${ext}' does not match MIME type '${normalizedMime}'. Expected one of: ${allowedExtensions.join(", ")}.`,
    };
  }

  return { valid: true };
}

/**
 * Generates an isolated, safe storage path: {workspaceId}/{projectId}/{uuid}_{filename}
 */
export function generateSafeStoragePath(
  workspaceId: string,
  projectId: string | null | undefined,
  filename: string
): string {
  const wsId = normalizeWorkspaceId(workspaceId);
  const projId = projectId ? normalizeProjectId(projectId) : "general";

  // Sanitize filename: keep only alphanumeric, hyphens, underscores, dots
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 100);

  const uniqueId = randomUUID();
  return `${wsId}/${projId}/${uniqueId}_${sanitized}`;
}

/**
 * Uploads a file buffer to Supabase Storage with strict isolation.
 */
export async function uploadFileToStorage(
  input: StorageUploadInput
): Promise<StorageUploadResult> {
  await ensureStorageBucket();

  const size = input.buffer.byteLength || (input.buffer as Buffer).length || 0;
  const validation = validateStorageFile(input.filename, input.contentType, size);
  if (!validation.valid) {
    return {
      success: false,
      bucket: STORAGE_BUCKET_PRIVATE,
      path: "",
      fullPath: "",
      sizeBytes: size,
      contentType: input.contentType,
      error: validation.error,
    };
  }

  const path = generateSafeStoragePath(input.workspaceId, input.projectId, input.filename);
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_PRIVATE)
    .upload(path, input.buffer, {
      contentType: input.contentType,
      upsert: false,
      metadata: input.metadata,
    });

  if (error || !data) {
    return {
      success: false,
      bucket: STORAGE_BUCKET_PRIVATE,
      path: "",
      fullPath: "",
      sizeBytes: size,
      contentType: input.contentType,
      error: error?.message || "Failed to upload file to storage.",
    };
  }

  return {
    success: true,
    bucket: STORAGE_BUCKET_PRIVATE,
    path: data.path || path,
    fullPath: data.fullPath || `${STORAGE_BUCKET_PRIVATE}/${path}`,
    sizeBytes: size,
    contentType: input.contentType,
  };
}

/**
 * Downloads a file from Supabase Storage.
 */
export async function downloadFileFromStorage(
  storagePath: string
): Promise<StorageDownloadResult> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_PRIVATE)
      .download(storagePath);

    if (error || !data) {
      return {
        success: false,
        error: error?.message || "File not found in storage.",
      };
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      data,
      buffer,
      contentType: data.type || "application/octet-stream",
      sizeBytes: buffer.byteLength,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to download file.",
    };
  }
}

/**
 * Creates a time-limited signed URL for private asset access.
 */
export async function createSignedAssetUrl(
  storagePath: string,
  expiresInSeconds: number = 3600
): Promise<SignedUrlResult> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_PRIVATE)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return {
        success: false,
        error: error?.message || "Failed to create signed URL.",
      };
    }

    return {
      success: true,
      signedUrl: data.signedUrl,
      expiresInSeconds,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create signed URL.",
    };
  }
}

/**
 * Deletes a file from Supabase Storage (used for rollback on DB insert failures).
 */
export async function deleteFileFromStorage(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET_PRIVATE)
      .remove([storagePath]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove file from storage.",
    };
  }
}
