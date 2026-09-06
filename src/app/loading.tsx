export default function GlobalLoading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6"
      role="status"
      aria-live="polite"
      aria-label="Loading Slots Studio"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        <p className="text-xs font-medium tracking-wider uppercase text-[var(--text-muted)]">
          Loading Slots Studio...
        </p>
      </div>
    </main>
  );
}
