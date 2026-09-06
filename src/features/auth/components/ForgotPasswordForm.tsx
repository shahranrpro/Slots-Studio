"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { AuthHeader } from "./AuthHeader";
import { AuthError } from "./AuthError";
import { AuthSuccess } from "./AuthSuccess";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevToken(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to process recovery request.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message);
      if (data.devToken) {
        setDevToken(data.devToken);
      }
      setIsLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthHeader
        title="RECOVER YOUR PASSWORD"
        subtitle="Enter the email associated with your account to receive recovery instructions."
      />

      <AuthError message={error} />
      <AuthSuccess message={successMessage} />

      {devToken && (
        <div className="rounded-[var(--radius-md)] border border-[var(--accent)]/40 bg-[var(--surface-2)] p-3 text-[11px] font-mono space-y-2">
          <span className="text-[var(--accent)] font-bold uppercase">Development Recovery Link:</span>
          <p className="text-[var(--text-secondary)] break-all">
            Token: <span className="text-[var(--text-primary)]">{devToken}</span>
          </p>
          <Link
            href={`/reset-password?token=${encodeURIComponent(devToken)}`}
            className="inline-flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline"
          >
            <span>Proceed to password reset</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Account Email" htmlFor="forgot-email" required>
            <Input
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="alex@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Send Recovery Instructions
          </Button>
        </form>
      )}

      <Divider />

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
