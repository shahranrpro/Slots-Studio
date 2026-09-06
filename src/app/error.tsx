"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Slots Studio Error Boundary]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)]">
          <Image
            src="/brand/logo/logo.png"
            alt="Slots Studio"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
        </div>

        <div className="space-y-2">
          <div className="inline-block rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-mono text-[var(--accent)]">
            SYSTEM NOTICE
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Something went wrong
          </h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            We couldn&apos;t complete this operation. Your project context is preserved. Please try
            again.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
