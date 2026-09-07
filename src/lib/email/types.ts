/**
 * Slots Studio — Transactional Email Engine Types
 *
 * Defines the provider-agnostic interface and payload contracts
 * for transactional email delivery (Resend / Dev Provider).
 */

export type EmailTemplateType =
  | "PASSWORD_RESET"
  | "WORKSPACE_INVITE"
  | "JOB_COMPLETED"
  | "JOB_FAILED"
  | "WELCOME"
  | "ADMIN_SIGNUP_NOTIFICATION"
  | "ADMIN_LOGIN_NOTIFICATION";


export type EmailDeliveryStatus =
  | "ACCEPTED"
  | "DELIVERED"
  | "DEV_PREVIEW_MOCK"
  | "FAILED"
  | "RETRY_QUEUED";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  status: EmailDeliveryStatus;
  error?: string;
  timestamp: string;
}

export interface PasswordResetEmailParams {
  to: string;
  resetUrl: string;
  user?: {
    name?: string;
  };
}

export interface WorkspaceInviteEmailParams {
  to: string;
  inviteUrl: string;
  workspaceName: string;
  inviterName: string;
  role: string;
}

export interface JobCompletedEmailParams {
  to: string;
  jobTitle: string;
  studio: string;
  jobUrl: string;
  completionSummary?: string;
  outputsCount?: number;
}

export interface JobFailedEmailParams {
  to: string;
  jobTitle: string;
  studio: string;
  jobUrl: string;
  errorMessageSafe: string;
}

export interface WelcomeEmailParams {
  to: string;
  fullName?: string;
  loginUrl: string;
}

export interface EmailLogEntry {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  recipientEmail: string;
  template: EmailTemplateType;
  subject: string;
  provider: string;
  status: EmailDeliveryStatus;
  providerMessageId?: string | null;
  idempotencyKey?: string | null;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionalEmailProvider {
  name: string;
  sendPasswordReset(params: PasswordResetEmailParams): Promise<EmailSendResult>;
  sendWorkspaceInvite(params: WorkspaceInviteEmailParams): Promise<EmailSendResult>;
  sendJobCompleted(params: JobCompletedEmailParams): Promise<EmailSendResult>;
  sendJobFailed(params: JobFailedEmailParams): Promise<EmailSendResult>;
  sendWelcome(params: WelcomeEmailParams): Promise<EmailSendResult>;
  sendRaw(params: { to: string; subject: string; html: string; text: string }): Promise<EmailSendResult>;
}

