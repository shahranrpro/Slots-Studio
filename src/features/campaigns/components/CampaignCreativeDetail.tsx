"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type CampaignOutput } from "@/lib/campaigns/types";
import { X, Check, Bookmark, Download, Copy, CheckCheck } from "lucide-react";

export interface CampaignCreativeDetailProps {
  output: CampaignOutput | null;
  onClose: () => void;
  onApprove: (outputId: string) => Promise<void>;
  onReject: (outputId: string) => Promise<void>;
  onSaveToAssets: (outputId: string) => Promise<void>;
}

export function CampaignCreativeDetail({
  output,
  onClose,
  onApprove,
  onReject,
  onSaveToAssets,
}: CampaignCreativeDetailProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!output) return null;

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(output.previewSvg);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([output.previewSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.campaignName.toLowerCase().replace(/\s+/g, "_")}_${output.channel.toLowerCase()}_${output.aspectRatio.replace(":", "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveToAssets(output.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[var(--surface-1)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Big Vector Art Viewer */}
        <div className="flex-1 bg-black/95 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border)] overflow-hidden min-h-[360px]">
          <div
            className="w-full max-w-md max-h-[75vh] shadow-2xl rounded-[var(--radius-sm)] overflow-hidden"
            dangerouslySetInnerHTML={{ __html: output.previewSvg }}
          />
        </div>

        {/* Right Side: Creative Spec & Decision Panel */}
        <div className="w-full md:w-96 p-6 flex flex-col justify-between space-y-6 overflow-y-auto bg-[var(--surface-1)]">
          <div className="space-y-4">
            {/* Top Close & Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 rounded border border-white/20">
                  {output.channel}
                </span>
                <span className="font-mono text-xs font-bold text-[var(--accent)] bg-black px-2 py-0.5 rounded border border-[var(--accent)]/30">
                  {output.aspectRatio}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                aria-label="Close inspector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Title & Copy Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    output.status === "APPROVED"
                      ? "success"
                      : output.status === "REJECTED"
                      ? "danger"
                      : "accent"
                  }
                >
                  {output.status}
                </Badge>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {output.outputType}
                </span>
              </div>

              <h2 className="font-display text-lg font-bold text-[var(--text-primary)] leading-snug">
                {output.headline}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {output.subheadline}
              </p>
            </div>

            {/* Campaign & Slot Metadata */}
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">CAMPAIGN:</span>
                <p className="font-mono font-semibold text-[var(--text-primary)]">{output.campaignName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">SLOT CODE:</span>
                  <p className="font-mono font-semibold text-[var(--accent)]">{output.slotCode}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">CTA ACTION:</span>
                  <p className="font-mono font-semibold text-[var(--text-primary)]">{output.ctaText}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">ENGINE:</span>
                <p className="font-mono text-[11px] text-[var(--text-muted)]">{output.metadata.modelLabel}</p>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySvg}
                leftIcon={isCopied ? <CheckCheck className="h-3.5 w-3.5 text-[var(--accent)]" /> : <Copy className="h-3.5 w-3.5" />}
                className="flex-1 text-xs"
              >
                {isCopied ? "Copied SVG" : "Copy SVG"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSvg}
                leftIcon={<Download className="h-3.5 w-3.5" />}
                className="flex-1 text-xs"
              >
                Download .svg
              </Button>
            </div>
          </div>

          {/* Bottom Review & Save Actions */}
          <div className="space-y-2 pt-4 border-t border-[var(--border)]">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await onReject(output.id);
                  onClose();
                }}
                leftIcon={<X className="h-3.5 w-3.5 text-red-400" />}
                className="text-xs hover:border-red-500/50 hover:text-red-400"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  await onApprove(output.id);
                }}
                leftIcon={<Check className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                Approve
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              isLoading={isSaving}
              onClick={handleSave}
              leftIcon={<Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />}
              className="w-full text-xs font-semibold"
            >
              {output.savedAssetId ? "Saved in Assets Library" : "Save as Design Asset"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
