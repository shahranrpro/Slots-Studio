/**
 * Slots Studio — Development-Only Authentication Store
 *
 * NOTE: This is an in-memory development repository used exclusively for
 * TASK 07 testing and local development workflows. It is explicitly non-production.
 * It will be cleanly superseded by the persistent database repository in future phases (TASK 09+).
 *
 * All auth service operations interact through the abstract auth boundary in `src/lib/auth/service.ts`,
 * ensuring UI components and API routes remain completely decoupled from this implementation.
 */

import { type UserWithPassword, type PasswordResetToken } from "./types";
import { generateSalt, hashPassword } from "./passwords";

const usersMap = new Map<string, UserWithPassword>();
const resetTokensMap = new Map<string, PasswordResetToken>();

let isSeeded = false;

export async function ensureSeededStore(): Promise<void> {
  if (isSeeded) return;

  // Seed a local development account if configured, or default to dev@slots.studio
  const devEmail = process.env.DEV_AUTH_EMAIL || "dev@slots.studio";
  const devPassword = process.env.DEV_AUTH_PASSWORD || "Password123!";

  const devSalt = generateSalt(16);
  const devHash = await hashPassword(devPassword, devSalt);

  const devUser: UserWithPassword = {
    id: "usr_dev_seed",
    email: devEmail.toLowerCase().trim(),
    name: "Development User",
    passwordHash: devHash,
    salt: devSalt,
    emailVerified: true,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersMap.set(devUser.email, devUser);
  isSeeded = true;
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  await ensureSeededStore();
  const normalized = email.trim().toLowerCase();
  return usersMap.get(normalized) || null;
}

export async function findUserById(id: string): Promise<UserWithPassword | null> {
  await ensureSeededStore();
  for (const user of usersMap.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function createUser(
  data: Omit<UserWithPassword, "id" | "createdAt" | "updatedAt">
): Promise<UserWithPassword> {
  await ensureSeededStore();
  const normalized = data.email.trim().toLowerCase();

  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const newUser: UserWithPassword = {
    ...data,
    id,
    email: normalized,
    createdAt: now,
    updatedAt: now,
  };

  usersMap.set(normalized, newUser);
  return newUser;
}

export async function updateUserPassword(
  userId: string,
  newPasswordHash: string,
  newSalt: string
): Promise<boolean> {
  await ensureSeededStore();
  const user = await findUserById(userId);
  if (!user) return false;

  user.passwordHash = newPasswordHash;
  user.salt = newSalt;
  user.updatedAt = new Date().toISOString();

  usersMap.set(user.email.toLowerCase(), user);
  return true;
}

export async function saveResetToken(tokenData: PasswordResetToken): Promise<void> {
  resetTokensMap.set(tokenData.token, tokenData);
}

export async function findResetToken(token: string): Promise<PasswordResetToken | null> {
  const record = resetTokensMap.get(token);
  if (!record) return null;

  if (record.expiresAt < Date.now()) {
    resetTokensMap.delete(token);
    return null;
  }

  return record;
}

export async function deleteResetToken(token: string): Promise<void> {
  resetTokensMap.delete(token);
}
