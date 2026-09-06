"use client";

import React from "react";
import { type WorkflowStage } from "@/data/studios";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowDown } from "lucide-react";

export interface WorkflowNodeProps {
  stage: WorkflowStage;
  isActive: boolean;
  onClick: () => void;
  isLast?: boolean;
}

export function WorkflowNode({
  stage,
  isActive,
  onClick,
  isLast = false,
}: WorkflowNodeProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center group">
      {/* Node Button / Card */}
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-[var(--radius-lg)] border p-4 transition-all duration-200 cursor-pointer select-none relative z-10",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
          isActive
            ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-md"
            : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
        )}
      >
        {/* Top Header: Step Number & Signal */}
        <div className="flex items-center justify-between pb-2">
          <span
            className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded-[var(--radius-sm)] transition-colors",
              isActive
                ? "bg-[var(--accent)] text-black"
                : "bg-[var(--surface-3)] text-[var(--text-secondary)]"
            )}
          >
            {stage.number}
          </span>

          <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
            {stage.signalTag}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
          {stage.title}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
          {stage.description}
        </p>

        {/* Active Indicator Bar */}
        {isActive && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>CONTEXT ACTIVE</span>
          </div>
        )}
      </button>

      {/* Desktop Horizontal Connector Arrow */}
      {!isLast && (
        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none text-[var(--border-strong)] group-hover:text-[var(--accent)] transition-colors">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}

      {/* Mobile Vertical Connector Arrow */}
      {!isLast && (
        <div className="flex lg:hidden my-2 items-center justify-center text-[var(--border-strong)]">
          <ArrowDown className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
