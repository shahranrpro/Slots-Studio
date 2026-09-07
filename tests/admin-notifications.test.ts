/**
 * SLOTS STUDIO — ADMIN NOTIFICATIONS TYPE TEST
 *
 * Validates module exports, typings, and contracts for:
 * - AdminSignupEmailParams & renderAdminSignupEmail
 * - AdminLoginEmailParams & renderAdminLoginNotificationEmail
 * - sendSignupNotification & sendLoginNotification
 */

import {
  renderAdminSignupEmail,
  type AdminSignupEmailParams,
} from "@/lib/email/templates/adminSignupTemplate";
import {
  renderAdminLoginNotificationEmail,
  type AdminLoginEmailParams,
} from "@/lib/email/templates/adminLoginTemplate";
import {
  sendSignupNotification,
  sendLoginNotification,
  type SignupNotificationPayload,
  type LoginNotificationPayload,
} from "@/lib/email/adminNotifications";

export function verifyAdminNotificationTypes() {
  const signupParams: AdminSignupEmailParams = {
    adminEmail: "admin@slots.studio",
    userEmail: "creator@example.com",
    userId: "11111111-1111-1111-1111-111111111111",
    userName: "Alex Creator",
    signupTimestamp: new Date().toUTCString(),
    workspaceId: "22222222-2222-2222-2222-222222222222",
    workspaceName: "Alex's Studio",
    role: "OWNER",
  };

  const signupRender = renderAdminSignupEmail(signupParams);

  const loginParams: AdminLoginEmailParams = {
    adminEmail: "admin@slots.studio",
    userEmail: "creator@example.com",
    userId: "11111111-1111-1111-1111-111111111111",
    userName: "Alex Creator",
    loginTimestamp: new Date().toUTCString(),
    workspaceId: "22222222-2222-2222-2222-222222222222",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    ipAddress: "127.0.0.1",
  };

  const loginRender = renderAdminLoginNotificationEmail(loginParams);

  const signupPayload: SignupNotificationPayload = {
    userId: "11111111-1111-1111-1111-111111111111",
    email: "creator@example.com",
    name: "Alex Creator",
    workspaceId: "22222222-2222-2222-2222-222222222222",
    workspaceName: "Alex's Studio",
    role: "OWNER",
  };

  const loginPayload: LoginNotificationPayload = {
    userId: "11111111-1111-1111-1111-111111111111",
    email: "creator@example.com",
    name: "Alex Creator",
    workspaceId: "22222222-2222-2222-2222-222222222222",
    userAgent: "Mozilla/5.0",
    ipAddress: "127.0.0.1",
  };

  return { signupRender, loginRender, signupPayload, loginPayload, sendSignupNotification, sendLoginNotification };
}
