/**
 * Slots Studio — Base Email Template
 *
 * Provides a responsive, accessible HTML email shell styled with
 * Slots Sportswear brand design (Black #050505, Electric Lime #B7FF00, White #FFFFFF).
 */

export interface BaseEmailProps {
  previewText: string;
  headerTitle?: string;
  contentHtml: string;
  footerNotice?: string;
}

export function renderBaseEmail({
  previewText,
  headerTitle = "SLOTS SPORTSWEAR",
  contentHtml,
  footerNotice = "This is an automated operational notification from Slots Studio.",
}: BaseEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0d0e;
      color: #ededed;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0c0d0e;
      padding: 40px 16px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #141518;
      border: 1px solid #27272a;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      padding: 28px 32px 20px 32px;
      border-bottom: 1px solid #27272a;
      background-color: #0f1012;
    }
    .brand-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #b7ff00;
      margin: 0 0 6px 0;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0;
    }
    .content {
      padding: 32px;
      font-size: 14px;
      line-height: 1.6;
      color: #d4d4d8;
    }
    .btn {
      display: inline-block;
      background-color: #b7ff00;
      color: #000000 !important;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      padding: 20px 32px;
      background-color: #0f1012;
      border-top: 1px solid #27272a;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
    }
    .info-box {
      background-color: #1c1d22;
      border: 1px solid #2e3038;
      border-radius: 6px;
      padding: 16px;
      margin: 16px 0;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
  </style>
</head>
<body>
  <!-- Preheader preview text -->
  <div style="display:none;font-size:1px;color:#0c0d0e;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </div>

  <table class="wrapper" role="presentation">
    <tr>
      <td align="center">
        <table class="container" role="presentation">
          <tr>
            <td class="header">
              <div class="brand-tag">SLOTS SPORTSWEAR // STUDIO SYSTEM</div>
              <h1 class="brand-title">${headerTitle}</h1>
            </td>
          </tr>
          <tr>
            <td class="content">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <div>${footerNotice}</div>
              <div style="margin-top: 8px;">&copy; ${new Date().getFullYear()} SLOTS SPORTSWEAR. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
