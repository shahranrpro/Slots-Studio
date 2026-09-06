/**
 * Slots Studio — Development Mock Email Provider
 *
 * Provides honest local development email emulation without sending real emails.
 * Never falsely claims real delivery; always returns status DEV_PREVIEW_MOCK.
 */

import {
  type TransactionalEmailProvider,
  type EmailSendResult,
  type PasswordResetEmailParams,
  type WorkspaceInviteEmailParams,
  type JobCompletedEmailParams,
  type JobFailedEmailParams,
  type WelcomeEmailParams,
} from "../types";
import { renderPasswordResetEmail } from "../templates/passwordResetTemplate";
import { renderWorkspaceInviteEmail } from "../templates/workspaceInviteTemplate";
import { renderJobCompletedEmail } from "../templates/jobCompletedTemplate";
import { renderJobFailedEmail } from "../templates/jobFailedTemplate";
import { renderWelcomeEmail } from "../templates/welcomeTemplate";

export class DevEmailProviderAdapter implements TransactionalEmailProvider {
  public readonly name = "dev_mock";

  private logMockDelivery(to: string, subject: string, template: string, previewUrl?: string) {
    console.log(`[EMAIL_DEV_PREVIEW_MOCK] Template: ${template} | Recipient: ${to} | Subject: "${subject}"`);
    if (previewUrl) {
      console.log(`[EMAIL_DEV_PREVIEW_MOCK] Action Link: ${previewUrl}`);
    }
  }

  public async sendPasswordReset(params: PasswordResetEmailParams): Promise<EmailSendResult> {
    const { subject } = renderPasswordResetEmail(params);
    this.logMockDelivery(params.to, subject, "PASSWORD_RESET", params.resetUrl);

    return {
      success: true,
      messageId: `dev_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      status: "DEV_PREVIEW_MOCK",
      timestamp: new Date().toISOString(),
    };
  }

  public async sendWorkspaceInvite(params: WorkspaceInviteEmailParams): Promise<EmailSendResult> {
    const { subject } = renderWorkspaceInviteEmail(params);
    this.logMockDelivery(params.to, subject, "WORKSPACE_INVITE", params.inviteUrl);

    return {
      success: true,
      messageId: `dev_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      status: "DEV_PREVIEW_MOCK",
      timestamp: new Date().toISOString(),
    };
  }

  public async sendJobCompleted(params: JobCompletedEmailParams): Promise<EmailSendResult> {
    const { subject } = renderJobCompletedEmail(params);
    this.logMockDelivery(params.to, subject, "JOB_COMPLETED", params.jobUrl);

    return {
      success: true,
      messageId: `dev_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      status: "DEV_PREVIEW_MOCK",
      timestamp: new Date().toISOString(),
    };
  }

  public async sendJobFailed(params: JobFailedEmailParams): Promise<EmailSendResult> {
    const { subject } = renderJobFailedEmail(params);
    this.logMockDelivery(params.to, subject, "JOB_FAILED", params.jobUrl);

    return {
      success: true,
      messageId: `dev_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      status: "DEV_PREVIEW_MOCK",
      timestamp: new Date().toISOString(),
    };
  }

  public async sendWelcome(params: WelcomeEmailParams): Promise<EmailSendResult> {
    const { subject } = renderWelcomeEmail(params);
    this.logMockDelivery(params.to, subject, "WELCOME", params.loginUrl);

    return {
      success: true,
      messageId: `dev_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      status: "DEV_PREVIEW_MOCK",
      timestamp: new Date().toISOString(),
    };
  }
}
