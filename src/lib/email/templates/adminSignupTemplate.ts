/**
 * Slots Studio — Admin Signup Notification Email Template
 *
 * Sent to ADMIN_NOTIFICATION_EMAIL whenever a new user signs up.
 * Does NOT include passwords, tokens, secrets, or private content.
 */

export interface AdminSignupEmailParams {
  adminEmail: string;
  userEmail: string;
  userId: string;
  userName: string;
  signupTimestamp: string;
  workspaceId?: string;
  workspaceName?: string;
  role?: string;
}

export function renderAdminSignupEmail(params: AdminSignupEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Slots Studio — New User Signup";

  const text = [
    "Slots Studio — New User Signup",
    "═══════════════════════════════",
    "",
    `User Email:     ${params.userEmail}`,
    `User Name:      ${params.userName}`,
    `User ID:        ${params.userId}`,
    `Signup Time:    ${params.signupTimestamp}`,
    `Workspace ID:   ${params.workspaceId || "(provisioning)"}`,
    `Workspace Name: ${params.workspaceName || "(provisioning)"}`,
    `Role:           ${params.role || "OWNER"}`,
    "",
    "This is an automated admin notification from Slots Studio.",
    "Do not reply to this email.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:8px;border:1px solid #222;overflow:hidden;">
          <tr>
            <td style="background:#b7ff00;padding:16px 24px;">
              <span style="color:#000;font-size:18px;font-weight:700;letter-spacing:0.05em;">SLOTS STUDIO</span>
              <span style="color:#000;font-size:14px;font-weight:400;margin-left:8px;">Admin Notification</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="color:#b7ff00;font-size:20px;margin:0 0 24px;">New User Signup</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;width:140px;vertical-align:top;">User Email</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${params.userEmail}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">User Name</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.userName}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">User ID</td>
                  <td style="color:#888;font-size:12px;padding:8px 0;border-top:1px solid #222;font-family:monospace;">${params.userId}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">Signup Time</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.signupTimestamp}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">Workspace ID</td>
                  <td style="color:#888;font-size:12px;padding:8px 0;border-top:1px solid #222;font-family:monospace;">${params.workspaceId || "(provisioning)"}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">Workspace Name</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.workspaceName || "(provisioning)"}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;vertical-align:top;">Role</td>
                  <td style="color:#b7ff00;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.role || "OWNER"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #222;">
              <p style="color:#555;font-size:11px;margin:0;">Automated admin notification · Slots Studio · Do not reply</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
