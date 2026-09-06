import React, { Suspense } from "react";
import { type Metadata } from "next";
import { AuthShell, ResetPasswordForm } from "@/features/auth";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Reset Password — Slots Studio",
  description: "Set a new password for your Slots Studio account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
