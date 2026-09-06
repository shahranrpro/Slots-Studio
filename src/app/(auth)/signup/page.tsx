import React, { Suspense } from "react";
import { type Metadata } from "next";
import { AuthShell, SignupForm } from "@/features/auth";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Create Account — Slots Studio",
  description: "Create your Slots Studio account and start building unified product context.",
};

export default function SignupPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
