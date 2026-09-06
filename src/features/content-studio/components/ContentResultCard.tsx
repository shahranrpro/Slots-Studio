"use client";

import React, { useState } from "react";
import { type ContentOutput } from "@/lib/content/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Copy,
  Check,
  Maximize2,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentResultCardProps {
  output: ContentOutput;
  isSelected?: boolean;
  onSelect: (output: ContentOutput) => void;
  onApprove: (output: ContentOutput) => void;
  onReject: (output: ContentOutput) => void;
}

export function ContentResultCard({
  output,
  isSelected,
  onSelect,
  onApprove,
  onReject,
}: ContentResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(output.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (output.status) {
      case "APPROVED":
        return (
          <Badge variant="success" dot>
            APPROVED
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="danger">REJECTED</Badge>;
      default:
        return (
          <Badge variant="accent" dot>
            IN REVIEW
          </Badge>
        );
    }
  };

  return (
    <Card
      variant="interactive"
      onClick={() => onSelect(output)}
      className={cn(
        "p-4 space-y-3.5 border transition-all flex flex-col justify-between cursor-pointer select-none",
        isSelected
          ? "border-[var(--accent)] bg-[var(--surface-3)] shadow-md"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[var(--accent)] uppercase">
            {output.contentType.replace("_", " ")}
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]">
            v{output.version}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {output.savedAssetId && (
            <span
              className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
              title="Saved in Shared Assets Library"
            >
              <FileCheck className="h-3 w-3" />
              <span>SAVED</span>
            </span>
          )}
          {getStatusBadge()}
        </div>
      </div>

      {/* Title & Preview Snippet */}
      <div className="space-y-2 flex-1">
        <h3 className="text-xs font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
          {output.title}
        </h3>

        <div className="text-[11px] font-mono text-[var(--text-secondary)] line-clamp-4 leading-relaxed bg-[var(--surface-2)] p-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] whitespace-pre-line">
          {output.content.replace(/^#+\s+/gm, "")}
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="pt-2 border-t border-[var(--border)]/60 space-y-2.5 text-[10px] font-mono">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span>
            {output.metadata.wordCount} words • {output.metadata.charCount} chars
          </span>
          <span className="text-[var(--accent)] font-semibold uppercase">
            {output.tone} • {output.audience.replace("_", " ")}
          </span>
        </div>

        {/* Quick Action Bar */}
        <div
          className="flex items-center justify-between pt-1 gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-[10px] h-7 px-2"
            leftIcon={
              copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )
            }
          >
            {copied ? "Copied" : "Copy"}
          </Button>

          <div className="flex items-center gap-1">
            {output.status !== "APPROVED" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onApprove(output)}
                className="text-[10px] h-7 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                leftIcon={<CheckCircle2 className="h-3 w-3" />}
              >
                Approve
              </Button>
            )}

            {output.status !== "REJECTED" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onReject(output)}
                className="text-[10px] h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                leftIcon={<XCircle className="h-3 w-3" />}
              >
                Reject
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelect(output)}
              className="text-[10px] h-7 px-2"
              rightIcon={<Maximize2 className="h-3 w-3" />}
            >
              Inspect
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
