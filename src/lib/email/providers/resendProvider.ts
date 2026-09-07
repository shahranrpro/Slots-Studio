/**
 * Slots Studio — Resend Transactional Email Provider
 *
 * Direct integration with Resend REST API (https://api.resend.com/emails)
 * using server-side fetch without external heavy dependencies.
 */

import { Resend } from "resend";
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

export class ResendEmailProvider implements TransactionalEmailProvider {
  public readonly name = "resend";
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor(apiKey: string, fromAddress?: string) {
    this.resend = new Resend(apiKey);
    // Defaults to onboarding@resend.dev until user verifies custom domain in Resend
    this.fromAddress = fromAddress || process.env.EMAIL_FROM || "Slots Studio <onboarding@resend.dev>";
  }

  private async dispatchEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<EmailSendResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        return {
          success: false,
          provider: this.name,
          status: "FAILED",
          error: error.message || "Resend rejected email dispatch",
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        messageId: data?.id,
        provider: this.name,
        status: "ACCEPTED",
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network fault connecting to Resend";
      return {
        success: false,
        provider: this.name,
        status: "FAILED",
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }

  public async sendPasswordReset(params: PasswordResetEmailParams): Promise<EmailSendResult> {
    const { subject, html, text } = renderPasswordResetEmail(params);
    return this.dispatchEmail(params.to, subject, html, text);
  }

  public async sendWorkspaceInvite(params: WorkspaceInviteEmailParams): Promise<EmailSendResult> {
    const { subject, html, text } = renderWorkspaceInviteEmail(params);
    return this.dispatchEmail(params.to, subject, html, text);
  }

  public async sendJobCompleted(params: JobCompletedEmailParams): Promise<EmailSendResult> {
    const { subject, html, text } = renderJobCompletedEmail(params);
    return this.dispatchEmail(params.to, subject, html, text);
  }

  public async sendJobFailed(params: JobFailedEmailParams): Promise<EmailSendResult> {
    const { subject, html, text } = renderJobFailedEmail(params);
    return this.dispatchEmail(params.to, subject, html, text);
  }

  public async sendWelcome(params: WelcomeEmailParams): Promise<EmailSendResult> {
    const { subject, html, text } = renderWelcomeEmail(params);
    return this.dispatchEmail(params.to, subject, html, text);
  }

  public async sendRaw(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<EmailSendResult> {
    return this.dispatchEmail(params.to, params.subject, params.html, params.text);
  }
}
