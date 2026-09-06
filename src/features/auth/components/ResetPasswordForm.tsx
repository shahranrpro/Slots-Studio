"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { AuthHeader } from "./AuthHeader";
import { AuthError } from "./AuthError";
import { AuthSuccess } from "./AuthSuccess";
import { ArrowRight, Lock, KeyRound } from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token.trim()) {
      setError("Please provide a valid recovery token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to reset password.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message);
      setIsLoading(false);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthHeader
        title="SET NEW PASSWORD"
        subtitle="Choose a secure new password for your Slots Studio account."
      />

      <AuthError message={error} />
      <AuthSuccess message={successMessage} />

      {!successMessage ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!tokenFromUrl && (
            <FormField label="Recovery Token" htmlFor="reset-token" required>
              <Input
                id="reset-token"
                type="text"
                name="token"
                required
                placeholder="Paste recovery token here"
                leftIcon={<KeyRound className="h-4 w-4" />}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
              />
            </FormField>
          )}

          <FormField
            label="New Password (min. 8 characters)"
            htmlFor="reset-password"
            required
          >
            <Input
              id="reset-password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </FormField>

          <FormField
            label="Confirm New Password"
            htmlFor="reset-confirm-password"
            required
          >
            <Input
              id="reset-confirm-password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Redirecting to sign-in page...
          </p>
          <Link href="/login">
            <Button variant="primary" className="w-full justify-center">
              Sign In Now
            </Button>
          </Link>
        </div>
      )}

      <Divider />

      <div className="text-center">
        <Link
          href="/login"
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
