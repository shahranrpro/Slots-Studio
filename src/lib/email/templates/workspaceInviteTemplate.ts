import { renderBaseEmail } from "./baseTemplate";
import { type WorkspaceInviteEmailParams } from "../types";

export function renderWorkspaceInviteEmail({
  inviteUrl,
  workspaceName,
  inviterName,
  role,
}: WorkspaceInviteEmailParams): { subject: string; html: string; text: string } {
  const subject = `Invitation to join ${workspaceName} on Slots Studio`;

  const contentHtml = `
    <p style="font-size: 15px; color: #ffffff; margin-top: 0;">You're invited to collaborate.</p>
    <p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace on Slots Studio with the role of <strong>${role}</strong>.</p>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="${inviteUrl}" class="btn" target="_blank" rel="noopener noreferrer">Accept Invitation</a>
    </div>

    <div class="info-box">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa;">This invitation link will expire in <strong>7 days</strong>.</p>
      <p style="margin: 0; font-size: 11px; color: #71717a; word-break: break-all;" class="mono">Direct URL: ${inviteUrl}</p>
    </div>
  `;

  const html = renderBaseEmail({
    previewText: `You have been invited to join ${workspaceName} on Slots Studio`,
    headerTitle: "WORKSPACE INVITATION",
    contentHtml,
  });

  const text = `You're invited to join ${workspaceName} on Slots Studio.\n\n${inviterName} has invited you as a ${role}.\n\nAccept your invitation using this link:\n${inviteUrl}\n\nThis invitation will expire in 7 days.`;

  return { subject, html, text };
}
