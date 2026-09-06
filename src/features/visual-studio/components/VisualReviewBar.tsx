"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  X,
  RotateCcw,
  BookmarkCheck,
  Eye,
} from "lucide-react";
import { type VisualOutput } from "../types";

export interface VisualReviewBarProps {
  selectedOutput: VisualOutput | null;
  onInspect: (output: VisualOutput) => void;
  onApprove: (outputId: string) => void;
  onReject: (outputId: string) => void;
  onRegenerate: () => void;
  onSaveToProject: (outputId: string) => void;
  isLoading?: boolean;
}

export function VisualReviewBar({
  selectedOutput,
  onInspect,
  onApprove,
  onReject,
  onRegenerate,
  onSaveToProject,
  isLoading = false,
}: VisualReviewBarProps) {
  if (!selectedOutput) return null;

  const isApproved = selectedOutput.status === "APPROVED";
  const isRejected = selectedOutput.status === "REJECTED";

  return (
    <div className="sticky bottom-4 z-20 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface-1)]/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      {/* Left: Selected Output Info */}
      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
        <div className="h-10 w-10 shrink-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-3)] overflow-hidden flex items-center justify-center p-1">
          {selectedOutput.previewSvg && (
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: selectedOutput.previewSvg }}
            />
          )}
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase">
              {`${selectedOutput.mode} // ${selectedOutput.aspectRatio}`}
            </span>
            <Badge
              variant={
                selectedOutput.savedToProject
                  ? "success"
                  : isApproved
                  ? "accent"
                  : isRejected
                  ? "danger"
                  : "warning"
              }
              size="sm"
            >
              {selectedOutput.savedToProject
                ? "SAVED"
                : isApproved
                ? "APPROVED"
                : isRejected
                ? "REJECTED"
                : "PENDING REVIEW"}
            </Badge>
          </div>
          <p className="font-semibold text-xs text-[var(--text-primary)] truncate max-w-sm">
            {selectedOutput.title}
          </p>
        </div>
      </div>

      {/* Right: Decision Actions */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInspect(selectedOutput)}
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          className="text-xs"
        >
          Inspect
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          className="text-xs"
        >
          Regenerate
        </Button>

        <Button
          variant={isRejected ? "danger" : "outline"}
          size="sm"
          onClick={() => onReject(selectedOutput.id)}
          disabled={isLoading}
          className="text-xs"
          leftIcon={<X className="h-3.5 w-3.5" />}
        >
          Reject
        </Button>

        <Button
          variant={isApproved ? "primary" : "outline"}
          size="sm"
          onClick={() => onApprove(selectedOutput.id)}
          disabled={isLoading}
          className="text-xs"
          leftIcon={<Check className="h-3.5 w-3.5" />}
        >
          Approve
        </Button>

        {!selectedOutput.savedToProject ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSaveToProject(selectedOutput.id)}
            disabled={isLoading}
            className="text-xs"
            leftIcon={<BookmarkCheck className="h-3.5 w-3.5" />}
          >
            Save Asset
          </Button>
        ) : (
          <span className="font-mono text-xs text-emerald-400 font-semibold px-2 flex items-center gap-1">
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>
    </div>
  );
}
