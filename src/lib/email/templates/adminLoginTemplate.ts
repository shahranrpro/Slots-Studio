/**
 * Slots Studio — Admin Login Notification Email Template
 *
 * Sent to ADMIN_NOTIFICATION_EMAIL whenever a user logs in.
 * Does NOT include passwords, tokens, secrets, or private content.
 */

export interface AdminLoginEmailParams {
  adminEmail: string;
  userEmail: string;
  userId: string;
  userName: string;
  loginTimestamp: string;
  workspaceId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export function renderAdminLoginNotificationEmail(params: AdminLoginEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Slots Studio — User Login";

  const lines: string[] = [
    "Slots Studio — User Login",
    "══════════════════════════",
    "",
    `User Email:   ${params.userEmail}`,
    `User Name:    ${params.userName}`,
    `User ID:      ${params.userId}`,
    `Login Time:   ${params.loginTimestamp}`,
    `Workspace ID: ${params.workspaceId || "(resolving)"}`,
  ];
  if (params.userAgent) lines.push(`User Agent:   ${params.userAgent}`);
  if (params.ipAddress) lines.push(`IP Address:   ${params.ipAddress}`);
  lines.push("", "This is an automated admin notification from Slots Studio.", "Do not reply to this email.");

  const text = lines.join("\n");

  const uaRow = params.userAgent
    ? `<tr><td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">User Agent</td><td style="color:#666;font-size:11px;padding:8px 0;border-top:1px solid #222;">${params.userAgent}</td></tr>`
    : "";
  const ipRow = params.ipAddress
    ? `<tr><td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">IP Address</td><td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.ipAddress}</td></tr>`
    : "";

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
            <td style="background:#222;padding:16px 24px;">
              <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:0.05em;">SLOTS STUDIO</span>
              <span style="color:#888;font-size:14px;font-weight:400;margin-left:8px;">Admin Notification</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="color:#fff;font-size:20px;margin:0 0 24px;">User Login</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;width:140px;">User Email</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${params.userEmail}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">User Name</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.userName}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">User ID</td>
                  <td style="color:#888;font-size:12px;padding:8px 0;border-top:1px solid #222;font-family:monospace;">${params.userId}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">Login Time</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;border-top:1px solid #222;">${params.loginTimestamp}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:13px;padding:8px 0;border-top:1px solid #222;">Workspace ID</td>
                  <td style="color:#888;font-size:12px;padding:8px 0;border-top:1px solid #222;font-family:monospace;">${params.workspaceId || "(resolving)"}</td>
                </tr>
                ${uaRow}
                ${ipRow}
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
