import { randomBytes } from "crypto";
import { type PasswordResetToken } from "./types";

export const RESET_TOKEN_EXPIRES_IN_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generates a cryptographically secure random token string.
 */
export function generateRandomToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

/**
 * Creates a PasswordResetToken structure with a future expiration date.
 */
export function createPasswordResetToken(userId: string, email: string): PasswordResetToken {
  return {
    token: generateRandomToken(32),
    userId,
    email,
    expiresAt: Date.now() + RESET_TOKEN_EXPIRES_IN_MS,
  };
}
