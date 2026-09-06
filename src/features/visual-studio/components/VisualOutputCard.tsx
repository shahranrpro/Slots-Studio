"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, X, BookmarkCheck, Eye, Sparkles } from "lucide-react";
import { type VisualOutput } from "../types";

export interface VisualOutputCardProps {
  output: VisualOutput;
  isSelected: boolean;
  onSelect: (outputId: string) => void;
  onInspect: (output: VisualOutput) => void;
  onApprove: (outputId: string) => void;
  onReject: (outputId: string) => void;
  onSaveToProject: (outputId: string) => void;
  isLoading?: boolean;
}

export function VisualOutputCard({
  output,
  isSelected,
  onSelect,
  onInspect,
  onApprove,
  onReject,
  onSaveToProject,
  isLoading = false,
}: VisualOutputCardProps) {
  const isApproved = output.status === "APPROVED";
  const isRejected = output.status === "REJECTED";

  const getAspectClass = () => {
    switch (output.aspectRatio) {
      case "1:1":
        return "aspect-square";
      case "4:5":
        return "aspect-[4/5]";
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
        return "aspect-video";
      default:
        return "aspect-square";
    }
  };

  return (
    <Card
      variant="interactive"
      onClick={() => onSelect(output.id)}
      className={`group p-3 flex flex-col justify-between border transition-all duration-150 select-none cursor-pointer ${
        isSelected
          ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-md ring-1 ring-[var(--accent)]/50"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
      }`}
    >
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
              {output.mode}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {output.aspectRatio}
            </span>
            {!output.isDevelopmentPreview && (
              <span className="font-mono text-[9px] font-semibold uppercase px-1 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                REAL AI
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {output.savedToProject ? (
              <Badge variant="success" size="sm">
                SAVED
              </Badge>
            ) : isApproved ? (
              <Badge variant="accent" size="sm">
                APPROVED
              </Badge>
            ) : isRejected ? (
              <Badge variant="danger" size="sm">
                REJECTED
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                REVIEW
              </Badge>
            )}
          </div>
        </div>

        {/* Visual Preview Frame */}
        <div
          className={`relative w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-3)] overflow-hidden flex items-center justify-center ${getAspectClass()}`}
        >
          {output.previewUrl ? (
            <img
              src={output.previewUrl}
              alt={output.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : output.previewSvg ? (
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block pointer-events-none"
              dangerouslySetInnerHTML={{ __html: output.previewSvg }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Sparkles className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
          )}

          {/* Quick Hover Inspect Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onInspect(output);
              }}
              leftIcon={<Eye className="h-3.5 w-3.5" />}
              className="text-xs shadow-lg bg-black/80 text-white border-white/20 hover:bg-black"
            >
              Inspect
            </Button>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-1">
          <span className="font-bold text-xs text-[var(--text-primary)] block truncate">
            {output.title}
          </span>
          <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
            Light: {output.settings.lighting.replace("_", " ")} | Cyc: {output.settings.background.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Footer Review Controls */}
      <div
        className="pt-2 mt-2.5 border-t border-[var(--border)]/70 flex items-center justify-between gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <Button
            variant={isApproved ? "primary" : "outline"}
            size="sm"
            onClick={() => onApprove(output.id)}
            disabled={isLoading}
            title="Approve Direction"
            leftIcon={<Check className="h-3 w-3" />}
            className="text-xs py-0.5 px-2"
          >
            Approve
          </Button>
          <Button
            variant={isRejected ? "danger" : "outline"}
            size="sm"
            onClick={() => onReject(output.id)}
            disabled={isLoading}
            title="Reject Direction"
            className="text-xs py-0.5 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {!output.savedToProject ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSaveToProject(output.id)}
            disabled={isLoading}
            title="Save Asset to Project"
            leftIcon={<BookmarkCheck className="h-3 w-3 text-[var(--accent)]" />}
            className="text-xs py-0.5 px-2"
          >
            Save
          </Button>
        ) : (
          <span className="font-mono text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <BookmarkCheck className="h-3 w-3" />
            <span>Saved</span>
          </span>
        )}
      </div>
    </Card>
  );
}
