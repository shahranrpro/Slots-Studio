import { renderBaseEmail } from "./baseTemplate";
import { type WelcomeEmailParams } from "../types";

export function renderWelcomeEmail({
  fullName,
  loginUrl,
}: WelcomeEmailParams): { subject: string; html: string; text: string } {
  const subject = "Welcome to Slots Studio";
  const greeting = fullName ? `Welcome, ${fullName}!` : "Welcome to Slots Studio!";

  const contentHtml = `
    <p style="font-size: 15px; color: #ffffff; margin-top: 0;">${greeting}</p>
    <p>Your Slots Studio workspace is now initialized. Slots Studio delivers high-performance generative AI pipelines engineered specifically for technical sportswear, apparel design, and creative campaign production.</p>

    <div class="info-box">
      <div style="font-size: 11px; text-transform: uppercase; color: #b7ff00; letter-spacing: 0.1em; margin-bottom: 6px;">Quick Start Guide</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #d4d4d8;">
        <li style="margin-bottom: 6px;"><strong>Visual Studio:</strong> Generate apparel renders across 6 cinematic modes.</li>
        <li style="margin-bottom: 6px;"><strong>Product Studio:</strong> Synthesize collection briefs and design concepts.</li>
        <li style="margin-bottom: 6px;"><strong>Content Studio:</strong> Generate performance copy, technical bullet points, and social posts.</li>
        <li><strong>Production Studio:</strong> Create tech packs and Bills of Materials (BOM).</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${loginUrl}" class="btn" target="_blank" rel="noopener noreferrer">Launch Studio</a>
    </div>
  `;

  const html = renderBaseEmail({
    previewText: "Welcome to Slots Studio — Technical Sportswear Generative Platform",
    headerTitle: "WELCOME TO SLOTS STUDIO",
    contentHtml,
  });

  const text = `${greeting}\n\nYour account has been created on Slots Studio. Launch the application here:\n${loginUrl}\n\nExplore Visual Studio, Product Studio, Content Studio, and Production Studio.`;

  return { subject, html, text };
}
