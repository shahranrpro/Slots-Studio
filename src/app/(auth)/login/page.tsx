import React, { Suspense } from "react";
import { type Metadata } from "next";
import { AuthShell, LoginForm } from "@/features/auth";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Sign In — Slots Studio",
  description: "Sign in to your Slots Studio creative workspace and access all five studios.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
