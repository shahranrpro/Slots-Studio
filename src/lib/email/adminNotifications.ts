/**
 * Slots Studio — Admin Notification Service
 *
 * Server-side only. Sends signup and login notifications to ADMIN_NOTIFICATION_EMAIL.
 *
 * SECURITY:
 * - ADMIN_NOTIFICATION_EMAIL is read exclusively from process.env (server-side).
 * - Never exposed to the browser bundle.
 * - Email failures are caught and logged — they MUST NOT block auth operations.
 * - Idempotency keys prevent duplicate notifications for the same event.
 */

import { emailService } from "./service";
import { renderAdminSignupEmail } from "./templates/adminSignupTemplate";
import { renderAdminLoginNotificationEmail } from "./templates/adminLoginTemplate";

export interface SignupNotificationPayload {
  userId: string;
  email: string;
  name: string;
  workspaceId?: string;
  workspaceName?: string;
  role?: string;
}

export interface LoginNotificationPayload {
  userId: string;
  email: string;
  name: string;
  workspaceId?: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Sends an admin notification email when a new user signs up.
 * Non-blocking — caller should .catch() any thrown errors.
 */
export async function sendSignupNotification(
  payload: SignupNotificationPayload
): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    // No admin email configured — skip silently
    return;
  }

  const signupTimestamp = new Date().toUTCString();
  const idempotencyKey = "admin_signup_" + payload.userId;

  try {
    const { subject, html, text } = renderAdminSignupEmail({
      adminEmail,
      userEmail: payload.email,
      userId: payload.userId,
      userName: payload.name,
      signupTimestamp,
      workspaceId: payload.workspaceId,
      workspaceName: payload.workspaceName,
      role: payload.role || "OWNER",
    });

    await emailService.sendAdminNotification(
      adminEmail,
      subject,
      html,
      text,
      idempotencyKey,
      "ADMIN_SIGNUP_NOTIFICATION",
      { userId: payload.userId }
    );
  } catch (err) {
    console.warn("[admin-notify] sendSignupNotification failed (non-fatal):", err);
  }
}

/**
 * Sends an admin notification email when a user logs in.
 * Non-blocking — caller should .catch() any thrown errors.
 *
 * Uses a daily idempotency key to avoid flooding the inbox with login events:
 * one notification per user per UTC day.
 */
export async function sendLoginNotification(
  payload: LoginNotificationPayload
): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    return;
  }

  const loginTimestamp = new Date().toUTCString();
  // Daily idempotency: one admin login email per user per UTC day
  const dateKey = new Date().toISOString().slice(0, 10); // e.g. "2026-09-07"
  const idempotencyKey = "admin_login_" + payload.userId + "_" + dateKey;

  try {
    const { subject, html, text } = renderAdminLoginNotificationEmail({
      adminEmail,
      userEmail: payload.email,
      userId: payload.userId,
      userName: payload.name,
      loginTimestamp,
      workspaceId: payload.workspaceId,
      userAgent: payload.userAgent,
      ipAddress: payload.ipAddress,
    });

    await emailService.sendAdminNotification(
      adminEmail,
      subject,
      html,
      text,
      idempotencyKey,
      "ADMIN_LOGIN_NOTIFICATION",
      { userId: payload.userId }
    );
  } catch (err) {
    console.warn("[admin-notify] sendLoginNotification failed (non-fatal):", err);
  }
}
