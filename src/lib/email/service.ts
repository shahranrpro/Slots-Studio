/**
 * Slots Studio — Transactional Email Service
 *
 * Central service orchestrating transactional emails with:
 * - Pluggable provider architecture (Resend with Dev fallback)
 * - Idempotency guards (zero duplicate emails on worker retry)
 * - Non-blocking execution safety (email failures do not crash parent jobs)
 * - Error sanitization and persistent delivery logging
 */

import {
  type TransactionalEmailProvider,
  type EmailSendResult,
  type PasswordResetEmailParams,
  type WorkspaceInviteEmailParams,
  type JobCompletedEmailParams,
  type JobFailedEmailParams,
  type WelcomeEmailParams,
  type EmailTemplateType,
} from "./types";
import { DevEmailProviderAdapter } from "./providers/devProvider";
import { ResendEmailProvider } from "./providers/resendProvider";
import { logEmailDelivery, findEmailLogByIdempotencyKey } from "./store";

class EmailService {
  private provider: TransactionalEmailProvider;

  constructor() {
    this.provider = this.initProvider();
  }

  private initProvider(): TransactionalEmailProvider {
    const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
    const explicitProvider = process.env.EMAIL_PROVIDER?.toLowerCase();

    if (explicitProvider === "dev" || !resendApiKey) {
      return new DevEmailProviderAdapter();
    }

    return new ResendEmailProvider(resendApiKey, process.env.EMAIL_FROM);
  }

  public getActiveProviderName(): string {
    return this.provider.name;
  }

  public isProductionEmailConfigured(): boolean {
    return this.provider.name !== "dev_mock" && Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY);
  }

  /**
   * Dispatches email safely with idempotency protection and persistent logging.
   */
  private async executeSend(
    template: EmailTemplateType,
    recipientEmail: string,
    subject: string,
    idempotencyKey: string | undefined,
    sendFn: () => Promise<EmailSendResult>,
    options?: {
      workspaceId?: string;
      userId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<EmailSendResult> {
    const now = new Date().toISOString();

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existing = await findEmailLogByIdempotencyKey(idempotencyKey);
      if (existing) {
        return {
          success: existing.status === "ACCEPTED" || existing.status === "DELIVERED" || existing.status === "DEV_PREVIEW_MOCK",
          messageId: existing.providerMessageId || existing.id,
          provider: existing.provider,
          status: existing.status,
          timestamp: existing.updatedAt,
        };
      }
    }

    const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      // 2. Dispatch via active provider
      const result = await sendFn();

      // 3. Log delivery
      await logEmailDelivery({
        id: logId,
        workspaceId: options?.workspaceId || null,
        userId: options?.userId || null,
        recipientEmail,
        template,
        subject,
        provider: result.provider,
        status: result.status,
        providerMessageId: result.messageId || null,
        idempotencyKey: idempotencyKey || null,
        retryCount: 0,
        maxRetries: 3,
        errorMessage: result.error || null,
        metadata: options?.metadata || {},
        createdAt: now,
        updatedAt: now,
      });

      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown email dispatch fault";

      await logEmailDelivery({
        id: logId,
        workspaceId: options?.workspaceId || null,
        userId: options?.userId || null,
        recipientEmail,
        template,
        subject,
        provider: this.provider.name,
        status: "FAILED",
        idempotencyKey: idempotencyKey || null,
        retryCount: 0,
        maxRetries: 3,
        errorMessage: errorMsg,
        metadata: options?.metadata || {},
        createdAt: now,
        updatedAt: now,
      });

      return {
        success: false,
        provider: this.provider.name,
        status: "FAILED",
        error: errorMsg,
        timestamp: now,
      };
    }
  }

  public async sendPasswordReset(
    params: PasswordResetEmailParams,
    options?: { userId?: string; idempotencyKey?: string }
  ): Promise<EmailSendResult> {
    return this.executeSend(
      "PASSWORD_RESET",
      params.to,
      "Reset your Slots Studio password",
      options?.idempotencyKey,
      () => this.provider.sendPasswordReset(params),
      { userId: options?.userId, metadata: { resetUrl: params.resetUrl } }
    );
  }

  public async sendWorkspaceInvite(
    params: WorkspaceInviteEmailParams,
    options?: { workspaceId?: string; idempotencyKey?: string }
  ): Promise<EmailSendResult> {
    return this.executeSend(
      "WORKSPACE_INVITE",
      params.to,
      `Invitation to join ${params.workspaceName} on Slots Studio`,
      options?.idempotencyKey,
      () => this.provider.sendWorkspaceInvite(params),
      {
        workspaceId: options?.workspaceId,
        metadata: {
          workspaceName: params.workspaceName,
          role: params.role,
          inviteUrl: params.inviteUrl,
        },
      }
    );
  }

  public async sendJobCompleted(
    params: JobCompletedEmailParams,
    options?: { workspaceId?: string; userId?: string; jobId?: string }
  ): Promise<EmailSendResult> {
    const idempotencyKey = options?.jobId ? `job_completed_email_${options.jobId}` : undefined;

    return this.executeSend(
      "JOB_COMPLETED",
      params.to,
      `[Completed] ${params.studio} Studio: ${params.jobTitle}`,
      idempotencyKey,
      () => this.provider.sendJobCompleted(params),
      {
        workspaceId: options?.workspaceId,
        userId: options?.userId,
        metadata: {
          jobId: options?.jobId,
          studio: params.studio,
          jobUrl: params.jobUrl,
        },
      }
    );
  }

  public async sendJobFailed(
    params: JobFailedEmailParams,
    options?: { workspaceId?: string; userId?: string; jobId?: string }
  ): Promise<EmailSendResult> {
    const idempotencyKey = options?.jobId ? `job_failed_email_${options.jobId}` : undefined;

    return this.executeSend(
      "JOB_FAILED",
      params.to,
      `[Alert] ${params.studio} Studio: ${params.jobTitle} Failed`,
      idempotencyKey,
      () => this.provider.sendJobFailed(params),
      {
        workspaceId: options?.workspaceId,
        userId: options?.userId,
        metadata: {
          jobId: options?.jobId,
          studio: params.studio,
          jobUrl: params.jobUrl,
          errorMessageSafe: params.errorMessageSafe,
        },
      }
    );
  }

  public async sendWelcome(
    params: WelcomeEmailParams,
    options?: { userId?: string }
  ): Promise<EmailSendResult> {
    const idempotencyKey = `welcome_email_${params.to.toLowerCase()}`;

    return this.executeSend(
      "WELCOME",
      params.to,
      "Welcome to Slots Studio",
      idempotencyKey,
      () => this.provider.sendWelcome(params),
      { userId: options?.userId }
    );
  }

  /**
   * Sends an admin notification email (signup or login) via the raw provider.
   * Called exclusively from adminNotifications.ts — never from browser code.
   */
  public async sendAdminNotification(
    to: string,
    subject: string,
    html: string,
    text: string,
    idempotencyKey: string,
    template: EmailTemplateType,
    options?: { userId?: string }
  ): Promise<EmailSendResult> {
    return this.executeSend(
      template,
      to,
      subject,
      idempotencyKey,
      () => this.provider.sendRaw({ to, subject, html, text }),
      { userId: options?.userId }
    );
  }
}

export const emailService = new EmailService();

