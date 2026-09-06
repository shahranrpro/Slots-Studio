"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Divider } from "@/components/ui/Divider";
import { AuthHeader } from "./AuthHeader";
import { AuthError } from "./AuthError";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export function SignupForm() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validations
    const clientErrors: Record<string, string> = {};
    if (!name.trim()) clientErrors.name = "Full name is required.";
    if (!email.trim()) clientErrors.email = "Email address is required.";
    if (password.length < 8) clientErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) clientErrors.confirmPassword = "Passwords do not match.";
    if (!agreeTerms) clientErrors.agreeTerms = "You must agree to the Terms of Service.";

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError("Please fix the errors below.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account.");
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setIsLoading(false);
        return;
      }

      // Success: clean navigation to application workspace
      window.location.href = "/app";
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthHeader
        title="CREATE YOUR ACCOUNT"
        subtitle="Start building unified product context across all five creative studios."
      />

      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <FormField label="Full Name" htmlFor="signup-name" error={fieldErrors.name} required>
          <Input
            id="signup-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder="Alex Vance"
            leftIcon={<User className="h-4 w-4" />}
            value={name}
            error={Boolean(fieldErrors.name)}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Email Address */}
        <FormField label="Work Email" htmlFor="signup-email" error={fieldErrors.email} required>
          <Input
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="alex@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            error={Boolean(fieldErrors.email)}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Password */}
        <FormField
          label="Password (min. 8 characters)"
          htmlFor="signup-password"
          error={fieldErrors.password}
          required
        >
          <Input
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            placeholder="••••••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            value={password}
            error={Boolean(fieldErrors.password)}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Confirm Password */}
        <FormField
          label="Confirm Password"
          htmlFor="signup-confirm-password"
          error={fieldErrors.confirmPassword}
          required
        >
          <Input
            id="signup-confirm-password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            placeholder="••••••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            value={confirmPassword}
            error={Boolean(fieldErrors.confirmPassword)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Terms Checkbox */}
        <div className="space-y-1 pt-1">
          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link href="/terms" className="underline hover:text-[var(--accent)]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-[var(--accent)]">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isLoading}
          />
          {fieldErrors.agreeTerms && (
            <p className="text-[11px] text-red-400 font-medium">{fieldErrors.agreeTerms}</p>
          )}
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create Studio Account
        </Button>
      </form>

      <Divider />

      <p className="text-center text-xs text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--accent)] hover:underline select-none"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
