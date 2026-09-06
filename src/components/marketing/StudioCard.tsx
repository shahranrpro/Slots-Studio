import React from "react";
import Link from "next/link";
import { type StudioDetail } from "@/data/studios";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudioCardProps {
  studio: StudioDetail;
  isFeatured?: boolean;
  className?: string;
}

export function StudioCard({ studio, isFeatured = false, className }: StudioCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-1)] p-6 sm:p-8 transition-all duration-200",
        "hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] shadow-xs",
        isFeatured && "lg:col-span-6 bg-[var(--surface-1)]/90 border-[var(--border-strong)]",
        className
      )}
    >
      <div className="space-y-5">
        {/* Top Header: Number & Tagline */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--text-secondary)] group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
            STUDIO {studio.number}
          </span>

          <Badge variant="outline">{studio.tagline}</Badge>
        </div>

        {/* Studio Name & Description */}
        <div className="space-y-1.5">
          <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            {studio.name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {studio.description}
          </p>
        </div>

        {/* Capabilities List */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
            Core Capabilities
          </span>
          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            {studio.capabilities.map((cap) => (
              <li key={cap} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer: Output Artifact & Action Link */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--border)]">
        <span className="font-mono text-[11px] text-[var(--text-muted)]">
          Output: <strong className="text-[var(--text-primary)]">{studio.outputType}</strong>
        </span>

        <Link
          href={studio.href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors select-none"
        >
          <span>Explore</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
