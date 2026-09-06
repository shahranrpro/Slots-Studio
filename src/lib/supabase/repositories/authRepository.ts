/**
 * Slots Studio — Supabase Auth & Users Repository
 */

import { createAdminSupabaseClient } from "../server";
import { type UserWithPassword } from "@/lib/auth/types";

// Fallback in-memory cache for password hashes during offline/dev mode
const devPasswordHashes = new Map<string, { hash: string; salt: string }>();


export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const supabase = createAdminSupabaseClient();
  const normalized = email.trim().toLowerCase();

  // 1. Query public.users
  const { data: dbUser, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", normalized)
    .maybeSingle();

  if (error || !dbUser) {
    return null;
  }

  const creds = devPasswordHashes.get(dbUser.id) || {
    hash: "",
    salt: "",
  };

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.full_name || "User",
    role: "user",
    emailVerified: true,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.created_at,
    passwordHash: creds.hash,
    salt: creds.salt,
  };
}

export async function findUserById(id: string): Promise<UserWithPassword | null> {
  const supabase = createAdminSupabaseClient();

  const { data: dbUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !dbUser) {
    return null;
  }

  const creds = devPasswordHashes.get(dbUser.id) || {
    hash: "",
    salt: "",
  };

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.full_name || "User",
    role: "user",
    emailVerified: true,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.created_at,
    passwordHash: creds.hash,
    salt: creds.salt,
  };
}

export async function createDbUser(userData: {
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role?: "user" | "admin";
  id?: string;
  rawPassword?: string;
}): Promise<UserWithPassword> {
  const supabase = createAdminSupabaseClient();
  const email = userData.email.trim().toLowerCase();

  // Also create/sync with Supabase GoTrue Auth
  let authUserId = userData.id;
  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email,
      password: userData.rawPassword || "Password123!",
      email_confirm: true,
      user_metadata: { full_name: userData.name },
    });
    if (authData?.user) {
      authUserId = authData.user.id;
    }
  } catch {
    // If user already exists in auth, continue
  }

  const insertPayload: { id?: string; email: string; full_name: string } = {
    email,
    full_name: userData.name,
  };
  if (authUserId) {
    insertPayload.id = authUserId;
  }

  const { data: created, error } = await supabase
    .from("users")
    .upsert(insertPayload, { onConflict: "email" })
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to create database user: ${error?.message}`);
  }

  devPasswordHashes.set(created.id, {
    hash: userData.passwordHash,
    salt: userData.salt,
  });

  return {
    id: created.id,
    email: created.email,
    name: created.full_name || userData.name,
    role: userData.role || "user",
    emailVerified: true,
    createdAt: created.created_at,
    updatedAt: created.created_at,
    passwordHash: userData.passwordHash,
    salt: userData.salt,
  };
}

export async function updateDbUserPassword(
  userId: string,
  passwordHash: string,
  salt: string,
  rawPassword?: string
): Promise<boolean> {
  devPasswordHashes.set(userId, { hash: passwordHash, salt });
  if (rawPassword) {
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.auth.admin.updateUserById(userId, { password: rawPassword });
    } catch (err) {
      console.warn("Notice: GoTrue updateUserById password update notice:", err);
    }
  }
  return true;
}

// Single authoritative store delegation for password reset tokens
export {
  saveResetToken,
  findResetToken,
  deleteResetToken,
} from "@/lib/auth/store";

