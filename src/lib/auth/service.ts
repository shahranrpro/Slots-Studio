import {
  type AuthResult,
  type Session,
  type User,
  type UserWithPassword,
} from "./types";
import { generateSalt, hashPassword, verifyPassword } from "./passwords";
import { createPasswordResetToken } from "./tokens";
import {
  createUser,
  findUserByEmail,
  findUserById,
  saveResetToken,
  findResetToken,
  deleteResetToken,
  updateUserPassword,
} from "./store";
import {
  findUserByEmail as findDbUserByEmail,
  findUserById as findDbUserById,
  createDbUser,
  updateDbUserPassword as updateDbPassword,
} from "@/lib/supabase/repositories/authRepository";
import { ensureDatabaseSeeded } from "@/lib/supabase/seed";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createSessionData } from "./session";
import { emailService } from "@/lib/email/service";

export function sanitizeUser(user: UserWithPassword): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function loginUser(
  emailInput: string,
  passwordInput: string
): Promise<AuthResult<{ user: User; session: Session }>> {
  const email = emailInput?.trim().toLowerCase();
  const password = passwordInput;

  if (!email || !password) {
    return {
      success: false,
      error: "Please provide both email and password.",
    };
  }

  await ensureDatabaseSeeded();

  // 1. Authoritative verification via Supabase GoTrue Auth
  let authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null = null;
  let goTrueFailedCredentials = false;

  try {
    const { url, anonKey } = getSupabaseEnv();
    const supabase = createSupabaseClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authErr && authData?.user) {
      authUser = authData.user;
    } else if (authErr && (authErr.message?.toLowerCase().includes("invalid login credentials") || authErr.status === 400)) {
      goTrueFailedCredentials = true;
    }
  } catch {
    // Network / WAN offline fallback
  }

  if (authUser) {
    // Sync / retrieve profile from public.users
    let dbUser = await findDbUserById(authUser.id);
    if (!dbUser) {
      try {
        const admin = createAdminSupabaseClient();
        await admin.from("users").upsert({
          id: authUser.id,
          email: authUser.email || email,
          full_name: (authUser.user_metadata?.full_name as string) || "User",
        }, { onConflict: "id" });
        dbUser = await findDbUserById(authUser.id);
      } catch (err) {
        console.warn("Notice: public.users profile sync notice:", err);
      }
    }

    const safeUser: User = {
      id: authUser.id,
      email: authUser.email || email,
      name: (authUser.user_metadata?.full_name as string) || dbUser?.name || "User",
      role: "user",
      emailVerified: true,
      createdAt: dbUser?.createdAt || new Date().toISOString(),
      updatedAt: dbUser?.updatedAt || new Date().toISOString(),
    };

    const session = createSessionData(safeUser);
    return {
      success: true,
      data: {
        user: safeUser,
        session,
      },
    };
  }

  // If GoTrue explicitly rejected the credentials, do not fall back unless seed account
  if (goTrueFailedCredentials && email !== "dev@slots.studio") {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  // 2. Fallback check for local development & seeded dev accounts
  let userRecord = await findUserByEmail(email);
  if (!userRecord) {
    userRecord = await findDbUserByEmail(email);
  }
  if (!userRecord) {
    // Return generic authentication failure to prevent user enumeration
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  const isMatch = await verifyPassword(password, userRecord.passwordHash, userRecord.salt);
  if (!isMatch) {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  const safeUser = sanitizeUser(userRecord);
  const session = createSessionData(safeUser);

  return {
    success: true,
    data: {
      user: safeUser,
      session,
    },
  };
}

export async function signupUser(
  nameInput: string,
  emailInput: string,
  passwordInput: string
): Promise<AuthResult<{ user: User; session: Session }>> {
  const name = nameInput?.trim();
  const email = emailInput?.trim().toLowerCase();
  const password = passwordInput;

  const fieldErrors: Record<string, string> = {};

  if (!name || name.length < 2) {
    fieldErrors.name = "Full name must be at least 2 characters.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!password || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      error: "Please resolve the validation errors above.",
    };
  }

  const existing = (await findUserByEmail(email)) || (await findDbUserByEmail(email));
  if (existing) {
    return {
      success: false,
      error: "An account with this email address already exists.",
      fieldErrors: { email: "Email is already registered." },
    };
  }

  const salt = generateSalt(16);
  const passwordHash = await hashPassword(password, salt);

  let newUserRecord: UserWithPassword;
  try {
    newUserRecord = await createDbUser({
      email,
      name,
      passwordHash,
      salt,
      role: "user",
      rawPassword: password,
    });
    // Also save in store for immediate local resolution
    await createUser(newUserRecord);
  } catch {
    newUserRecord = await createUser({
      email,
      name,
      passwordHash,
      salt,
      role: "user",
      emailVerified: false,
    });
  }

  const safeUser = sanitizeUser(newUserRecord);
  const session = createSessionData(safeUser);

  // Send welcome email (asynchronous & non-blocking)
  emailService
    .sendWelcome(
      {
        to: safeUser.email,
        fullName: safeUser.name,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`,
      },
      { userId: safeUser.id }
    )
    .catch((err) => console.warn("Welcome email dispatch notice:", err));

  return {
    success: true,
    data: {
      user: safeUser,
      session,
    },
  };
}

export async function requestPasswordReset(
  emailInput: string
): Promise<AuthResult<{ resetToken?: string }>> {
  const email = emailInput?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  const user = (await findUserByEmail(email)) || (await findDbUserByEmail(email));

  // Even if user does not exist, return neutral confirmation to prevent enumeration
  if (!user) {
    return {
      success: true,
      data: {},
    };
  }

  const tokenData = createPasswordResetToken(user.id, user.email);
  await saveResetToken(tokenData);

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${tokenData.token}`;

  // Dispatch password reset email (asynchronous & non-blocking)
  emailService
    .sendPasswordReset(
      {
        to: user.email,
        resetUrl,
        user: { name: user.name },
      },
      {
        userId: user.id,
        idempotencyKey: `pw_reset_${user.id}_${tokenData.token.slice(0, 10)}`,
      }
    )
    .catch((err) => console.warn("Password reset email dispatch notice:", err));

  return {
    success: true,
    data: {
      // Returned for local development testing & verification
      resetToken: tokenData.token,
    },
  };
}

export async function resetUserPassword(
  tokenInput: string,
  newPasswordInput: string
): Promise<AuthResult<{ success: boolean }>> {
  const token = tokenInput?.trim();
  const newPassword = newPasswordInput;

  if (!token) {
    return {
      success: false,
      error: "Invalid or missing recovery token.",
    };
  }

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters long.",
    };
  }

  const tokenRecord = await findResetToken(token);
  if (!tokenRecord) {
    return {
      success: false,
      error: "This recovery link has expired or is invalid. Please request a new one.",
    };
  }

  const salt = generateSalt(16);
  const passwordHash = await hashPassword(newPassword, salt);

  const updated = await updateUserPassword(tokenRecord.userId, passwordHash, salt);
  await updateDbPassword(tokenRecord.userId, passwordHash, salt, newPassword).catch(() => {});
  if (!updated) {
    return {
      success: false,
      error: "Failed to update password. Please try again.",
    };
  }

  await deleteResetToken(token);

  return {
    success: true,
    data: { success: true },
  };
}

export async function getUserFromSession(session: Session | null): Promise<User | null> {
  if (!session?.userId) return null;
  const user = (await findUserById(session.userId)) || (await findDbUserById(session.userId));
  if (user) return sanitizeUser(user);

  // Safe fallback: If session token was cryptographically verified and carries user claims
  if (session.email && session.name) {
    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role || "user",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}
