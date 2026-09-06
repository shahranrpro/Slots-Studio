"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Divider } from "@/components/ui/Divider";
import { AuthHeader } from "./AuthHeader";
import { AuthError } from "./AuthError";
import { ArrowRight, Lock, Mail } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // Success: clean navigation to intended destination
      window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthHeader
        title="SIGN IN TO SLOTS STUDIO"
        subtitle="Enter your credentials to access your creative workspace and studios."
      />

      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <FormField label="Email Address" htmlFor="login-email" required>
          <Input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="name@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Password Field */}
        <div className="space-y-1">
          <FormField label="Password" htmlFor="login-password" required>
            <Input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </FormField>
          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors select-none"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember Me */}
        <div className="pt-1">
          <Checkbox
            label="Keep me signed in on this device"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
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
          Sign In
        </Button>
      </form>

      <Divider />

      <p className="text-center text-xs text-[var(--text-secondary)]">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--accent)] hover:underline select-none"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
