"use client";

import React, { useState } from "react";
import { type ContentOutput } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Maximize2,
  FileCheck,
} from "lucide-react";

export interface ContentReviewBarProps {
  selectedOutput: ContentOutput | null;
  onInspect: (output: ContentOutput) => void;
  onApprove: (output: ContentOutput) => void;
  onReject: (output: ContentOutput) => void;
  onSaveToAssets: (output: ContentOutput) => void;
}

export function ContentReviewBar({
  selectedOutput,
  onInspect,
  onApprove,
  onReject,
  onSaveToAssets,
}: ContentReviewBarProps) {
  const [copied, setCopied] = useState(false);

  if (!selectedOutput) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOutput.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky bottom-4 z-20 mx-auto max-w-4xl rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface-1)]/95 p-3 shadow-2xl backdrop-blur-md select-none transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Active Output Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-[10px] uppercase font-bold text-[var(--accent)] bg-[var(--surface-3)] px-2 py-1 rounded border border-[var(--border)]">
            SELECTED CANDIDATE
          </span>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[280px]">
              {selectedOutput.title}
            </h4>
            <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
              {selectedOutput.contentType.replace("_", " ")} • v{selectedOutput.version} • {selectedOutput.metadata.wordCount} words
            </p>
          </div>
        </div>

        {/* Right: Decision Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs"
            leftIcon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
          >
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInspect(selectedOutput)}
            className="text-xs"
            leftIcon={<Maximize2 className="h-3.5 w-3.5" />}
          >
            Inspect / Edit
          </Button>

          {selectedOutput.status !== "REJECTED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onReject(selectedOutput)}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
              leftIcon={<XCircle className="h-3.5 w-3.5" />}
            >
              Reject
            </Button>
          )}

          {selectedOutput.status !== "APPROVED" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onApprove(selectedOutput)}
              className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Approve
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSaveToAssets(selectedOutput)}
            className="text-xs font-bold"
            leftIcon={<FileCheck className="h-3.5 w-3.5" />}
          >
            {selectedOutput.savedAssetId ? "Saved in Assets" : "Save as Asset"}
          </Button>
        </div>
      </div>
    </div>
  );
}
