import React, { Suspense } from "react";
import { type Metadata } from "next";
import { AuthShell, ForgotPasswordForm } from "@/features/auth";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Recover Password — Slots Studio",
  description: "Request password recovery instructions for your Slots Studio account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
