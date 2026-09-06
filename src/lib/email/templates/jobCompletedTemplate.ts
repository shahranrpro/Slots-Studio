import { renderBaseEmail } from "./baseTemplate";
import { type JobCompletedEmailParams } from "../types";

export function renderJobCompletedEmail({
  jobTitle,
  studio,
  jobUrl,
  completionSummary = "Generation finished successfully.",
  outputsCount = 1,
}: JobCompletedEmailParams): { subject: string; html: string; text: string } {
  const subject = `[Completed] ${studio} Studio: ${jobTitle}`;

  const contentHtml = `
    <p style="font-size: 15px; color: #ffffff; margin-top: 0;">Your generation job is ready.</p>
    <p>The background pipeline in <strong>${studio} Studio</strong> has concluded processing with <strong>${outputsCount}</strong> generated output(s).</p>

    <div class="info-box">
      <div style="font-size: 11px; text-transform: uppercase; color: #b7ff00; letter-spacing: 0.1em; margin-bottom: 4px;">Job Summary</div>
      <div style="font-size: 14px; font-weight: 600; color: #ffffff;">${jobTitle}</div>
      <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px;">${completionSummary}</div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${jobUrl}" class="btn" target="_blank" rel="noopener noreferrer">Review Outputs</a>
    </div>
  `;

  const html = renderBaseEmail({
    previewText: `Your ${studio} Studio generation for "${jobTitle}" has completed`,
    headerTitle: "GENERATION COMPLETE",
    contentHtml,
  });

  const text = `Your generation job in ${studio} Studio has completed.\n\nJob: ${jobTitle}\nSummary: ${completionSummary}\nOutputs: ${outputsCount}\n\nReview your results at:\n${jobUrl}`;

  return { subject, html, text };
}
