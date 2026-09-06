/**
 * Slots Studio — Environment Variable Access & Validation Layer
 */

interface EnvConfig {
  appUrl: string;
  appName: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

export const env: EnvConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Slots Studio",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};
