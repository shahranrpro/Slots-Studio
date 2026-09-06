/**
 * Slots Studio — Authentication Data Types & Interfaces
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  role: "user" | "admin";
}

export interface UserWithPassword extends User {
  passwordHash: string;
  salt: string;
}

export interface Session {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
  expiresAt: number; // UNIX timestamp in ms
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
}
