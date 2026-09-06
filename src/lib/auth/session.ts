import { type Session, type User } from "./types";

export const SESSION_COOKIE_NAME = "slots-studio-session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const DEFAULT_SECRET = "slots-studio-dev-auth-secret-min-32-chars-key-2026";

function getSecret(): string {
  return process.env.AUTH_COOKIE_SECRET || process.env.AUTH_SECRET || DEFAULT_SECRET;
}

// Helpers for base64url encoding/decoding in edge & node runtimes
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToArrayBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed session token using Web Crypto API.
 */
export async function createSessionToken(session: Session): Promise<string> {
  const secret = getSecret();
  const payload = base64UrlEncode(JSON.stringify(session));
  const encoder = new TextEncoder();
  const key = await getCryptoKey(secret);

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const signature = arrayBufferToBase64Url(signatureBuffer);

  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token using Web Crypto API.
 */
export async function verifySessionToken(token: string): Promise<Session | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const secret = getSecret();

  try {
    const key = await getCryptoKey(secret);
    const signatureBytes = base64UrlToArrayBuffer(signature);
    const encoder = new TextEncoder();

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payload)
    );

    if (!isValid) return null;

    const jsonStr = base64UrlDecode(payload);
    const decoded = JSON.parse(jsonStr) as Session;

    // Check expiration
    if (!decoded.expiresAt || decoded.expiresAt < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Creates a new Session object from a user entity.
 */
export function createSessionData(user: User): Session {
  return {
    id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
}
