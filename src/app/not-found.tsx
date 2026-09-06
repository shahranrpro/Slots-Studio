import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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
            priority
          />
        </div>

        <div className="space-y-2">
          <div className="inline-block rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-mono text-[var(--accent)]">
            404 ERROR
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The slot or resource you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Return to Overview
        </Link>
      </div>
    </main>
  );
}
