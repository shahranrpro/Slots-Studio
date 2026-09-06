import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export default async function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/app");
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session) {
    redirect("/login?callbackUrl=/app");
  }

  return <>{children}</>;
}
