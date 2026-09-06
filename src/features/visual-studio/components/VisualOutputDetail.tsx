"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Check,
  X,
  BookmarkCheck,
  Download,
  Sliders,
  Layers,
  Sparkles,
  Crop,
  Sun,
  LayoutGrid,
  Camera,
} from "lucide-react";
import { type VisualOutput } from "../types";

export interface VisualOutputDetailProps {
  output: VisualOutput | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (outputId: string) => void;
  onReject: (outputId: string) => void;
  onSaveToProject: (outputId: string) => void;
  isLoading?: boolean;
}

export function VisualOutputDetail({
  output,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onSaveToProject,
  isLoading = false,
}: VisualOutputDetailProps) {
  if (!output) return null;

  const isApproved = output.status === "APPROVED";
  const isRejected = output.status === "REJECTED";

  const handleDownload = () => {
    if (output.assetId) {
      window.open(`/api/assets/${output.assetId}/download`, "_blank");
      return;
    }
    if (output.previewUrl) {
      window.open(output.previewUrl, "_blank");
      return;
    }
    if (!output.previewSvg) return;
    const blob = new Blob([output.previewSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={output.title}
      description={output.description}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        {/* Left Column: Full-Resolution Visual Viewport */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-square rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-3)] overflow-hidden flex items-center justify-center p-2">
            {output.previewUrl ? (
              <img
                src={output.previewUrl}
                alt={output.title}
                className="w-full h-full object-contain"
              />
            ) : output.previewSvg ? (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: output.previewSvg }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
            )}

            <div className="absolute top-3 left-3">
              <Badge variant={output.isDevelopmentPreview ? "accent" : "success"}>
                {output.isDevelopmentPreview ? "DEV PREVIEW" : "REAL AI"}
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/80 text-[var(--accent)] border border-[var(--border)]">
                {output.aspectRatio}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              {output.previewUrl ? "Export High-Res Image" : "Export SVG Preview"}
            </Button>

            {output.savedToProject && (
              <span className="font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <BookmarkCheck className="h-4 w-4" />
                <span>Saved to Project Assets</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Parameters Diagnostics & Review Controls */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Status & Mode Summary */}
            <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  REVIEW DECISION
                </span>
                <Badge
                  variant={
                    output.savedToProject
                      ? "success"
                      : isApproved
                      ? "accent"
                      : isRejected
                      ? "danger"
                      : "warning"
                  }
                >
                  {output.savedToProject
                    ? "SAVED ASSET"
                    : isApproved
                    ? "APPROVED"
                    : isRejected
                    ? "REJECTED"
                    : "NEEDS REVIEW"}
                </Badge>
              </div>

              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-[var(--text-primary)] block">
                  Mode: {output.mode.toUpperCase()}
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {output.description}
                </p>
              </div>
            </div>

            {/* Parameter Specification Slate */}
            <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
                <Sliders className="h-3.5 w-3.5" />
                <span>RENDER SPECIFICATIONS</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    <Crop className="h-3 w-3" /> Aspect Ratio:
                  </span>
                  <span className="text-[var(--text-primary)] font-bold">{output.aspectRatio}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    <Sun className="h-3 w-3" /> Lighting:
                  </span>
                  <span className="text-[var(--text-primary)] uppercase">{output.settings.lighting.replace("_", " ")}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    <LayoutGrid className="h-3 w-3" /> Background:
                  </span>
                  <span className="text-[var(--text-primary)] uppercase">{output.settings.background.replace("_", " ")}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    <Camera className="h-3 w-3" /> Composition:
                  </span>
                  <span className="text-[var(--text-primary)] uppercase">{output.settings.composition.replace("_", " ")}</span>
                </div>

                {output.settings.environment && (
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                    <span className="text-[var(--text-muted)]">Environment:</span>
                    <span className="text-[var(--text-primary)] uppercase">{output.settings.environment.replace("_", " ")}</span>
                  </div>
                )}

                {output.settings.modelDirection && (
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                    <span className="text-[var(--text-muted)]">Model Styling:</span>
                    <span className="text-[var(--text-primary)] uppercase">{output.settings.modelDirection.replace("_", " ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Provenance Info */}
            <div className="p-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[10px] font-mono text-[var(--text-muted)] space-y-1">
              <div className="flex items-center gap-1">
                <Layers className="h-3 w-3 text-[var(--accent)]" />
                <span>Job ID: {output.jobId}</span>
              </div>
              <p>Output ID: {output.id}</p>
            </div>
          </div>

          {/* Action Decision Controls */}
          <div className="space-y-2 pt-3 border-t border-[var(--border)]">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isApproved ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  onApprove(output.id);
                  onClose();
                }}
                disabled={isLoading}
                className="justify-center text-xs"
                leftIcon={<Check className="h-3.5 w-3.5" />}
              >
                Approve
              </Button>
              <Button
                variant={isRejected ? "danger" : "outline"}
                size="sm"
                onClick={() => {
                  onReject(output.id);
                  onClose();
                }}
                disabled={isLoading}
                className="justify-center text-xs"
                leftIcon={<X className="h-3.5 w-3.5" />}
              >
                Reject
              </Button>
            </div>

            {!output.savedToProject ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSaveToProject(output.id);
                }}
                disabled={isLoading}
                className="w-full justify-center text-xs"
                leftIcon={<BookmarkCheck className="h-4 w-4" />}
              >
                Save to Project Assets
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full justify-center text-xs opacity-80"
                leftIcon={<BookmarkCheck className="h-4 w-4 text-emerald-400" />}
              >
                Saved in Assets Library
              </Button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
