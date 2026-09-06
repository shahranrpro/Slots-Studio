import React from "react";
import { type Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Layers, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Documentation — Slots Studio",
  description: "Documentation and help resources for Slots Studio.",
  robots: { index: false, follow: false },
};

export default function HelpPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-4 space-y-1">
        <Badge variant="accent" dot>
          DOCUMENTATION
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          HELP & SUPPORT
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Reference guides, keyboard shortcuts, and studio workflow documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Terminal className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Use global shortcuts to navigate quickly across studios and tools.
          </CardDescription>
          <div className="pt-2 text-xs font-mono space-y-1.5 border-t border-[var(--border)]">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Command Menu:</span>
              <kbd className="text-[var(--accent)]">⌘K / Ctrl+K</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Close Modals:</span>
              <kbd className="text-[var(--accent)]">ESC</kbd>
            </div>
          </div>
        </Card>

        <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Layers className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm">Connected Studios Overview</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Learn how single product concepts flow across all five studios.
          </CardDescription>
          <div className="pt-3 border-t border-[var(--border)]">
            <Link href="/workflow">
              <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                View Workflow Guide
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
