import { renderBaseEmail } from "./baseTemplate";
import { type PasswordResetEmailParams } from "../types";

export function renderPasswordResetEmail({
  resetUrl,
  user,
}: PasswordResetEmailParams): { subject: string; html: string; text: string } {
  const subject = "Reset your Slots Studio password";
  const greeting = user?.name ? `Hello ${user.name},` : "Hello,";

  const contentHtml = `
    <p style="font-size: 15px; color: #ffffff; margin-top: 0;">${greeting}</p>
    <p>We received a request to reset the password associated with your account. Click the button below to choose a new password:</p>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">Reset Password</a>
    </div>

    <div class="info-box">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa;">This recovery link expires in <strong>1 hour</strong>. If you did not request this password reset, you can safely ignore this email; your account remains secure.</p>
      <p style="margin: 0; font-size: 11px; color: #71717a; word-break: break-all;" class="mono">Link: ${resetUrl}</p>
    </div>
  `;

  const html = renderBaseEmail({
    previewText: "Password reset request for your Slots Studio account",
    headerTitle: "PASSWORD RESET",
    contentHtml,
    footerNotice: "Security notice: Never share this recovery link with anyone.",
  });

  const text = `${greeting}\n\nWe received a request to reset your password. Use the following link to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please disregard.`;

  return { subject, html, text };
}
