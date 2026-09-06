/**
 * Slots Studio — Password Hashing & Verification (Server-Side Only)
 *
 * CRITICAL ARCHITECTURAL BOUNDARY:
 * This module uses Node.js crypto primitives (scrypt, randomBytes, timingSafeEqual).
 * It must execute exclusively in Node.js server environments (API routes, server actions).
 */

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const KEY_LENGTH = 64;

// Lazy-initialized scryptAsync to ensure promisify only runs in Node environments
let scryptAsync: ((password: string, salt: string, keylen: number) => Promise<Buffer>) | null = null;

function getScryptAsync() {
  if (!scryptAsync) {
    if (typeof scrypt !== "function") {
      throw new Error("Password hashing can only execute in a Node.js server runtime environment.");
    }
    scryptAsync = promisify(scrypt) as unknown as (
      password: string,
      salt: string,
      keylen: number
    ) => Promise<Buffer>;
  }
  return scryptAsync;
}

/**
 * Generates a cryptographically random salt.
 */
export function generateSalt(length = 16): string {
  return randomBytes(length).toString("hex");
}

/**
 * Hashes a plaintext password using scrypt with the given salt.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const hasher = getScryptAsync();
  const derivedKey = await hasher(password, salt, KEY_LENGTH);
  return derivedKey.toString("hex");
}

/**
 * Verifies a plaintext password against a stored password hash and salt using constant-time comparison.
 */
export async function verifyPassword(
  attempt: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  try {
    const hasher = getScryptAsync();
    const attemptHash = await hasher(attempt, salt, KEY_LENGTH);
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (attemptHash.length !== storedBuffer.length) {
      return false;
    }

    return timingSafeEqual(attemptHash, storedBuffer);
  } catch {
    return false;
  }
}
