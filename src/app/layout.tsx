import type { Metadata, Viewport } from "next";
import { sora, inter } from "@/lib/fonts";
import "@/styles/globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  metadataBase: new URL(APP_CONFIG.url),
  icons: {
    icon: "/brand/logo/logo.png",
    apple: "/brand/logo/logo.png",
  },
  openGraph: {
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    images: [
      {
        url: "/og/default-og.png",
        width: 1200,
        height: 630,
        alt: APP_CONFIG.name,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    images: ["/og/default-og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var key = 'slots-studio-appearance';
                  var stored = localStorage.getItem(key);
                  var effective = 'dark';
                  if (stored === 'light' || stored === 'dark') {
                    effective = stored;
                  } else {
                    effective = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', effective);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
