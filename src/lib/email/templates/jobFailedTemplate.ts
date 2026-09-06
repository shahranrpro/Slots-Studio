import { renderBaseEmail } from "./baseTemplate";
import { type JobFailedEmailParams } from "../types";

export function renderJobFailedEmail({
  jobTitle,
  studio,
  jobUrl,
  errorMessageSafe,
}: JobFailedEmailParams): { subject: string; html: string; text: string } {
  const subject = `[Alert] ${studio} Studio: ${jobTitle} Failed`;

  const contentHtml = `
    <p style="font-size: 15px; color: #ffffff; margin-top: 0;">Generation pipeline alert.</p>
    <p>A background execution job in <strong>${studio} Studio</strong> encountered an issue and could not complete after maximum retry attempts.</p>

    <div class="info-box" style="border-left: 3px solid #ef4444;">
      <div style="font-size: 11px; text-transform: uppercase; color: #ef4444; letter-spacing: 0.1em; margin-bottom: 4px;">Error Details</div>
      <div style="font-size: 13px; color: #ffffff;">${errorMessageSafe}</div>
      <div style="font-size: 11px; color: #71717a; margin-top: 6px;">Note: Any unconsumed credits have been preserved.</div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${jobUrl}" class="btn" style="background-color: #27272a; color: #ffffff !important;" target="_blank" rel="noopener noreferrer">View In Jobs Pipeline</a>
    </div>
  `;

  const html = renderBaseEmail({
    previewText: `Execution alert: ${jobTitle} encountered an error in ${studio} Studio`,
    headerTitle: "EXECUTION NOTICE",
    contentHtml,
  });

  const text = `Alert: Your generation job "${jobTitle}" in ${studio} Studio failed.\n\nReason: ${errorMessageSafe}\n\nYou can review or retry the job at:\n${jobUrl}`;

  return { subject, html, text };
}
